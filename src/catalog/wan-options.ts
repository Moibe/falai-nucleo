// Wan (Alibaba) — versiones disponibles en fal.ai.
// Forma unificada para t2v + i2v (creationMode picker estilo Happy Horse).
// El dropdown elige modelo; cada modelo tiene sus capacidades (i2v supportado o no, etc).

export type WanTask = 'i2v' | 't2v';

export type WanModel = {
  slug: string;
  label: string;
  hint: string;
  t2vModelId: string | null;
  i2vModelId: string | null;
  supportsAspectRatio: boolean;
  aspectRatios: ('16:9' | '9:16' | '1:1' | '4:3' | '3:4')[];
  resolutions: string[];
  durations: number[];
  defaultDuration: number;
  supportsNegativePrompt: boolean;
  supportsSafetyChecker: boolean;
  supportsPromptExpansion: boolean;
  note?: string;
};

export const WAN_MODELS: WanModel[] = [
  {
    slug: 'v2-7',
    label: 'v2.7',
    hint: 'última generación · multi-shot',
    t2vModelId: 'fal-ai/wan/v2.7/text-to-video',
    i2vModelId: 'fal-ai/wan/v2.7/image-to-video',
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4'],
    resolutions: ['720p', '1080p'],
    durations: [2, 3, 5, 8, 10, 12, 15],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true
  },
  {
    slug: 'v2-5-preview',
    label: 'v2.5 (preview)',
    hint: 'alta calidad · 480p–1080p',
    t2vModelId: 'fal-ai/wan-25-preview/text-to-video',
    i2vModelId: 'fal-ai/wan-25-preview/image-to-video',
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['480p', '720p', '1080p'],
    durations: [5, 10],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true
  },
  {
    slug: 'v2-6',
    label: 'v2.6',
    hint: 'multi-shot · narrativa',
    t2vModelId: 'fal-ai/wan/v2.6/text-to-video',
    i2vModelId: 'fal-ai/wan/v2.6/image-to-video',
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4'],
    resolutions: ['720p', '1080p'],
    durations: [5, 10, 15],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true,
    note: 'Soporta multi-shot dentro del prompt (formato: "Descripción. Shot 1 [0-3s]...")'
  },
  {
    slug: 'v2-2-a14b',
    label: 'v2.2-a14b',
    hint: 'standard 14B · balanceado',
    t2vModelId: 'fal-ai/wan/v2.2-a14b/text-to-video',
    i2vModelId: 'fal-ai/wan/v2.2-a14b/image-to-video',
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['480p', '580p', '720p'],
    durations: [],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true,
    note: 'Configura por num_frames (81 ≈ 5s a 16fps)'
  },
  {
    slug: 'v2-2-a14b-turbo',
    label: 'v2.2-a14b turbo',
    hint: 'rápido · 14B distill',
    t2vModelId: 'fal-ai/wan/v2.2-a14b/text-to-video/turbo',
    i2vModelId: 'fal-ai/wan/v2.2-a14b/image-to-video/turbo',
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['480p', '580p', '720p'],
    durations: [],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true
  },
  {
    slug: 'v2-2-5b',
    label: 'v2.2-5B',
    hint: 'ligero · 5B params',
    t2vModelId: 'fal-ai/wan/v2.2-5b/text-to-video',
    i2vModelId: 'fal-ai/wan/v2.2-5b/image-to-video',
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['580p', '720p'],
    durations: [],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true
  },
  {
    slug: 'v2-2-5b-fast',
    label: 'v2.2-5B fast',
    hint: 'fast-wan · 5B distill',
    t2vModelId: 'fal-ai/wan/v2.2-5b/text-to-video/fast-wan',
    i2vModelId: null,
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['580p', '720p'],
    durations: [],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true
  },
  {
    slug: 'pro',
    label: 'Wan Pro',
    hint: 'premium · 1080p 30fps 6s',
    t2vModelId: 'fal-ai/wan-pro/text-to-video',
    i2vModelId: 'fal-ai/wan-pro/image-to-video',
    supportsAspectRatio: false,
    aspectRatios: [],
    resolutions: [],
    durations: [],
    defaultDuration: 6,
    supportsNegativePrompt: false,
    supportsSafetyChecker: true,
    supportsPromptExpansion: false,
    note: 'Pro genera 1080p / 30fps / 6s fijo. Solo prompt + seed.'
  },
  {
    slug: 'v2-1',
    label: 'v2.1',
    hint: 'gen anterior',
    t2vModelId: 'fal-ai/wan-t2v',
    i2vModelId: 'fal-ai/wan-i2v',
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['480p', '580p', '720p'],
    durations: [],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true
  },
  {
    slug: 'v2-1-1-3b',
    label: 'v2.1 1.3B',
    hint: 'ligero · económico',
    t2vModelId: 'fal-ai/wan/v2.1/1.3b/text-to-video',
    i2vModelId: null,
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['480p', '720p'],
    durations: [],
    defaultDuration: 5,
    supportsNegativePrompt: true,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true
  },
  {
    slug: 'alpha',
    label: 'Wan Alpha',
    hint: 'fondos transparentes (alpha)',
    t2vModelId: 'fal-ai/wan-alpha',
    i2vModelId: null,
    supportsAspectRatio: true,
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['240p', '360p', '480p', '580p', '720p'],
    durations: [],
    defaultDuration: 5,
    supportsNegativePrompt: false,
    supportsSafetyChecker: true,
    supportsPromptExpansion: true,
    note: 'Salida con canal alpha (transparente). Útil para overlays / VFX.'
  }
];

export const WAN_DEFAULT_SLUG = 'v2-7';

export function getWanModel(slug: string): WanModel {
  return WAN_MODELS.find((m) => m.slug === slug) ?? WAN_MODELS[0];
}

export function allWanEndpointIds(): string[] {
  const ids = new Set<string>();
  for (const m of WAN_MODELS) {
    if (m.t2vModelId) ids.add(m.t2vModelId);
    if (m.i2vModelId) ids.add(m.i2vModelId);
  }
  return [...ids];
}
