export type FluxOption = {
  slug: string;
  label: string;
};

export const FLUX_OPTIONS: FluxOption[] = [
  { slug: 'text-to-image', label: 'Text to Image' }
];

export type FluxTier = '2-pro';

export type FluxTierMeta = {
  value: FluxTier;
  label: string;
  hint: string;
  endpoints: {
    t2i: string | null;
  };
};

export const FLUX_TIERS: FluxTierMeta[] = [
  {
    value: '2-pro',
    label: '2 Pro',
    hint: 'FLUX.2 [pro] — text-to-image',
    endpoints: {
      t2i: 'fal-ai/flux-2-pro'
    }
  }
];

export const FLUX_DEFAULT_TIER: FluxTier = '2-pro';

export type FluxImageSizePreset =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';

export const FLUX_IMAGE_SIZE_PRESETS: FluxImageSizePreset[] = [
  'square_hd',
  'square',
  'portrait_4_3',
  'portrait_16_9',
  'landscape_4_3',
  'landscape_16_9'
];

export const FLUX_OUTPUT_FORMATS = ['jpeg', 'png'] as const;
export type FluxOutputFormat = (typeof FLUX_OUTPUT_FORMATS)[number];
