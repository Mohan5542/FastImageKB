import React from 'react';
import {
  Sliders,
  Lock,
  Unlock,
  Sparkles,
  Layers,
  FileType,
  RefreshCw,
  Info,
  Maximize2
} from 'lucide-react';
import {
  CompressionSettings,
  OutputFormat,
  CompressionMode,
} from '../types';

interface ControlsPanelProps {
  settings: CompressionSettings;
  onChange: (newSettings: CompressionSettings) => void;
  originalWidth: number;
  originalHeight: number;
  isProcessing?: boolean;
  onApplyBatchToAll?: () => void;
  totalImagesCount?: number;
}

const PRESET_KB_LIST = [20, 50, 100, 200, 500, 1000];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  settings,
  onChange,
  originalWidth,
  originalHeight,
  isProcessing = false,
  onApplyBatchToAll,
  totalImagesCount = 1,
}) => {
  const isCustomKB = !PRESET_KB_LIST.includes(settings.targetKB);

  const handleModeChange = (mode: CompressionMode) => {
    onChange({ ...settings, mode });
  };

  const handlePresetKBClick = (kb: number) => {
    onChange({
      ...settings,
      mode: 'target-kb',
      targetKB: kb,
    });
  };

  const handleFormatChange = (format: OutputFormat) => {
    onChange({ ...settings, outputFormat: format });
  };

  const handleWidthChange = (val: string) => {
    if (val === '') {
      onChange({ ...settings, width: 0 });
      return;
    }
    const num = parseInt(val);
    if (isNaN(num)) return;
    const newWidth = Math.max(0, num);
    if (settings.lockAspectRatio && originalWidth > 0 && originalHeight > 0 && newWidth > 0) {
      const ratio = originalHeight / originalWidth;
      const newHeight = Math.max(1, Math.round(newWidth * ratio));
      onChange({ ...settings, width: newWidth, height: newHeight });
    } else {
      onChange({ ...settings, width: newWidth });
    }
  };

  const handleHeightChange = (val: string) => {
    if (val === '') {
      onChange({ ...settings, height: 0 });
      return;
    }
    const num = parseInt(val);
    if (isNaN(num)) return;
    const newHeight = Math.max(0, num);
    if (settings.lockAspectRatio && originalWidth > 0 && originalHeight > 0 && newHeight > 0) {
      const ratio = originalWidth / originalHeight;
      const newWidth = Math.max(1, Math.round(newHeight * ratio));
      onChange({ ...settings, width: newWidth, height: newHeight });
    } else {
      onChange({ ...settings, height: newHeight });
    }
  };

  const handleScalePercent = (percent: number) => {
    if (originalWidth > 0 && originalHeight > 0) {
      const newW = Math.max(1, Math.round((originalWidth * percent) / 100));
      const newH = Math.max(1, Math.round((originalHeight * percent) / 100));
      onChange({
        ...settings,
        scalePercent: percent,
        width: newW,
        height: newH,
      });
    }
  };

  const handleResetDimensions = () => {
    onChange({
      ...settings,
      width: originalWidth,
      height: originalHeight,
      scalePercent: 100,
    });
  };

  const handlePresetDimension = (w: number, h: number) => {
    onChange({
      ...settings,
      width: w,
      height: h,
      scalePercent: 100,
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3 sm:p-5 shadow-lg backdrop-blur-sm space-y-3 sm:space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-2 sm:pb-4 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sliders className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
          <h2 className="text-[11px] sm:text-sm font-semibold tracking-wide text-zinc-100 uppercase">
            Compression Settings
          </h2>
        </div>

        {totalImagesCount > 1 && onApplyBatchToAll && (
          <button
            onClick={onApplyBatchToAll}
            className="flex self-start sm:self-auto items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium text-blue-300 transition-colors hover:bg-blue-500/20"
            id="btn-apply-all"
            title="Apply these settings to all queued images"
          >
            <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Apply to All ({totalImagesCount})</span>
          </button>
        )}
      </div>

      {/* SECTION 1: Compression Mode (Target KB vs Manual Quality) */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] sm:text-xs font-semibold text-zinc-300">
            Optimization Strategy
          </label>
          <span className="text-[9px] sm:text-[11px] text-zinc-400 hidden sm:inline">
            {settings.mode === 'target-kb' ? 'Intelligent Binary Search' : 'Fixed Quantization'}
          </span>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-zinc-950 p-1 border border-zinc-800/80">
          <button
            type="button"
            onClick={() => handleModeChange('target-kb')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-all ${
              settings.mode === 'target-kb'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="tab-mode-target-kb"
          >
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Target Size (KB/MB)</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('manual-quality')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-all ${
              settings.mode === 'manual-quality'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="tab-mode-quality"
          >
            <Sliders className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Manual Quality (%)</span>
          </button>
        </div>

        {/* Target Size Presets & Custom Input */}
        {settings.mode === 'target-kb' ? (
          <div className="space-y-2 sm:space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-zinc-400">Quick-Select Target:</span>
              <span className="font-mono text-[10px] sm:text-xs font-semibold text-blue-400">
                Target: {settings.targetKB} {settings.targetUnit || 'KB'}
              </span>
            </div>

            {/* Preset chips pills */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 sm:grid-cols-6">
              {PRESET_KB_LIST.map((kb) => {
                const isSelected = settings.targetKB === kb && (settings.targetUnit === 'KB' || !settings.targetUnit);
                return (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => {
                      onChange({ ...settings, targetKB: kb, targetUnit: 'KB' });
                    }}
                    className={`rounded-lg sm:rounded-xl border py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-sm shadow-blue-500/10'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60'
                    }`}
                    id={`btn-preset-kb-${kb}`}
                  >
                    {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
                  </button>
                );
              })}
            </div>

            {/* Custom KB Input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 pt-1">
              <label htmlFor="custom-target-kb" className="text-[10px] sm:text-xs text-zinc-400 whitespace-nowrap">
                Custom Size:
              </label>
              <div className="relative flex-1 flex items-center">
                <input
                  id="custom-target-kb"
                  type="number"
                  min="1"
                  max="50000"
                  value={settings.targetKB || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      onChange({ ...settings, targetKB: 0 });
                      return;
                    }
                    const num = parseFloat(val);
                    if (!isNaN(num)) {
                      onChange({ ...settings, targetKB: Math.max(0, num) });
                    }
                  }}
                  className="w-full rounded-l-lg border border-zinc-800 border-r-0 bg-zinc-950 px-2 sm:px-3 py-1.5 font-mono text-[10px] sm:text-xs text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. 75"
                />
                <select
                  value={settings.targetUnit || 'KB'}
                  onChange={(e) => onChange({ ...settings, targetUnit: e.target.value as 'KB' | 'MB' })}
                  className="h-full rounded-r-lg border border-zinc-800 bg-zinc-900 px-1 sm:px-2 py-1.5 font-mono text-[10px] sm:text-xs text-zinc-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* Manual Quality Slider */
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Compression Quality:</span>
              <span className="font-mono font-semibold text-blue-400">
                {settings.outputFormat === 'image/png' ? 'N/A' : `${settings.manualQuality}%`}
              </span>
            </div>
            
            {settings.outputFormat === 'image/png' ? (
              <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-2.5 text-[11px] text-yellow-300">
                PNG is a lossless format and ignores the quality parameter. To reduce PNG file size, try changing dimensions or use WebP/JPEG format.
              </div>
            ) : (
              <>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.manualQuality}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      manualQuality: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  id="range-quality"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Maximum Compression (Smaller size)</span>
                  <span>Maximum Quality (Larger size)</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: Output Format Selection */}
      <div className="space-y-2.5 border-t border-zinc-800/80 pt-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <FileType className="h-3.5 w-3.5 text-zinc-400" />
            <span>Output Format</span>
          </label>
          <span className="text-[11px] text-zinc-400">
            {settings.outputFormat === 'image/webp'
              ? 'Best web compression'
              : settings.outputFormat === 'image/jpeg'
              ? 'Universal compatibility'
              : settings.outputFormat === 'image/png'
              ? 'Lossless / transparency'
              : 'Match input file'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {[
            { id: 'image/webp', label: 'WebP', badge: 'Recommended' },
            { id: 'image/jpeg', label: 'JPEG', badge: 'Universal' },
            { id: 'image/png', label: 'PNG', badge: 'Lossless' },
            { id: 'original', label: 'Auto', badge: 'Keep Input' },
          ].map((fmt) => {
            const isSelected = settings.outputFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => handleFormatChange(fmt.id as OutputFormat)}
                className={`flex flex-col items-center justify-center rounded-lg sm:rounded-xl border p-1.5 sm:p-2 text-center transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/20 text-white shadow-sm'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                id={`btn-format-${fmt.label.toLowerCase()}`}
              >
                <span className="text-[10px] sm:text-xs font-bold leading-tight">{fmt.label}</span>
                <span className="text-[8px] sm:text-[10px] opacity-70 leading-tight mt-0.5">{fmt.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Dimensions & Aspect Ratio Lock */}
      <div className="space-y-3 border-t border-zinc-800/80 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Maximize2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Dimensions & Scaling</span>
          </label>

          {originalWidth > 0 && (
            <span className="text-[10px] sm:text-[11px] text-zinc-400">
              Original: {originalWidth} × {originalHeight} px
            </span>
          )}
        </div>

        {/* Width x Height with Lock */}
        <div className="flex items-center gap-2">
          {/* Width */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] sm:text-[11px] text-zinc-400">
              <span>Width</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="10000"
                value={settings.width || ''}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 sm:px-3 py-1.5 pr-6 sm:pr-8 font-mono text-[10px] sm:text-xs text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                id="input-custom-width"
              />
              <span className="pointer-events-none absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] text-zinc-500">
                px
              </span>
            </div>
          </div>

          {/* Aspect Ratio Lock Toggle */}
          <div className="pt-4 sm:pt-4">
            <button
              type="button"
              onClick={() =>
                onChange({ ...settings, lockAspectRatio: !settings.lockAspectRatio })
              }
              className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg border transition-colors ${
                settings.lockAspectRatio
                  ? 'border-blue-500/40 bg-blue-500/20 text-blue-400'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300'
              }`}
              title={
                settings.lockAspectRatio
                  ? 'Aspect Ratio Locked (Click to Unlock)'
                  : 'Aspect Ratio Unlocked (Click to Lock)'
              }
              id="btn-toggle-aspect-ratio"
            >
              {settings.lockAspectRatio ? (
                <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Unlock className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>
          </div>

          {/* Height */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] sm:text-[11px] text-zinc-400">
              <span>Height</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="10000"
                value={settings.height || ''}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 sm:px-3 py-1.5 pr-6 sm:pr-8 font-mono text-[10px] sm:text-xs text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                id="input-custom-height"
              />
              <span className="pointer-events-none absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] text-zinc-500">
                px
              </span>
            </div>
          </div>
        </div>

        {/* Quick Scale Percentage Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 pt-1">
          <span className="text-[10px] sm:text-[11px] text-zinc-400 mr-0.5 sm:mr-1">Scale:</span>
          {[100, 75, 50, 25].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handleScalePercent(pct)}
              className={`flex-1 rounded-md border py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-medium transition-colors ${
                settings.scalePercent === pct
                  ? 'border-blue-500/40 bg-blue-500/20 text-blue-300'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
              id={`btn-scale-${pct}`}
            >
              {pct}%
            </button>
          ))}
          <button
            type="button"
            onClick={handleResetDimensions}
            className="rounded-md border border-zinc-800 bg-zinc-950 p-1 sm:p-1 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            title="Reset to original dimensions"
            id="btn-reset-dimensions"
          >
            <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </button>
        </div>

        {/* Standard Preset Dimension Pills */}
        <div className="space-y-1 sm:space-y-1.5 pt-1">
          <span className="text-[10px] sm:text-[11px] text-zinc-400">Common Presets:</span>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {[
              { label: 'Passport / ID', w: 600, h: 600 },
              { label: 'Avatar / Profile', w: 400, h: 400 },
              { label: 'Social Square', w: 1080, h: 1080 },
              { label: 'Web Standard', w: 1200, h: 800 },
              { label: 'Full HD Banner', w: 1920, h: 1080 },
              { label: '2K QHD', w: 2560, h: 1440 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetDimension(preset.w, preset.h)}
                className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/70 px-1.5 sm:px-2 py-1 text-[9px] sm:text-[10px] text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80"
                id={`btn-preset-dim-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span>{preset.label}</span>
                <span className="font-mono text-zinc-500">{preset.w}×{preset.h}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Advanced Options (Auto-downscale toggle) */}
      <div className="space-y-2 border-t border-zinc-800/80 pt-4">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoDownscaleIfTargetExceeded}
            onChange={(e) =>
              onChange({
                ...settings,
                autoDownscaleIfTargetExceeded: e.target.checked,
              })
            }
            className="mt-0.5 h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-950 accent-blue-500"
            id="checkbox-auto-downscale"
          />
          <div className="text-xs">
            <span className="font-medium text-zinc-200">
              Auto-downscale dimensions if target KB cannot be reached
            </span>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Guarantees the output file stays strictly under your target KB threshold even for high-resolution images.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
