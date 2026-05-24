export type SeedanceOption = {
  slug: string;
  label: string;
};

export const SEEDANCE_OPTIONS: SeedanceOption[] = [
  { slug: 'image-to-video', label: 'Image / Text to Video' },
  { slug: 'reference-to-video', label: 'Reference to Video' }
];

// Tier = combinación version+variant. El form unificado i2v/t2v expone todas;
// el form r2v sólo expone las que soportan reference-to-video (2.0 y 1.0 Lite).
export type SeedanceTier =
  | '2.0'
  | '2.0-fast'
  | '1.5-pro'
  | '1-pro'
  | '1-pro-fast'
  | '1-lite';

export type SeedanceTierMeta = {
  value: SeedanceTier;
  label: string;
  hint: string;
  endpoints: {
    i2v: string | null;
    t2v: string | null;
    r2v: string | null;
  };
  // Las 2.0 usan generate_audio + duration auto; las v1 usan camera_fixed + safety_checker.
  family: 'v2' | 'v1';
  resolutions: ('480p' | '720p' | '1080p')[];
};

export const SEEDANCE_TIERS: SeedanceTierMeta[] = [
  {
    value: '2.0',
    label: '2.0',
    hint: 'última generación',
    endpoints: {
      i2v: 'bytedance/seedance-2.0/image-to-video',
      t2v: 'bytedance/seedance-2.0/text-to-video',
      r2v: 'bytedance/seedance-2.0/reference-to-video'
    },
    family: 'v2',
    resolutions: ['480p', '720p', '1080p']
  },
  {
    value: '2.0-fast',
    label: '2.0 Fast',
    hint: 'rápido / barato',
    endpoints: {
      i2v: 'fal-ai/bytedance/seedance-2.0/fast/image-to-video',
      t2v: 'fal-ai/bytedance/seedance-2.0/fast/text-to-video',
      r2v: 'fal-ai/bytedance/seedance-2.0/fast/reference-to-video'
    },
    family: 'v2',
    resolutions: ['480p', '720p']
  },
  {
    value: '1.5-pro',
    label: '1.5 Pro',
    hint: 'generación previa pro',
    endpoints: {
      i2v: 'fal-ai/bytedance/seedance/v1.5/pro/image-to-video',
      t2v: 'fal-ai/bytedance/seedance/v1.5/pro/text-to-video',
      r2v: null
    },
    family: 'v1',
    resolutions: ['480p', '720p', '1080p']
  },
  {
    value: '1-pro',
    label: '1.0 Pro',
    hint: 'estable / pro',
    endpoints: {
      i2v: 'fal-ai/bytedance/seedance/v1/pro/image-to-video',
      t2v: 'fal-ai/bytedance/seedance/v1/pro/text-to-video',
      r2v: null
    },
    family: 'v1',
    resolutions: ['480p', '720p', '1080p']
  },
  {
    value: '1-pro-fast',
    label: '1.0 Pro Fast',
    hint: 'pro acelerado',
    endpoints: {
      i2v: 'fal-ai/bytedance/seedance/v1/pro/fast/image-to-video',
      t2v: 'fal-ai/bytedance/seedance/v1/pro/fast/text-to-video',
      r2v: null
    },
    family: 'v1',
    resolutions: ['480p', '720p', '1080p']
  },
  {
    value: '1-lite',
    label: '1.0 Lite',
    hint: 'liviano / económico',
    endpoints: {
      i2v: 'fal-ai/bytedance/seedance/v1/lite/image-to-video',
      t2v: 'fal-ai/bytedance/seedance/v1/lite/text-to-video',
      r2v: 'fal-ai/bytedance/seedance/v1/lite/reference-to-video'
    },
    family: 'v1',
    resolutions: ['480p', '720p']
  }
];

export const SEEDANCE_DEFAULT_TIER: SeedanceTier = '2.0';

export const SEEDANCE_R2V_TIERS = SEEDANCE_TIERS.filter((t) => t.endpoints.r2v !== null);
