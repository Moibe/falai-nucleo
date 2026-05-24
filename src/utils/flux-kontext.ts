import { ApiError, createFalClient } from '@fal-ai/client';
import { NucleoError } from '../errors.js';
import {
  isFluxKontextMultiBody,
  submitFluxKontext,
  statusFluxKontext,
  resultFluxKontext,
  type FluxKontextBody
} from '../factories/flux-kontext.js';
import {
  FLUX_KONTEXT_TIERS,
  type FluxKontextTier
} from '../catalog/flux-kontext-options.js';
import type { FluxImageResult } from './flux.js';

/**
 * Wrapper de alto nivel para FLUX.1 Kontext (familia image-to-image que
 * preserva identidad). Mismo patrón que `generateFlux2ProImage` en flux.ts:
 * crea FalClient → submit → polling → result, devuelve URL del CDN fal.media.
 *
 * Selección del endpoint:
 *  - Si pasas `opts.tier` ('pro' | 'max' | 'multi'), se usa ese endpoint.
 *  - Si no, se infiere por la shape del body: `image_urls` → multi, `image_url`
 *    → pro (default).
 *  - Inconsistencia (e.g. tier='multi' con image_url) lanza NucleoError 400.
 *
 * El re-export del tipo `FluxImageResult` viene de flux.ts — ambas familias
 * (FLUX.2 [pro] y Kontext) devuelven la misma shape de imagen.
 */

export type GenerateFluxKontextOptions = {
  /** Intervalo entre polls (ms). Default 2000. */
  pollIntervalMs?: number;
  /** Tiempo máximo total (ms). Default 120000. */
  maxWaitMs?: number;
  /** Tier explícito; si se omite, se deriva del body shape. */
  tier?: FluxKontextTier;
};

function resolveTier(body: FluxKontextBody, requested?: FluxKontextTier): FluxKontextTier {
  const isMulti = isFluxKontextMultiBody(body);
  if (requested) {
    if (isMulti && requested !== 'multi') {
      throw new NucleoError(
        400,
        `tier='${requested}' es incompatible con image_urls (array). Usa tier='multi' o cambia el body a image_url (string).`
      );
    }
    if (!isMulti && requested === 'multi') {
      throw new NucleoError(
        400,
        `tier='multi' requiere image_urls (array) en el body, no image_url (string).`
      );
    }
    return requested;
  }
  return isMulti ? 'multi' : 'pro';
}

export async function generateFluxKontextImage(
  apiKey: string,
  body: FluxKontextBody,
  opts: GenerateFluxKontextOptions = {}
): Promise<FluxImageResult> {
  if (!apiKey) throw new NucleoError(401, 'apiKey requerido');

  const tier = resolveTier(body, opts.tier);
  const tierMeta = FLUX_KONTEXT_TIERS.find((t) => t.value === tier);
  if (!tierMeta) {
    throw new NucleoError(500, `tier desconocido: ${tier}`);
  }
  const modelId = tierMeta.endpoint;

  const pollIntervalMs = opts.pollIntervalMs ?? 2000;
  const maxWaitMs = opts.maxWaitMs ?? 120000;

  const fal = createFalClient({ credentials: apiKey });

  let requestId: string;
  try {
    const submission = await submitFluxKontext(fal, modelId, body);
    requestId = submission.request_id;
  } catch (e) {
    if (e instanceof ApiError) {
      const detail = (e.body as { detail?: unknown } | undefined)?.detail;
      const reason = typeof detail === 'string' ? detail : e.message ?? 'submit falló';
      throw new NucleoError(e.status || 502, `fal flux-kontext submit: ${reason}`);
    }
    throw e;
  }

  const start = Date.now();
  while (true) {
    const { status } = await statusFluxKontext(fal, modelId, requestId);
    if (status === 'COMPLETED') break;
    if (status === 'FAILED' || status === 'CANCELLED') {
      throw new NucleoError(502, `Flux Kontext job ${status}: request_id=${requestId}`);
    }
    if (Date.now() - start > maxWaitMs) {
      throw new NucleoError(
        504,
        `Flux Kontext job timeout (${maxWaitMs}ms): request_id=${requestId}`
      );
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  const { result } = await resultFluxKontext(fal, modelId, requestId);
  const r = result as {
    images?: Array<{
      url?: string;
      width?: number;
      height?: number;
      content_type?: string;
    }>;
  };
  const img = r.images?.[0];
  if (!img?.url) {
    throw new NucleoError(502, 'Flux Kontext result sin URL de imagen');
  }
  return {
    url: img.url,
    width: img.width,
    height: img.height,
    contentType: img.content_type
  };
}
