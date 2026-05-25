import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';
import {
  FLUX_IMAGE_SIZE_PRESETS,
  type FluxImageSizePreset
} from '../catalog/flux-options.js';
import {
  FLUX_PULID_MAX_SEQ_LENGTHS,
  type FluxPulidMaxSeqLength
} from '../catalog/flux-pulid-options.js';

// FLUX PuLID — preservación de identidad facial sobre Flux.1-dev.
// Caso de uso: una foto de cara → distintas escenas manteniendo identidad.

export type FluxPulidImageSize = FluxImageSizePreset | { width: number; height: number };

export interface FluxPulidBody {
  prompt: string;
  reference_image_url: string;
  image_size?: FluxPulidImageSize;
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  negative_prompt?: string;
  sync_mode?: boolean;
  start_step?: number;
  true_cfg?: number;
  /** Peso de la identidad facial. Default 1. Más alto = más adherencia a la cara de referencia. */
  id_weight?: number;
  enable_safety_checker?: boolean;
  max_sequence_length?: FluxPulidMaxSeqLength;
}

function isPresetSize(v: unknown): v is FluxImageSizePreset {
  return typeof v === 'string' && (FLUX_IMAGE_SIZE_PRESETS as readonly string[]).includes(v);
}

export async function submitFluxPulid(
  fal: FalClient,
  modelId: string,
  body: FluxPulidBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) {
    throw new NucleoError(400, 'prompt requerido');
  }
  if (!body.reference_image_url || !body.reference_image_url.trim()) {
    throw new NucleoError(400, 'reference_image_url requerido');
  }

  const input: Record<string, unknown> = {
    prompt: body.prompt.trim(),
    reference_image_url: body.reference_image_url
  };

  if (body.image_size !== undefined) {
    if (isPresetSize(body.image_size)) {
      input.image_size = body.image_size;
    } else if (
      typeof body.image_size === 'object' &&
      typeof body.image_size.width === 'number' &&
      typeof body.image_size.height === 'number'
    ) {
      input.image_size = { width: body.image_size.width, height: body.image_size.height };
    } else {
      throw new NucleoError(400, 'image_size inválido (preset o {width, height})');
    }
  }

  if (body.num_inference_steps !== undefined) {
    if (!Number.isInteger(body.num_inference_steps) || body.num_inference_steps < 1) {
      throw new NucleoError(400, 'num_inference_steps debe ser entero >= 1');
    }
    input.num_inference_steps = body.num_inference_steps;
  }

  if (body.seed !== undefined) input.seed = body.seed;

  if (body.guidance_scale !== undefined) {
    if (typeof body.guidance_scale !== 'number' || body.guidance_scale < 0) {
      throw new NucleoError(400, 'guidance_scale debe ser número >= 0');
    }
    input.guidance_scale = body.guidance_scale;
  }

  if (body.negative_prompt && body.negative_prompt.trim()) {
    input.negative_prompt = body.negative_prompt.trim();
  }

  if (body.sync_mode !== undefined) input.sync_mode = body.sync_mode;

  if (body.start_step !== undefined) {
    if (!Number.isInteger(body.start_step) || body.start_step < 0) {
      throw new NucleoError(400, 'start_step debe ser entero >= 0');
    }
    input.start_step = body.start_step;
  }

  if (body.true_cfg !== undefined) {
    if (typeof body.true_cfg !== 'number' || body.true_cfg < 0) {
      throw new NucleoError(400, 'true_cfg debe ser número >= 0');
    }
    input.true_cfg = body.true_cfg;
  }

  if (body.id_weight !== undefined) {
    if (typeof body.id_weight !== 'number') {
      throw new NucleoError(400, 'id_weight debe ser número');
    }
    input.id_weight = body.id_weight;
  }

  if (body.enable_safety_checker !== undefined) {
    input.enable_safety_checker = body.enable_safety_checker;
  }

  if (body.max_sequence_length !== undefined) {
    if (!(FLUX_PULID_MAX_SEQ_LENGTHS as readonly string[]).includes(body.max_sequence_length)) {
      throw new NucleoError(
        400,
        `max_sequence_length inválido (válidos: ${FLUX_PULID_MAX_SEQ_LENGTHS.join(', ')})`
      );
    }
    input.max_sequence_length = body.max_sequence_length;
  }

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function statusFluxPulid(
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

export async function resultFluxPulid(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  return { result: result.data };
}
