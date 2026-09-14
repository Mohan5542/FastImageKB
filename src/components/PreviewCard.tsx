import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ArrowRight,
  TrendingDown,
  Clock,
  Sparkles,
  Eye,
  Columns2,
  SlidersHorizontal,
  FileDown,
  Code,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImageItem } from '../types';
import { formatBytes } from '../utils/compressor';

interface PreviewCardProps {
  item: ImageItem;
  onDownload: () => void;
  isProcessing?: boolean;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  item,
  onDownload,
  isProcessing = false,
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'split-slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [copied, setCopied] = useState(false);
  const [copiedDataUri, setCopiedDataUri] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const res = item.result;
  const originalSizeFormatted = formatBytes(item.originalSize);
  const compressedSizeFormatted = res ? formatBytes(res.sizeBytes) : '...';
  const reduction = res ? res.reductionPercent : 0;
  const isReduced = reduction > 0;

  // Handle Split Slider Drag
  const handleSliderMove = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX, e.currentTarget);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX, e.currentTarget);
    }
  };

  const handleCopyImage = async () => {
    if (!res) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        // Must be PNG for ClipboardItem in some browsers
        const img = new Image();
        img.src = res.url;
        await new Promise((r) => (img.onload = r));
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        }, 'image/png');
      }
    } catch (err) {
      console.error('Failed to copy image to clipboard', err);
    }
  };

  const handleCopyDataUri = () => {
    if (!res) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        navigator.clipboard.writeText(reader.result);
        setCopiedDataUri(true);
        setTimeout(() => setCopiedDataUri(false), 2000);
      }
    };
    reader.readAsDataURL(res.blob);
  };

  const handleDownloadClick = () => {
    // Fire festive micro-confetti on successful download
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#6366f1', '#38bdf8'],
      });
    } catch {
      // Ignored if canvas-confetti is not available
    }
    onDownload();
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm space-y-4 sm:space-y-5">
      {/* Top Header & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {item.name}
            </h3>
            {isReduced && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[10px] sm:text-xs font-bold text-emerald-400">
                <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>−{reduction}%</span>
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
            Original: {item.originalWidth}×{item.originalHeight} px ({originalSizeFormatted})
          </p>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-zinc-950 p-1 border border-zinc-800/80">
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              id="btn-view-side-by-side"
            >
              <Columns2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Side-by-Side</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split-slider')}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium transition-all ${
                viewMode === 'split-slider'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              id="btn-view-split-slider"
            >
              <SlidersHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Split Slider</span>
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 sm:p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            title="View Full Size (Zoom)"
          >
            <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar if processing */}
      {isProcessing && (
        <div className="space-y-1.5 animate-pulse">
          <div className="flex justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              Compressing with binary search canvas engine...
            </span>
            <span>{item.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-950">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* VIEW A: Side-by-Side Comparison */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* ORIGINAL CARD */}
          <div className="space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-2 sm:p-3.5 min-w-0">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="font-semibold text-zinc-300 truncate">Original</span>
              <span className="font-mono text-zinc-400 pl-1">{originalSizeFormatted}</span>
            </div>

            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-checkerboard border border-zinc-900">
              <img
                src={item.originalUrl}
                alt="Original"
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between text-[8px] sm:text-[11px] text-zinc-400 pt-1">
              <span className="truncate">{item.originalWidth} × {item.originalHeight} px</span>
              <span className="uppercase ml-1">{item.originalMimeType.replace('image/', '')}</span>
            </div>
          </div>

          {/* OPTIMIZED CARD */}
          <div className="space-y-2 rounded-xl border border-blue-500/30 bg-zinc-950/70 p-2 sm:p-3.5 shadow-sm min-w-0">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <span className="font-semibold text-blue-400 flex items-center gap-1 min-w-0">
                <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                <span className="truncate">Optimized</span>
              </span>
              <span className="font-mono font-bold text-emerald-400 pl-1">
                {compressedSizeFormatted}
              </span>
            </div>

            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-checkerboard border border-zinc-900">
              {res ? (
                <img
                  src={res.url}
                  alt="Optimized"
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[10px] sm:text-xs text-zinc-400">
                  <Sparkles className="h-4 sm:h-6 w-4 sm:w-6 text-blue-500/40 animate-spin mb-2" />
                  <span>Generating preview...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-zinc-400 pt-1">
              <span>
                {res ? `${res.width} × ${res.height} px` : '...'}
              </span>
              <span className="font-medium text-emerald-400">
                {res ? `Saved ${formatBytes(Math.max(0, item.originalSize - res.sizeBytes))}` : ''}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW B: Interactive Before / After Split Slider */
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between text-[10px] sm:text-xs text-zinc-400 px-1">
            <span>◀ Original ({originalSizeFormatted})</span>
            <span className="font-medium text-blue-400 hidden sm:inline">Drag divider to compare quality</span>
            <span className="font-medium text-blue-400 sm:hidden">Drag divider</span>
            <span>Optimized ({compressedSizeFormatted}) ▶</span>
          </div>

          <div
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={(e) => handleSliderMove(e.clientX, e.currentTarget)}
            className="relative aspect-video w-full select-none overflow-hidden rounded-xl bg-checkerboard border border-zinc-800 cursor-ew-resize"
          >
            {/* Optimized image (Base background) */}
            {res && (
              <img
                src={res.url}
                alt="Optimized"
                className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Original image (Clipped overlay) */}
            <img
              src={item.originalUrl}
              alt="Original"
              className="absolute inset-0 h-full w-full object-contain pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              referrerPolicy="no-referrer"
            />

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl border-2 border-blue-500">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Stats Bar */}
      {res && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 rounded-xl bg-zinc-950/80 p-3 border border-zinc-800/80 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400">Target Size Status</span>
            <div className="font-semibold text-zinc-200 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{res.sizeBytes <= item.settings.targetKB * 1024 ? 'Under Target' : 'Approximated'}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400">Quality Applied</span>
            <div className="font-mono font-semibold text-zinc-200">
              {res.qualityUsed}% ({res.iterationsCount} passes)
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400">Engine Speed</span>
            <div className="font-mono font-semibold text-zinc-200 flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-400" />
              <span>{res.processingTimeMs} ms</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400">Estimated 3G/4G Save</span>
            <div className="font-mono font-semibold text-emerald-400">
              ~{Math.max(0.1, (item.originalSize - res.sizeBytes) / (1024 * 300)).toFixed(1)}s faster
            </div>
          </div>
        </div>
      )}

      {/* Main Download & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
        {/* Large Prominent Download Button */}
        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={!res || isProcessing}
          className="flex flex-1 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          id="btn-download-primary"
        >
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Download Compressed ({compressedSizeFormatted})</span>
        </button>

        {/* Auxiliary actions */}
        <div className="flex w-full sm:w-auto items-center gap-2">
          <button
            type="button"
            onClick={handleCopyImage}
            disabled={!res || isProcessing}
            className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-zinc-700/80 bg-zinc-800/80 px-3 py-2.5 sm:px-4 sm:py-3.5 text-[10px] sm:text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
            title="Copy image to clipboard"
            id="btn-copy-clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Overlay */}
      {isZoomed && res && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/98 backdrop-blur-xl p-2 sm:p-8 z-[100]">
          <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 flex-shrink-0 gap-2 p-2 sm:p-0">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white max-w-[200px] sm:max-w-xl truncate">{item.name}</h3>
              <p className="text-[9px] sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
                Original: {originalSizeFormatted} <span className="mx-1 sm:mx-2">•</span> Optimized: {compressedSizeFormatted}
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* View Mode Toggle (Zoomed) */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-zinc-900 p-1 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setViewMode('side-by-side')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    viewMode === 'side-by-side' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Columns2 className="h-4 w-4" />
                  Side-by-Side
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('split-slider')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    viewMode === 'split-slider' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Split Slider
                </button>
              </div>

              <button
                onClick={() => setIsZoomed(false)}
                className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full overflow-hidden flex items-center justify-center">
            {viewMode === 'side-by-side' ? (
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full h-full max-w-[1600px] overflow-auto pb-8">
                <div className="flex-1 flex flex-col gap-2 min-h-[400px]">
                  <span className="text-sm font-semibold text-zinc-400 text-center">Original Image</span>
                  <div className="flex-1 rounded-xl bg-checkerboard border border-zinc-800 overflow-hidden relative">
                    <img src={item.originalUrl} className="absolute inset-0 h-full w-full object-contain" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2 min-h-[400px]">
                  <span className="text-sm font-semibold text-blue-400 text-center">Optimized Result</span>
                  <div className="flex-1 rounded-xl bg-checkerboard border border-zinc-800 shadow-2xl shadow-blue-900/10 overflow-hidden relative">
                    <img src={res.url} className="absolute inset-0 h-full w-full object-contain" />
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="relative w-full h-full max-w-[1400px] max-h-[85vh] rounded-xl overflow-hidden bg-checkerboard border border-zinc-800 shadow-2xl cursor-ew-resize"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onClick={(e) => handleSliderMove(e.clientX, e.currentTarget)}
              >
                 <img src={res.url} className="absolute inset-0 h-full w-full object-contain pointer-events-none" />
                 <img src={item.originalUrl} className="absolute inset-0 h-full w-full object-contain pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} />
                 <div
                    className="absolute inset-y-0 z-10 w-0.5 pointer-events-none bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-1.5 shadow-lg">
                      <SlidersHorizontal className="h-5 w-5 text-zinc-800" />
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
