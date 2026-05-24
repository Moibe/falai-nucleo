// Tiers per Kling generation. v2.6 currently exposes only `pro`; structure kept consistent
// across versions in case fal adds more tiers later.

export type V3Tier = '4k' | 'pro' | 'standard';

export const V3_TIERS: { value: V3Tier; label: string; hint: string }[] = [
  { value: 'standard', label: 'Standard', hint: 'rápido / económico' },
  { value: 'pro', label: 'Pro', hint: 'balanceado' },
  { value: '4k', label: '4K', hint: 'máxima calidad' }
];

export const V3_DEFAULT_TIER: V3Tier = 'pro';

export type O3Option = { slug: string; label: string };

export const O3_OPTIONS: O3Option[] = [
  { slug: 'image-to-video', label: 'Image / Text to Video' },
  { slug: 'reference-to-video', label: 'Reference to Video' },
  { slug: 'edit-video', label: 'Edit Video' }
];

export type O3Tier = '4k' | 'pro' | 'standard';

export const O3_TIERS: { value: O3Tier; label: string; hint: string }[] = [
  { value: 'standard', label: 'Standard', hint: 'rápido / económico' },
  { value: 'pro', label: 'Pro', hint: 'balanceado' },
  { value: '4k', label: '4K', hint: 'máxima calidad' }
];

export const O3_DEFAULT_TIER: O3Tier = 'pro';

export type V21Tier = 'master' | 'pro' | 'standard';

export const V21_TIERS: { value: V21Tier; label: string; hint: string }[] = [
  { value: 'standard', label: 'Standard', hint: 'rápido / económico (i2v)' },
  { value: 'pro', label: 'Pro', hint: 'i2v + tail image' },
  { value: 'master', label: 'Master', hint: 'máxima calidad (i2v + t2v)' }
];

export const V21_DEFAULT_TIER: V21Tier = 'pro';

export type V25TurboTier = 'pro' | 'standard';

export const V25TURBO_TIERS: { value: V25TurboTier; label: string; hint: string }[] = [
  { value: 'standard', label: 'Standard', hint: 'rápido / económico' },
  { value: 'pro', label: 'Pro', hint: 'tail image + t2v' }
];

export const V25TURBO_DEFAULT_TIER: V25TurboTier = 'pro';

export type V26Tier = 'pro';

export const V26_TIERS: { value: V26Tier; label: string; hint: string }[] = [
  { value: 'pro', label: 'Pro', hint: 'único tier disponible' }
];

export const V26_DEFAULT_TIER: V26Tier = 'pro';
