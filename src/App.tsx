/**
 * FastImageKB - Free Client-Side Image Resizer & Compressor
 * 100% In-Browser HTML5 Canvas Processing Engine
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { ControlsPanel } from './components/ControlsPanel';
import { PreviewCard } from './components/PreviewCard';
import { BatchQueue } from './components/BatchQueue';
import { FeaturesInfo } from './components/FeaturesInfo';
import { Footer } from './components/Footer';
import { AdPlacement } from './components/AdPlacement';
import { PrivacyModal, FaqModal } from './components/InfoModals';
import { ImageItem, CompressionSettings, OutputFormat } from './types';
import { compressImage, resolveMimeType } from './utils/compressor';
import { SampleImageOption } from './utils/sampleImages';

const DEFAULT_SETTINGS: CompressionSettings = {
  mode: 'target-kb',
  targetKB: 50,
  manualQuality: 80,
  outputFormat: 'image/jpeg',
  width: 0,
  height: 0,
  originalWidth: 0,
  originalHeight: 0,
  lockAspectRatio: true,
  scalePercent: 100,
  autoDownscaleIfTargetExceeded: true,
  backgroundColorForJpeg: '#ffffff',
};

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const activeItem = images.find((img) => img.id === activeId) || images[0];

  // Debounce ref for live compression on settings adjustments
  const debounceTimerRef = useRef<number | null>(null);

  /**
   * Run compression on a single image item
   */
  const processImageItem = useCallback(
    async (
      item: ImageItem,
      settingsToUse?: CompressionSettings
    ): Promise<ImageItem> => {
      const currentSettings = settingsToUse || item.settings;

      setImages((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: 'processing', progress: 10 } : it
        )
      );

      try {
        const result = await compressImage(
          item.originalBlob,
          currentSettings,
          item.originalMimeType,
          (progress) => {
            setImages((prev) =>
              prev.map((it) =>
                it.id === item.id ? { ...it, progress } : it
              )
            );
          }
        );

        const updated: ImageItem = {
          ...item,
          settings: currentSettings,
          status: 'done',
          progress: 100,
          result,
          error: undefined,
        };

        setImages((prev) =>
          prev.map((it) => (it.id === item.id ? updated : it))
        );

        return updated;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Compression failed';
        const failed: ImageItem = {
          ...item,
          status: 'error',
          progress: 0,
          error: errorMsg,
        };
        setImages((prev) =>
          prev.map((it) => (it.id === item.id ? failed : it))
        );
        return failed;
      }
    },
    []
  );

  /**
   * Handle adding new files
   */
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const newItems: ImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);

        // Load image dimensions
        const img = new Image();
        img.src = url;
        await new Promise((r) => {
          img.onload = r;
          img.onerror = r;
        });

        const width = img.naturalWidth || 800;
        const height = img.naturalHeight || 600;

        // Default format: if PNG or WebP keep, else JPEG
        let defaultFormat: OutputFormat = 'image/jpeg';
        if (file.type === 'image/webp') defaultFormat = 'image/webp';
        if (file.type === 'image/png') defaultFormat = 'image/png';

        const itemSettings: CompressionSettings = {
          ...DEFAULT_SETTINGS,
          outputFormat: defaultFormat,
          width,
          height,
          originalWidth: width,
          originalHeight: height,
        };

        const newItem: ImageItem = {
          id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          originalFile: file,
          originalBlob: file,
          originalUrl: url,
          originalSize: file.size,
          originalWidth: width,
          originalHeight: height,
          originalMimeType: file.type || 'image/jpeg',
          settings: itemSettings,
          status: 'idle',
          progress: 0,
        };

        newItems.push(newItem);
      }

      setImages((prev) => {
        const combined = [...prev, ...newItems];
        return combined;
      });

      if (newItems.length > 0) {
        setActiveId(newItems[0].id);
        // Automatically start compression for new items
        for (const it of newItems) {
          processImageItem(it);
        }
      }
    },
    [processImageItem]
  );

  /**
   * Handle selecting a sample image
   */
  const handleSelectSample = async (sample: SampleImageOption) => {
    setIsLoadingSample(true);
    try {
      const file = await sample.generate();
      await handleFilesSelected([file]);
    } catch (err) {
      console.error('Failed to generate sample image', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  /**
   * Update settings for active image with debounced auto-recompression
   */
  const handleSettingsChange = (newSettings: CompressionSettings) => {
    if (!activeItem) return;

    // Update state immediately for responsive UI
    setImages((prev) =>
      prev.map((it) =>
        it.id === activeItem.id ? { ...it, settings: newSettings } : it
      )
    );

    // Debounce actual canvas recompression by 150ms
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      processImageItem(activeItem, newSettings);
    }, 150);
  };

  /**
   * Apply current settings to all queued images
   */
  const handleApplyBatchToAll = () => {
    if (!activeItem) return;
    const currentSettings = activeItem.settings;

    images.forEach((img) => {
      const updatedSettings: CompressionSettings = {
        ...currentSettings,
        // Preserve each image's native aspect ratio if custom dimensions weren't explicitly scaled
        originalWidth: img.originalWidth,
        originalHeight: img.originalHeight,
        width: Math.round(
          (img.originalWidth * (currentSettings.scalePercent || 100)) / 100
        ),
        height: Math.round(
          (img.originalHeight * (currentSettings.scalePercent || 100)) / 100
        ),
      };
      processImageItem(img, updatedSettings);
    });
  };

  /**
   * Download a single image
   */
  const handleDownloadItem = (item: ImageItem) => {
    if (!item.result) return;
    const effectiveMime = resolveMimeType(
      item.settings.outputFormat,
      item.originalMimeType
    );
    let ext = 'jpg';
    if (effectiveMime === 'image/webp') ext = 'webp';
    if (effectiveMime === 'image/png') ext = 'png';

    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}-fastimagekb-${item.settings.targetKB}kb.${ext}`;

    const link = document.createElement('a');
    link.href = item.result.url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Batch Download all images as a .ZIP archive
   */
  const handleDownloadAllZip = async () => {
    const readyItems = images.filter((img) => img.result);
    if (readyItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();

      readyItems.forEach((item, index) => {
        const effectiveMime = resolveMimeType(
          item.settings.outputFormat,
          item.originalMimeType
        );
        let ext = 'jpg';
        if (effectiveMime === 'image/webp') ext = 'webp';
        if (effectiveMime === 'image/png') ext = 'png';

        const baseName = item.name.replace(/\.[^/.]+$/, '');
        const fileName = `${baseName}-fastimagekb-${index + 1}.${ext}`;
        zip.file(fileName, item.result!.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `fastimagekb-batch-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error('Failed to create zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((it) => it.id !== id);
      if (activeId === id && filtered.length > 0) {
        setActiveId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    setImages([]);
    setActiveId('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Top Navbar & Trust Badges */}
      <Header
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenFaq={() => setShowFaqModal(true)}
      />

      {/* Main Container */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Monetization Slot */}
        <AdPlacement slot="top-banner" className="mb-2" />

        {/* Hero Title & Tool Tagline */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Client-Side Image Resizer & Target KB Compressor
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Shrink image file size to exact <span className="text-blue-400 font-semibold">20KB, 50KB, 100KB, or custom sizes</span> in milliseconds. Zero server latency, 100% browser-side privacy.
          </p>
        </div>

        {/* Dropzone Area */}
        <DropZone
          onFilesSelected={handleFilesSelected}
          isLoadingSample={isLoadingSample}
          onSelectSample={handleSelectSample}
        />

        {/* Workspace: Active Image Controls & Preview */}
        {activeItem && (
          <div className="space-y-6 pt-2">
            {/* Batch queue manager if multiple images uploaded */}
            {images.length > 1 && (
              <BatchQueue
                items={images}
                activeId={activeItem.id}
                onSelectActive={(id) => setActiveId(id)}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onDownloadItem={handleDownloadItem}
                onDownloadAllZip={handleDownloadAllZip}
                isDownloadingZip={isZipping}
                onAddMoreClick={() => {
                  document.getElementById('image-file-input')?.click();
                }}
              />
            )}

            {/* Main Interactive Grid (Controls Panel + Live Preview Card) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Left Column: Settings Panel (5 cols on lg) */}
              <div className="lg:col-span-5 space-y-6">
                <ControlsPanel
                  settings={activeItem.settings}
                  onChange={handleSettingsChange}
                  originalWidth={activeItem.originalWidth}
                  originalHeight={activeItem.originalHeight}
                  isProcessing={activeItem.status === 'processing'}
                  onApplyBatchToAll={handleApplyBatchToAll}
                  totalImagesCount={images.length}
                />

                {/* Sidebar Non-Intrusive Monetization Slot */}
                <AdPlacement slot="sidebar" />
              </div>

              {/* Right Column: Interactive Preview & Comparisons (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-6">
                <PreviewCard
                  item={activeItem}
                  onDownload={() => handleDownloadItem(activeItem)}
                  isProcessing={activeItem.status === 'processing'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Universal Use-Cases & Technical Highlights */}
        <FeaturesInfo />

        {/* Footer Monetization Slot */}
        <AdPlacement slot="footer-banner" className="mt-8" />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenFaq={() => setShowFaqModal(true)}
      />

      {/* Modals */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <FaqModal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
      />
    </div>
  );
}
