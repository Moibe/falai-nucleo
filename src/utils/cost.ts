// Pure cost helpers. The audio multiplier is approximate — based on observed o3 R2V data
// (audio off $0.112/s, on $0.14/s = 1.25x). Other endpoints may differ; revisit when confirmed.

export const AUDIO_MULTIPLIER = 1.25;

export type PriceEntry = {
  endpoint_id: string;
  unit_price: number;
  unit: string;
  currency: string;
};

export type PriceMap = Record<string, { unit_price: number; unit: string; currency: string }>;

export function estimateCost(
  unitPrice: number,
  duration: number,
  audio: boolean
): number {
  return unitPrice * duration * (audio ? AUDIO_MULTIPLIER : 1);
}

export function formatCost(usd: number): string {
  if (usd < 0.01) return '< $0.01';
  return `$${usd.toFixed(2)}`;
}
