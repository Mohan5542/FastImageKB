/**
 * Utility to generate high-quality realistic test images purely locally
 * so users can test FastImageKB without uploading their own files.
 */

export interface SampleImageOption {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  description: string;
  generate: () => Promise<File>;
}

export async function createSamplePhoto(
  title: string,
  width: number,
  height: number,
  theme: 'landscape' | 'portrait' | 'graphic'
): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  if (theme === 'landscape') {
    // Rich gradient sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.65);
    skyGradient.addColorStop(0, '#0f172a');
    skyGradient.addColorStop(0.4, '#1e293b');
    skyGradient.addColorStop(0.7, '#f97316');
    skyGradient.addColorStop(1, '#fde047');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.65);

    // Glowing sun
    const sunGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      0,
      width * 0.5,
      height * 0.5,
      width * 0.2
    );
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    sunGrad.addColorStop(0.3, 'rgba(254, 215, 170, 0.6)');
    sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mountain silhouettes
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.65);
    ctx.lineTo(width * 0.2, height * 0.4);
    ctx.lineTo(width * 0.45, height * 0.58);
    ctx.lineTo(width * 0.7, height * 0.35);
    ctx.lineTo(width, height * 0.65);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Water reflection
    const waterGrad = ctx.createLinearGradient(0, height * 0.65, 0, height);
    waterGrad.addColorStop(0, '#1e1b4b');
    waterGrad.addColorStop(1, '#020617');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, height * 0.65, width, height * 0.35);

    // Light ripples
    ctx.strokeStyle = 'rgba(254, 215, 170, 0.25)';
    ctx.lineWidth = 2;
    for (let y = height * 0.68; y < height; y += 14) {
      ctx.beginPath();
      ctx.moveTo(width * 0.35, y);
      ctx.lineTo(width * 0.65, y);
      ctx.stroke();
    }
  } else if (theme === 'portrait') {
    // Studio backdrop
    const bg = ctx.createRadialGradient(
      width * 0.5,
      height * 0.4,
      width * 0.05,
      width * 0.5,
      height * 0.5,
      width * 0.7
    );
    bg.addColorStop(0, '#38bdf8');
    bg.addColorStop(0.5, '#0284c7');
    bg.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Portrait silhouette / avatar styling
    ctx.fillStyle = '#f8fafc';
    // Head
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.38, width * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.8, width * 0.34, height * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Badge / border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(4, width * 0.015);
    ctx.strokeRect(width * 0.04, height * 0.04, width * 0.92, height * 0.92);
  } else {
    // Modern vector graphic UI card
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#18181b');
    bg.addColorStop(1, '#09090b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Glowing orb
    const orb = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      10,
      width * 0.5,
      height * 0.5,
      width * 0.35
    );
    orb.addColorStop(0, '#3b82f6');
    orb.addColorStop(0.5, '#6366f1');
    orb.addColorStop(1, 'transparent');
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stamp clean typography on canvas
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.max(16, Math.round(width * 0.04))}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, width * 0.5, height * 0.92);

  // Return as real File object
  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.95);
  });

  return new File([blob], `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`, {
    type: 'image/jpeg',
  });
}

export const SAMPLE_IMAGES: SampleImageOption[] = [
  {
    id: 'sample-landscape',
    name: 'High-Res Landscape',
    category: 'Web / Creative',
    width: 2400,
    height: 1600,
    description: 'High-resolution sunset landscape (2400×1600 px)',
    generate: () => createSamplePhoto('Sunset Landscape 4K', 2400, 1600, 'landscape'),
  },
  {
    id: 'sample-portrait',
    name: 'Studio ID / Passport',
    category: 'Students / Job Seekers',
    width: 1200,
    height: 1200,
    description: 'Square 1:1 ID & profile photo (1200×1200 px)',
    generate: () => createSamplePhoto('Official Portrait ID', 1200, 1200, 'portrait'),
  },
  {
    id: 'sample-graphic',
    name: 'Tech Graphic Banner',
    category: 'Developers / UI',
    width: 1920,
    height: 1080,
    description: 'Full HD UI vector banner (1920×1080 px)',
    generate: () => createSamplePhoto('FastImageKB Tech Graphic', 1920, 1080, 'graphic'),
  },
];
