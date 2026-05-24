export type HailuoTier = 'standard' | 'pro';
export type HailuoTask = 'i2v' | 't2v';
export type HailuoResolution = '512P' | '768P' | '1080P';

export type HailuoTierMeta = {
  value: HailuoTier;
  label: string;
  hint: string;
  endpoints: {
    i2v: string;
    t2v: string;
  };
  resolutions: HailuoResolution[];
  defaultResolution: HailuoResolution;
  durations: number[];
  defaultDuration: number;
  supportsPromptOptimizer: boolean;
  supportsEndImage: boolean;
};

export const HAILUO_TIERS: HailuoTierMeta[] = [
  {
    value: 'standard',
    label: 'Standard',
    hint: 'rápido / económico (768P)',
    endpoints: {
      i2v: 'fal-ai/minimax/hailuo-02/standard/image-to-video',
      t2v: 'fal-ai/minimax/hailuo-02/standard/text-to-video'
    },
    resolutions: ['512P', '768P'],
    defaultResolution: '768P',
    durations: [6],
    defaultDuration: 6,
    supportsPromptOptimizer: true,
    supportsEndImage: true
  },
  {
    value: 'pro',
    label: 'Pro',
    hint: '1080p de máxima calidad',
    endpoints: {
      i2v: 'fal-ai/minimax/hailuo-02/pro/image-to-video',
      t2v: 'fal-ai/minimax/hailuo-02/pro/text-to-video'
    },
    resolutions: ['768P', '1080P'],
    defaultResolution: '1080P',
    durations: [6, 10],
    defaultDuration: 6,
    supportsPromptOptimizer: true,
    supportsEndImage: true
  }
];

export const HAILUO_DEFAULT_TIER: HailuoTier = 'standard';

export function getHailuoTier(value: HailuoTier): HailuoTierMeta {
  return HAILUO_TIERS.find((t) => t.value === value) ?? HAILUO_TIERS[0];
}
