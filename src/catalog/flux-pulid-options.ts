// FLUX PuLID — adapter sobre Flux.1-dev para preservación de identidad facial.
// Comparte presets de image_size con flux-2-pro (FLUX_IMAGE_SIZE_PRESETS).

export type FluxPulidOption = {
  slug: string;
  label: string;
};

export const FLUX_PULID_OPTIONS: FluxPulidOption[] = [
  { slug: 'image-to-image', label: 'Identity-preserving generation' }
];

export const FLUX_PULID_MAX_SEQ_LENGTHS = ['128', '256', '512'] as const;
export type FluxPulidMaxSeqLength = (typeof FLUX_PULID_MAX_SEQ_LENGTHS)[number];

// Defaults documentados por fal (referencia para la UI; no enforced).
export const FLUX_PULID_DEFAULTS = {
  num_inference_steps: 20,
  guidance_scale: 4,
  true_cfg: 1,
  id_weight: 1,
  max_sequence_length: '128' as FluxPulidMaxSeqLength,
  enable_safety_checker: true
} as const;
