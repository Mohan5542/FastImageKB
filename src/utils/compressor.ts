import { CompressionSettings, OutputFormat, ProcessedResult } from '../types';

/**
 * Format bytes into human-readable string (e.g. 45.2 KB, 1.2 MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Load an image from URL or Blob into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image data.'));
    img.src = src;
  });
}

/**
 * Helper to convert canvas to Blob using Promise
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion returned null.'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Draw image onto a canvas with crisp bicubic scaling and optional background fill
 */
function renderImageToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  fillBackground: boolean = false,
  backgroundColor: string = '#ffffff'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D context for canvas');

  // Configure high quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (fillBackground) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Resolves the actual MIME type to use based on settings and original format
 */
export function resolveMimeType(
  outputFormat: OutputFormat,
  originalMimeType: string
): string {
  if (outputFormat === 'original') {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(originalMimeType)) {
      return originalMimeType;
    }
    return 'image/jpeg';
  }
  return outputFormat;
}

/**
 * Primary Compression Engine:
 * Implements Binary Search & Adaptive Quality/Dimension Reduction
 */
export async function compressImage(
  imageSource: string | Blob,
  settings: CompressionSettings,
  originalMimeType: string,
  onProgress?: (progress: number) => void
): Promise<ProcessedResult> {
  const startTime = performance.now();
  onProgress?.(10);

  // 1. Load image
  const imgUrl = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);
  const img = await loadImage(imgUrl);
  if (typeof imageSource !== 'string') {
    URL.revokeObjectURL(imgUrl);
  }

  onProgress?.(25);

  const effectiveMimeType = resolveMimeType(settings.outputFormat, originalMimeType);
  const isJpeg = effectiveMimeType === 'image/jpeg';
  
  // Target dimensions based on settings
  let curWidth = settings.width > 0 ? settings.width : img.naturalWidth;
  let curHeight = settings.height > 0 ? settings.height : img.naturalHeight;

  let finalBlob: Blob | null = null;
  let finalQuality = 0.92;
  let iterations = 0;

  // Render initial canvas
  let canvas = renderImageToCanvas(
    img,
    curWidth,
    curHeight,
    isJpeg,
    settings.backgroundColorForJpeg || '#ffffff'
  );

  onProgress?.(45);

  // MODE A: Manual Quality Mode
  if (settings.mode === 'manual-quality') {
    finalQuality = Math.max(0.01, Math.min(1.0, settings.manualQuality / 100));
    finalBlob = await canvasToBlob(canvas, effectiveMimeType, finalQuality);
    iterations = 1;
    onProgress?.(90);
  } 
  // MODE B: Target KB Mode (Intelligent Binary Search Algorithm)
  else {
    const unitMultiplier = settings.targetUnit === 'MB' ? 1024 * 1024 : 1024;
    const targetBytes = Math.max(1, settings.targetKB) * unitMultiplier;
    
    // For PNG (lossless format without native browser quality parameter)
    if (effectiveMimeType === 'image/png') {
      let testBlob = await canvasToBlob(canvas, effectiveMimeType);
      iterations = 1;

      // If PNG exceeds target KB and autoDownscale is allowed, iteratively downscale dimensions
      if (testBlob.size > targetBytes && settings.autoDownscaleIfTargetExceeded) {
        // More aggressive downscale for PNG because size scales with area (squared) and PNG is lossless
        let scale = Math.min(0.9, Math.sqrt(targetBytes / testBlob.size) * 0.95);
        for (let i = 0; i < 7 && testBlob.size > targetBytes; i++) {
          iterations++;
          curWidth = Math.max(16, Math.round(curWidth * scale));
          curHeight = Math.max(16, Math.round(curHeight * scale));
          canvas = renderImageToCanvas(img, curWidth, curHeight, false);
          testBlob = await canvasToBlob(canvas, effectiveMimeType);
          scale *= 0.8; // Get more aggressive if still failing
          onProgress?.(45 + Math.round((i / 7) * 45));
        }
      }
      finalBlob = testBlob;
      finalQuality = 1.0;
    } 
    // For JPEG & WebP: Binary Search on compression quality
    else {
      let lowQ = 0.02;
      let highQ = 0.98;
      let bestBlob: Blob | null = null;
      let bestQuality = 0.8;
      const maxIterations = 7; // Provides ~0.75% quality precision in 7 steps

      for (let i = 0; i < maxIterations; i++) {
        iterations++;
        const midQ = (lowQ + highQ) / 2;
        const testBlob = await canvasToBlob(canvas, effectiveMimeType, midQ);
        
        onProgress?.(45 + Math.round((i / maxIterations) * 40));

        if (testBlob.size <= targetBytes) {
          // It fits! Record as valid candidate and try higher quality
          bestBlob = testBlob;
          bestQuality = midQ;
          lowQ = midQ; // search higher quality range
        } else {
          // Too large, decrease quality
          highQ = midQ;
          if (!bestBlob) {
            bestBlob = testBlob;
            bestQuality = midQ;
          }
        }
      }

      // If even at minimum quality it exceeds targetBytes and auto-downscale is enabled:
      if (bestBlob && bestBlob.size > targetBytes && settings.autoDownscaleIfTargetExceeded) {
        let dimensionScale = Math.min(0.9, Math.sqrt(targetBytes / bestBlob.size) * 0.95);
        for (let j = 0; j < 5 && bestBlob.size > targetBytes; j++) {
          iterations++;
          curWidth = Math.max(20, Math.round(curWidth * dimensionScale));
          curHeight = Math.max(20, Math.round(curHeight * dimensionScale));
          
          canvas = renderImageToCanvas(
            img,
            curWidth,
            curHeight,
            isJpeg,
            settings.backgroundColorForJpeg || '#ffffff'
          );

          const candidate = await canvasToBlob(canvas, effectiveMimeType, 0.75);
          bestBlob = candidate;
          bestQuality = 0.75;
          dimensionScale *= 0.85;
          onProgress?.(85 + j * 2);
        }
      }

      finalBlob = bestBlob || (await canvasToBlob(canvas, effectiveMimeType, 0.75));
      finalQuality = bestQuality;
    }
  }

  onProgress?.(100);

  const endTime = performance.now();
  const processingTimeMs = Math.round(endTime - startTime);
  const resultUrl = URL.createObjectURL(finalBlob);

  const originalSize = typeof imageSource === 'string' ? finalBlob.size : (imageSource as Blob).size;
  const reductionPercent = originalSize > 0
    ? Math.max(0, Math.round(((originalSize - finalBlob.size) / originalSize) * 1000) / 10)
    : 0;

  return {
    blob: finalBlob,
    url: resultUrl,
    sizeBytes: finalBlob.size,
    width: canvas.width,
    height: canvas.height,
    format: effectiveMimeType as OutputFormat,
    qualityUsed: Math.round(finalQuality * 100),
    processingTimeMs,
    reductionPercent,
    iterationsCount: iterations,
  };
}
