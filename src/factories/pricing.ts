import { NucleoError } from '../errors.js';
import type { PriceEntry } from '../utils/cost.js';

export type { PriceEntry };

export async function fetchPricing(falKey: string, endpointIds: string[]): Promise<PriceEntry[]> {
  if (endpointIds.length === 0) return [];
  if (endpointIds.length > 50) {
    throw new NucleoError(400, 'fal acepta máximo 50 endpoint_id por llamada');
  }
  const params = new URLSearchParams();
  for (const id of endpointIds) params.append('endpoint_id', id);

  const res = await fetch(`https://api.fal.ai/v1/models/pricing?${params}`, {
    headers: { Authorization: `Key ${falKey}` }
  });
  // fal regresa 404 cuando NINGUNO de los ids del batch tiene pricing publicado
  // (modelos muy nuevos como Hailuo/LTX/Veo Lite). No es un error real.
  if (res.status === 404) return [];
  if (!res.ok) {
    const body = await res.text();
    throw new NucleoError(res.status, `fal pricing fetch falló: ${body}`);
  }
  const data = (await res.json()) as { prices?: PriceEntry[] };
  return data.prices ?? [];
}

export async function fetchPricingBatched(falKey: string, endpointIds: string[]): Promise<PriceEntry[]> {
  if (endpointIds.length === 0) return [];
  const batches: string[][] = [];
  for (let i = 0; i < endpointIds.length; i += 50) batches.push(endpointIds.slice(i, i + 50));

  const allPrices: PriceEntry[] = [];
  for (const batch of batches) {
    const prices = await fetchPricing(falKey, batch);
    allPrices.push(...prices);
  }
  return allPrices;
}
