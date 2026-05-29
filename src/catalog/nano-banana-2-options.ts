// Nano Banana 2 — Google's state-of-the-art image gen + edit.
// Schema distinto a v1: añade system_prompt, resolution, enable_web_search,
// thinking_level y aspect ratios extra (4:1, 1:4, 8:1, 1:8).

export type NanoBanana2Option = {
  slug: string;
  label: string;
};

export const NANO_BANANA_2_OPTIONS: NanoBanana2Option[] = [
  { slug: 'text-to-image', label: 'Text to Image' },
  { slug: 'edit', label: 'Image Edit (instruction-based)' }
];

export type NanoBanana2Tier = 't2i' | 'edit';

export type NanoBanana2TierMeta = {
  value: NanoBanana2Tier;
  label: string;
  hint: string;
  endpoint: string;
};

export const NANO_BANANA_2_TIERS: NanoBanana2TierMeta[] = [
  {
    value: 't2i',
    label: 'Text to Image',
    hint: 'Generación desde texto, sin referencia',
    endpoint: 'fal-ai/nano-banana-2'
  },
  {
    value: 'edit',
    label: 'Edit',
    hint: 'Editing instruction-based con image_urls (remove/add/swap)',
    endpoint: 'fal-ai/nano-banana-2/edit'
  }
];

export const NANO_BANANA_2_DEFAULT_TIER: NanoBanana2Tier = 'edit';

// V2 acepta `auto` en ambos endpoints (T2I y Edit). Y añade ratios ultra.
export const NANO_BANANA_2_ASPECT_RATIOS = [
  'auto',
  '21:9',
  '16:9',
  '3:2',
  '4:3',
  '5:4',
  '1:1',
  '4:5',
  '3:4',
  '2:3',
  '9:16',
  '4:1',
  '1:4',
  '8:1',
  '1:8'
] as const;
export type NanoBanana2AspectRatio = (typeof NANO_BANANA_2_ASPECT_RATIOS)[number];

export const NANO_BANANA_2_OUTPUT_FORMATS = ['jpeg', 'png', 'webp'] as const;
export type NanoBanana2OutputFormat = (typeof NANO_BANANA_2_OUTPUT_FORMATS)[number];

export const NANO_BANANA_2_SAFETY_TOLERANCES = ['1', '2', '3', '4', '5', '6'] as const;
export type NanoBanana2SafetyTolerance = (typeof NANO_BANANA_2_SAFETY_TOLERANCES)[number];

export const NANO_BANANA_2_RESOLUTIONS = ['0.5K', '1K', '2K', '4K'] as const;
export type NanoBanana2Resolution = (typeof NANO_BANANA_2_RESOLUTIONS)[number];

export const NANO_BANANA_2_THINKING_LEVELS = ['minimal', 'high'] as const;
export type NanoBanana2ThinkingLevel = (typeof NANO_BANANA_2_THINKING_LEVELS)[number];

// Defaults documentados (referencia para la UI; no enforced).
export const NANO_BANANA_2_DEFAULTS = {
  num_images: 1,
  aspect_ratio: 'auto' as NanoBanana2AspectRatio,
  output_format: 'png' as NanoBanana2OutputFormat,
  safety_tolerance: '4' as NanoBanana2SafetyTolerance,
  resolution: '1K' as NanoBanana2Resolution,
  limit_generations: true
} as const;
