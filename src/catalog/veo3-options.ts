// Google Veo 3.1 — tiers (Standard / Fast / Lite) × tasks (T2V / I2V / R2V / FLF).
// Lite no soporta R2V; Fast no soporta R2V ni FLF. Lite además limita resoluciones a 720p/1080p.

export type Veo3Tier = 'standard' | 'fast' | 'lite';
export type Veo3Task = 't2v' | 'i2v' | 'r2v' | 'flf';
export type Veo3Resolution = '720p' | '1080p' | '4k';
export type Veo3Duration = '4s' | '6s' | '8s';
export type Veo3AspectRatio = '16:9' | '9:16' | 'auto';

export type Veo3TierMeta = {
  value: Veo3Tier;
  label: string;
  hint: string;
  endpoints: {
    t2v: string | null;
    i2v: string | null;
    r2v: string | null;
    flf: string | null;
  };
  resolutions: Veo3Resolution[];
  // FLF en Lite fuerza duration "8s"; otros aceptan ["4s","6s","8s"]. Tasked-keyed override.
  durationsByTask?: Partial<Record<Veo3Task, Veo3Duration[]>>;
  durations: Veo3Duration[];
};

export const VEO3_TIERS: Veo3TierMeta[] = [
  {
    value: 'standard',
    label: 'Standard',
    hint: 'máxima calidad · 4K disponible',
    endpoints: {
      t2v: 'fal-ai/veo3.1',
      i2v: 'fal-ai/veo3.1/image-to-video',
      r2v: 'fal-ai/veo3.1/reference-to-video',
      flf: 'fal-ai/veo3.1/first-last-frame-to-video'
    },
    resolutions: ['720p', '1080p', '4k'],
    durations: ['4s', '6s', '8s'],
    durationsByTask: { r2v: ['8s'] }
  },
  {
    value: 'fast',
    label: 'Fast',
    hint: 'rápido · barato · 4K disponible',
    endpoints: {
      t2v: 'fal-ai/veo3.1/fast',
      i2v: 'fal-ai/veo3.1/fast/image-to-video',
      r2v: null,
      flf: null
    },
    resolutions: ['720p', '1080p', '4k'],
    durations: ['4s', '6s', '8s']
  },
  {
    value: 'lite',
    label: 'Lite',
    hint: 'económico · 720p/1080p',
    endpoints: {
      t2v: 'fal-ai/veo3.1/lite',
      i2v: 'fal-ai/veo3.1/lite/image-to-video',
      r2v: null,
      flf: 'fal-ai/veo3.1/lite/first-last-frame-to-video'
    },
    resolutions: ['720p', '1080p'],
    durations: ['4s', '6s', '8s'],
    durationsByTask: { flf: ['8s'] }
  }
];

export const VEO3_DEFAULT_TIER: Veo3Tier = 'standard';
export const VEO3_DEFAULT_TASK: Veo3Task = 't2v';

export type Veo3TaskMeta = { value: Veo3Task; label: string; hint: string };

export const VEO3_TASKS: Veo3TaskMeta[] = [
  { value: 't2v', label: 'T2V', hint: 'Texto → Video' },
  { value: 'i2v', label: 'I2V', hint: 'Imagen → Video' },
  { value: 'r2v', label: 'R2V', hint: 'Referencias → Video' },
  { value: 'flf', label: 'FLF', hint: 'Primer + último frame' }
];

export function getVeo3Tier(value: string): Veo3TierMeta {
  return VEO3_TIERS.find((t) => t.value === value) ?? VEO3_TIERS[0];
}

export function veo3TaskSupported(tier: Veo3Tier, task: Veo3Task): boolean {
  return getVeo3Tier(tier).endpoints[task] !== null;
}

export function veo3DurationsFor(tier: Veo3Tier, task: Veo3Task): Veo3Duration[] {
  const meta = getVeo3Tier(tier);
  return meta.durationsByTask?.[task] ?? meta.durations;
}

export function allVeo3EndpointIds(): string[] {
  const ids = new Set<string>();
  for (const t of VEO3_TIERS) {
    for (const ep of Object.values(t.endpoints)) if (ep) ids.add(ep);
  }
  return [...ids];
}
