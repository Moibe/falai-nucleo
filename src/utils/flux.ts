import { ApiError, createFalClient } from '@fal-ai/client';
import { NucleoError } from '../errors.js';
import {
  submitFlux2Pro,
  statusFlux2Pro,
  resultFlux2Pro,
  type Flux2ProT2IBody
} from '../factories/flux-2-pro.js';

/**
 * Wrapper de alto nivel para FLUX.2 [pro] text-to-image. Encapsula:
 *   1. Creación efímera del FalClient (mismo patrón que `uploadFile`).
 *   2. Submit del job.
 *   3. Polling de status hasta COMPLETED / FAILED / CANCELLED / timeout.
 *   4. Fetch del result y normalización a `{ url, width, height, contentType }`.
 *
 * Pensado para callers de servidor (Node/Bun) que solo quieren la URL
 * resultante sin lidiar con el ciclo de queue de fal. La URL devuelta es del
 * CDN fal.media (no es local — el caller decide si la guarda en su storage).
 *
 * Errores:
 *  - 401 si falta apiKey.
 *  - 502 si fal regresa ApiError (sin saldo, key inválida, etc.) — preserva
 *    `body.detail` cuando está disponible.
 *  - 502 si el job termina en FAILED/CANCELLED.
 *  - 504 si el polling rebasa `maxWaitMs` (default 120s).
 *  - 502 si el result no trae una URL válida.
 */

const FLUX_2_PRO_ENDPOINT = 'fal-ai/flux-2-pro';

export type FluxImageResult = {
  url: string;
  width?: number;
  height?: number;
  contentType?: string;
};

export type GenerateFlux2ProOptions = {
  /** Intervalo entre polls de status (ms). Default 2000. */
  pollIntervalMs?: number;
  /** Tiempo máximo total de espera antes de abortar (ms). Default 120000. */
  maxWaitMs?: number;
  /** Override del endpoint id, por si fal renombra o se quiere apuntar a otro tier. */
  modelId?: string;
};

export async function generateFlux2ProImage(
  apiKey: string,
  body: Flux2ProT2IBody,
  opts: GenerateFlux2ProOptions = {}
): Promise<FluxImageResult> {
  if (!apiKey) throw new NucleoError(401, 'apiKey requerido');

  const modelId = opts.modelId ?? FLUX_2_PRO_ENDPOINT;
  const pollIntervalMs = opts.pollIntervalMs ?? 2000;
  const maxWaitMs = opts.maxWaitMs ?? 120000;

  const fal = createFalClient({ credentials: apiKey });

  let requestId: string;
  try {
    const submission = await submitFlux2Pro(fal, modelId, body);
    requestId = submission.request_id;
  } catch (e) {
    if (e instanceof ApiError) {
      const detail =
        (e.body as { detail?: unknown } | undefined)?.detail;
      const reason = typeof detail === 'string' ? detail : e.message ?? 'submit falló';
      throw new NucleoError(e.status || 502, `fal flux submit: ${reason}`);
    }
    throw e;
  }

  const start = Date.now();
  while (true) {
    const { status } = await statusFlux2Pro(fal, modelId, requestId);
    if (status === 'COMPLETED') break;
    if (status === 'FAILED' || status === 'CANCELLED') {
      throw new NucleoError(502, `Flux job ${status}: request_id=${requestId}`);
    }
    if (Date.now() - start > maxWaitMs) {
      throw new NucleoError(504, `Flux job timeout (${maxWaitMs}ms): request_id=${requestId}`);
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  const { result } = await resultFlux2Pro(fal, modelId, requestId);
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
    throw new NucleoError(502, 'Flux result sin URL de imagen');
  }
  return {
    url: img.url,
    width: img.width,
    height: img.height,
    contentType: img.content_type
  };
}
