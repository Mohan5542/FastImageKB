export type OutputFormat = 'image/jpeg' | 'image/webp' | 'image/png' | 'original';

export type CompressionMode = 'target-kb' | 'manual-quality';

export type DimensionPresetId = 'original' | 'passport' | 'avatar' | 'social-square' | 'web-banner' | 'hd' | 'full-hd' | 'custom';

export interface DimensionPreset {
  id: DimensionPresetId;
  label: string;
  width?: number;
  height?: number;
  description: string;
}

export interface CompressionSettings {
  mode: CompressionMode;
  targetKB: number;
  targetUnit?: 'KB' | 'MB';
  manualQuality: number; // 1 to 100
  outputFormat: OutputFormat;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  lockAspectRatio: boolean;
  scalePercent: number; // 10 to 100
  autoDownscaleIfTargetExceeded: boolean;
  backgroundColorForJpeg: string; // default '#ffffff'
}

export interface ProcessedResult {
  blob: Blob;
  url: string;
  sizeBytes: number;
  width: number;
  height: number;
  format: OutputFormat;
  qualityUsed: number;
  processingTimeMs: number;
  reductionPercent: number;
  iterationsCount: number;
}

export interface ImageItem {
  id: string;
  name: string;
  originalFile?: File;
  originalBlob: Blob;
  originalUrl: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalMimeType: string;
  
  settings: CompressionSettings;
  
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number; // 0 to 100
  error?: string;
  
  result?: ProcessedResult;
}

export interface UseCasePreset {
  title: string;
  targetKB: number;
  format: OutputFormat;
  description: string;
  iconName: string;
}
