// FLUX.1 Kontext — familia de endpoints image-to-image que preservan identidad
// (rostro/cuerpo) entre una imagen de referencia y el output. Distinta de
// FLUX.2 [pro] (que vive en flux-options.ts) — Kontext es la rama "edit" /
// "variation" de Flux, perfecta para lookbooks: misma persona en distintos
// outfits/escenarios.
//
// 4 tiers conocidos (verificado fal docs):
//   - pro        → fal-ai/flux-pro/kontext            (1 image_url, calidad estándar)
//   - max        → fal-ai/flux-pro/kontext/max        (1 image_url, calidad superior)
//   - multi      → fal-ai/flux-pro/kontext/multi      (array image_urls, pro tier)
//   - max-multi  → fal-ai/flux-pro/kontext/max/multi  (array image_urls, max tier)
//
// Nota: `multi` históricamente apunta al pro-multi (mantenido por compatibilidad
// con consumidores existentes que pasan tier='multi'). El nuevo `max-multi` es
// el experimental Multi Image del tier Max.

export type FluxKontextTier = 'pro' | 'max' | 'multi' | 'max-multi';

export type FluxKontextTierMeta = {
  value: FluxKontextTier;
  label: string;
  hint: string;
  endpoint: string;
  /** true cuando el endpoint acepta `image_urls` (array) en vez de `image_url`. */
  multi: boolean;
};

export const FLUX_KONTEXT_TIERS: FluxKontextTierMeta[] = [
  {
    value: 'pro',
    label: 'Pro',
    hint: 'FLUX.1 Kontext [pro] — 1 imagen de referencia, calidad estándar',
    endpoint: 'fal-ai/flux-pro/kontext',
    multi: false
  },
  {
    value: 'max',
    label: 'Max',
    hint: 'FLUX.1 Kontext [max] — 1 imagen, calidad superior, más caro',
    endpoint: 'fal-ai/flux-pro/kontext/max',
    multi: false
  },
  {
    value: 'multi',
    label: 'Multi (Pro)',
    hint: 'FLUX.1 Kontext [pro] Multi — varias imágenes combinadas como referencia',
    endpoint: 'fal-ai/flux-pro/kontext/multi',
    multi: true
  },
  {
    value: 'max-multi',
    label: 'Multi (Max)',
    hint: 'FLUX.1 Kontext [max] Multi — varias imágenes combinadas, calidad superior',
    endpoint: 'fal-ai/flux-pro/kontext/max/multi',
    multi: true
  }
];

export const FLUX_KONTEXT_DEFAULT_TIER: FluxKontextTier = 'pro';

export type FluxKontextAspectRatio =
  | '21:9'
  | '16:9'
  | '4:3'
  | '3:2'
  | '1:1'
  | '2:3'
  | '3:4'
  | '9:16'
  | '9:21';

export const FLUX_KONTEXT_ASPECT_RATIOS: FluxKontextAspectRatio[] = [
  '21:9',
  '16:9',
  '4:3',
  '3:2',
  '1:1',
  '2:3',
  '3:4',
  '9:16',
  '9:21'
];

// safety_tolerance es string en el body de fal aunque represente un nivel 1-6.
// Lo modelamos como literal-string para que TypeScript valide el dominio.
export type FluxKontextSafetyTolerance = '1' | '2' | '3' | '4' | '5' | '6';

export const FLUX_KONTEXT_SAFETY_TOLERANCES: FluxKontextSafetyTolerance[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6'
];

export const FLUX_KONTEXT_OUTPUT_FORMATS = ['jpeg', 'png'] as const;
export type FluxKontextOutputFormat = (typeof FLUX_KONTEXT_OUTPUT_FORMATS)[number];
