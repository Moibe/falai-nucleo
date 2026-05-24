import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';
import {
  FLUX_KONTEXT_ASPECT_RATIOS,
  FLUX_KONTEXT_OUTPUT_FORMATS,
  FLUX_KONTEXT_SAFETY_TOLERANCES,
  type FluxKontextAspectRatio,
  type FluxKontextOutputFormat,
  type FluxKontextSafetyTolerance
} from '../catalog/flux-kontext-options.js';

// Body común a las 3 variantes de FLUX.1 Kontext. La única diferencia entre
// pro/max y multi es `image_url` (string) vs `image_urls` (array). Modelamos
// como union discriminada para mantener type safety.

interface FluxKontextCommonBody {
  prompt: string;
  aspect_ratio?: FluxKontextAspectRatio;
  /** CFG scale (default 3.5 según fal). Más alto = más adherencia al prompt. */
  guidance_scale?: number;
  /** Cuántas imágenes generar en una sola request. Default 1. */
  num_images?: number;
  seed?: number;
  safety_tolerance?: FluxKontextSafetyTolerance;
  output_format?: FluxKontextOutputFormat;
  sync_mode?: boolean;
  enhance_prompt?: boolean;
}

export interface FluxKontextSingleBody extends FluxKontextCommonBody {
  /** URL de la imagen de referencia (tier pro/max). */
  image_url: string;
}

export interface FluxKontextMultiBody extends FluxKontextCommonBody {
  /** URLs de las imágenes de referencia (tier multi). Array no vacío. */
  image_urls: string[];
}

export type FluxKontextBody = FluxKontextSingleBody | FluxKontextMultiBody;

export function isFluxKontextMultiBody(b: FluxKontextBody): b is FluxKontextMultiBody {
  return 'image_urls' in b;
}

function validateCommon(body: FluxKontextCommonBody): void {
  if (!body.prompt || !body.prompt.trim()) {
    throw new NucleoError(400, 'prompt requerido');
  }
  if (body.aspect_ratio !== undefined) {
    if (!(FLUX_KONTEXT_ASPECT_RATIOS as readonly string[]).includes(body.aspect_ratio)) {
      throw new NucleoError(400, `aspect_ratio inválido (válidos: ${FLUX_KONTEXT_ASPECT_RATIOS.join(', ')})`);
    }
  }
  if (body.guidance_scale !== undefined) {
    if (typeof body.guidance_scale !== 'number' || body.guidance_scale < 0) {
      throw new NucleoError(400, 'guidance_scale debe ser número >= 0');
    }
  }
  if (body.num_images !== undefined) {
    if (!Number.isInteger(body.num_images) || body.num_images < 1) {
      throw new NucleoError(400, 'num_images debe ser entero >= 1');
    }
  }
  if (body.safety_tolerance !== undefined) {
    if (!(FLUX_KONTEXT_SAFETY_TOLERANCES as readonly string[]).includes(body.safety_tolerance)) {
      throw new NucleoError(400, 'safety_tolerance inválido (1-6 como string)');
    }
  }
  if (body.output_format !== undefined) {
    if (!(FLUX_KONTEXT_OUTPUT_FORMATS as readonly string[]).includes(body.output_format)) {
      throw new NucleoError(400, 'output_format inválido (jpeg | png)');
    }
  }
}

/**
 * Submitea un job de FLUX.1 Kontext. El caller pasa el `modelId` exacto del
 * endpoint (fal-ai/flux-pro/kontext, /max, o /multi) — el body debe coincidir
 * en shape (single image_url vs array image_urls).
 */
export async function submitFluxKontext(
  fal: FalClient,
  modelId: string,
  body: FluxKontextBody
): Promise<{ request_id: string }> {
  validateCommon(body);

  if (isFluxKontextMultiBody(body)) {
    if (!Array.isArray(body.image_urls) || body.image_urls.length === 0) {
      throw new NucleoError(400, 'image_urls (array no vacío) requerido');
    }
    if (body.image_urls.some((u) => typeof u !== 'string' || !u.trim())) {
      throw new NucleoError(400, 'image_urls debe contener strings no vacíos');
    }
  } else {
    if (!body.image_url || !body.image_url.trim()) {
      throw new NucleoError(400, 'image_url requerido');
    }
  }

  // Pasamos el body verbatim (ya validado). fal acepta el shape como está,
  // sin necesidad de renombrar/transformar campos.
  const input: Record<string, unknown> = { ...body, prompt: body.prompt.trim() };

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function statusFluxKontext(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ status: string; logs: unknown[] }> {
  const status = await fal.queue.status(modelId, { requestId, logs: true });
  return {
    status: status.status,
    logs: 'logs' in status ? status.logs ?? [] : []
  };
}

export async function resultFluxKontext(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  return { result: result.data };
}
