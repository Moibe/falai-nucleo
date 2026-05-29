// Nano Banana (Google Gemini 2.5 Flash Image) — image generation + edit.
// Texto a imagen: fal-ai/nano-banana — sin imagen de referencia.
// Edit instruction-based: fal-ai/nano-banana/edit — toma image_urls + prompt.

export type NanoBananaOption = {
  slug: string;
  label: string;
};

export const NANO_BANANA_OPTIONS: NanoBananaOption[] = [
  { slug: 'text-to-image', label: 'Text to Image' },
  { slug: 'edit', label: 'Image Edit (instruction-based)' }
];

export type NanoBananaTier = 't2i' | 'edit';

export type NanoBananaTierMeta = {
  value: NanoBananaTier;
  label: string;
  hint: string;
  endpoint: string;
  acceptsAuto: boolean;
};

export const NANO_BANANA_TIERS: NanoBananaTierMeta[] = [
  {
    value: 't2i',
    label: 'Text to Image',
    hint: 'Generación desde texto, sin referencia',
    endpoint: 'fal-ai/nano-banana',
    acceptsAuto: false
  },
  {
    value: 'edit',
    label: 'Edit',
    hint: 'Editing instruction-based con image_urls (remove/add/swap)',
    endpoint: 'fal-ai/nano-banana/edit',
    acceptsAuto: true
  }
];

export const NANO_BANANA_DEFAULT_TIER: NanoBananaTier = 'edit';

// Aspect ratios soportados (edit añade 'auto' como default).
export const NANO_BANANA_ASPECT_RATIOS = [
  '21:9',
  '16:9',
  '3:2',
  '4:3',
  '5:4',
  '1:1',
  '4:5',
  '3:4',
  '2:3',
  '9:16'
] as const;
export type NanoBananaAspectRatio = (typeof NANO_BANANA_ASPECT_RATIOS)[number];

// `auto` solo aplica al endpoint /edit.
export const NANO_BANANA_EDIT_ASPECT_RATIOS = ['auto', ...NANO_BANANA_ASPECT_RATIOS] as const;
export type NanoBananaEditAspectRatio = (typeof NANO_BANANA_EDIT_ASPECT_RATIOS)[number];

export const NANO_BANANA_OUTPUT_FORMATS = ['jpeg', 'png', 'webp'] as const;
export type NanoBananaOutputFormat = (typeof NANO_BANANA_OUTPUT_FORMATS)[number];

// fal acepta el safety_tolerance como string '1'..'6'.
export const NANO_BANANA_SAFETY_TOLERANCES = ['1', '2', '3', '4', '5', '6'] as const;
export type NanoBananaSafetyTolerance = (typeof NANO_BANANA_SAFETY_TOLERANCES)[number];

// Defaults documentados por fal (referencia para la UI; no enforced).
export const NANO_BANANA_DEFAULTS = {
  num_images: 1,
  t2i_aspect_ratio: '1:1' as NanoBananaAspectRatio,
  edit_aspect_ratio: 'auto' as NanoBananaEditAspectRatio,
  output_format: 'png' as NanoBananaOutputFormat,
  safety_tolerance: '4' as NanoBananaSafetyTolerance,
  sync_mode: false,
  limit_generations: false
} as const;
