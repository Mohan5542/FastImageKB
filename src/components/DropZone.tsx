import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, FolderUp, Clipboard } from 'lucide-react';
import { SAMPLE_IMAGES, SampleImageOption } from '../utils/sampleImages';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoadingSample?: boolean;
  onSelectSample?: (sample: SampleImageOption) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  isLoadingSample = false,
  onSelectSample,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesList = Array.from(e.dataTransfer.files) as File[];
      const validFiles = filesList.filter((file: File) =>
        file.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList = Array.from(e.target.files) as File[];
      const files = filesList.filter((file: File) =>
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
      // Reset input value so same file can be re-uploaded if desired
      e.target.value = '';
    }
  };

  // Global paste handler to allow pasting images directly from clipboard (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = Array.from(e.clipboardData.items);
        const imageItems = items.filter((item) => item.type.startsWith('image/'));
        if (imageItems.length > 0) {
          const files: File[] = [];
          for (const item of imageItems) {
            const file = item.getAsFile();
            if (file) files.push(file);
          }
          if (files.length > 0) {
            onFilesSelected(files);
            setPasteNotice(true);
            setTimeout(() => setPasteNotice(false), 2500);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  return (
    <div className="w-full">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/bmp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        id="image-file-input"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 sm:p-12 ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
            : 'border-zinc-700/80 bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-900/70 hover:shadow-md'
        }`}
        id="upload-dropzone"
      >
        {/* Glow effect on hover */}
        <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Animated upload icon circle */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105 ${
              isDragOver
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-zinc-800/90 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
            }`}
          >
            <UploadCloud className="h-8 w-8 transition-colors" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Drag and drop your images here, or{' '}
              <span className="text-blue-400 underline decoration-blue-500/30 underline-offset-4 group-hover:decoration-blue-400">
                browse files
              </span>
            </h3>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Supports JPEG, PNG, WebP, AVIF, BMP • Unlimited files • 100% processed locally
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/80 px-2.5 py-1 text-zinc-300">
              <FolderUp className="h-3 w-3 text-zinc-400" />
              Batch uploads supported
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/80 px-2.5 py-1 text-zinc-300">
              <Clipboard className="h-3 w-3 text-zinc-400" />
              Paste from clipboard (<kbd className="font-mono text-[10px] text-zinc-400">Ctrl+V</kbd>)
            </span>
          </div>
        </div>

        {pasteNotice && (
          <div className="absolute top-4 right-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-medium text-emerald-300 animate-fade-in">
            Image pasted from clipboard!
          </div>
        )}
      </div>

      {/* Instant Sample Image Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-medium text-zinc-300">No image handy? Try a sample:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSample?.(sample);
              }}
              disabled={isLoadingSample}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/70 px-2.5 py-1 text-xs font-medium text-zinc-200 transition-all hover:border-blue-500/50 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
              id={`btn-sample-${sample.id}`}
            >
              <ImageIcon className="h-3 w-3 text-blue-400" />
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
