// Lightricks LTX-2.3
// Standard tier soporta: t2v, i2v, audio2v, extend, retake.
// Fast tier solo soporta: t2v, i2v.
// Resoluciones admitidas: 1080p, 1440p, 2160p (4K). Pricing por segundo varía por resolución.

export type LTXTier = 'standard' | 'fast';

export type LTXTask = 't2v' | 'i2v' | 'audio2v' | 'extend' | 'retake';

export type LTXResolution = '1080p' | '1440p' | '2160p';

export const LTX_TIERS: { value: LTXTier; label: string; hint: string }[] = [
  { value: 'standard', label: 'Standard', hint: 'calidad completa' },
  { value: 'fast', label: 'Fast', hint: 'rápido / económico' }
];

export const LTX_DEFAULT_TIER: LTXTier = 'standard';

export const LTX_TASKS: {
  value: LTXTask;
  label: string;
  icon: string;
  tiers: LTXTier[];
}[] = [
  { value: 't2v', label: 'Texto a video', icon: '✍️', tiers: ['standard', 'fast'] },
  { value: 'i2v', label: 'Imagen a video', icon: '🖼️', tiers: ['standard', 'fast'] },
  { value: 'audio2v', label: 'Audio a video', icon: '🎵', tiers: ['standard'] },
  { value: 'extend', label: 'Extender video', icon: '➕', tiers: ['standard'] },
  { value: 'retake', label: 'Retake video', icon: '🔁', tiers: ['standard'] }
];

export const LTX_DEFAULT_TASK: LTXTask = 't2v';

export const LTX_RESOLUTIONS: { value: LTXResolution; label: string }[] = [
  { value: '1080p', label: '1080p' },
  { value: '1440p', label: '1440p' },
  { value: '2160p', label: '2160p (4K)' }
];

export const LTX_DEFAULT_RESOLUTION: LTXResolution = '1080p';

export function ltxEndpointId(tier: LTXTier, task: LTXTask): string {
  const taskPath = {
    t2v: 'text-to-video',
    i2v: 'image-to-video',
    audio2v: 'audio-to-video',
    extend: 'extend-video',
    retake: 'retake-video'
  }[task];
  if (tier === 'fast') {
    return `fal-ai/ltx-2.3/${taskPath}/fast`;
  }
  return `fal-ai/ltx-2.3/${taskPath}`;
}

export function tierSupportsTask(tier: LTXTier, task: LTXTask): boolean {
  const meta = LTX_TASKS.find((t) => t.value === task);
  return meta ? meta.tiers.includes(tier) : false;
}
