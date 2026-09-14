import React from 'react';
import {
  Layers,
  Trash2,
  Download,
  Archive,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { ImageItem } from '../types';
import { formatBytes } from '../utils/compressor';

interface BatchQueueProps {
  items: ImageItem[];
  activeId: string;
  onSelectActive: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onDownloadItem: (item: ImageItem) => void;
  onDownloadAllZip: () => void;
  isDownloadingZip?: boolean;
  onAddMoreClick: () => void;
}

export const BatchQueue: React.FC<BatchQueueProps> = ({
  items,
  activeId,
  onSelectActive,
  onRemoveItem,
  onClearAll,
  onDownloadItem,
  onDownloadAllZip,
  isDownloadingZip = false,
  onAddMoreClick,
}) => {
  if (items.length === 0) return null;

  const totalOriginalBytes = items.reduce((acc, it) => acc + it.originalSize, 0);
  const totalCompressedBytes = items.reduce(
    (acc, it) => acc + (it.result ? it.result.sizeBytes : it.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCompressedBytes);
  const totalReductionPct =
    totalOriginalBytes > 0
      ? Math.round((totalSavedBytes / totalOriginalBytes) * 100)
      : 0;

  const allDone = items.every((it) => it.status === 'done');

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-lg backdrop-blur-sm space-y-4">
      {/* Batch Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Queue ({items.length} {items.length === 1 ? 'image' : 'images'})
          </h3>
          {totalSavedBytes > 0 && (
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
              Total Saved: {formatBytes(totalSavedBytes)} (−{totalReductionPct}%)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddMoreClick}
            className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            id="btn-add-more-images"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add More</span>
          </button>

          {items.length > 1 && (
            <button
              type="button"
              onClick={onDownloadAllZip}
              disabled={!allDone || isDownloadingZip}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
              id="btn-download-all-zip"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>{isDownloadingZip ? 'Zipping...' : 'Download All (.ZIP)'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
            title="Clear all images"
            id="btn-clear-queue"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List of items */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const isDone = item.status === 'done' && item.result;

          return (
            <div
              key={item.id}
              onClick={() => onSelectActive(item.id)}
              className={`flex items-center justify-between rounded-xl border p-2.5 transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-500/60 bg-blue-500/10 shadow-sm'
                  : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
              id={`queue-item-${item.id}`}
            >
              {/* Left: Thumbnail & Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-checkerboard">
                  <img
                    src={item.result ? item.result.url : item.originalUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>{formatBytes(item.originalSize)}</span>
                    {isDone && (
                      <>
                        <span>→</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {formatBytes(item.result!.sizeBytes)}
                        </span>
                        <span className="text-emerald-500 text-[10px]">
                          (−{item.result!.reductionPercent}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {item.status === 'processing' && (
                  <span className="flex items-center gap-1 text-xs text-blue-400">
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Processing</span>
                  </span>
                )}

                {item.status === 'error' && (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Error</span>
                  </span>
                )}

                {isDone && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadItem(item);
                    }}
                    className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800/90 px-2 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-blue-500 hover:text-white"
                    title="Download this file"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                  title="Remove from queue"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
