import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';
import {
  FLUX_IMAGE_SIZE_PRESETS,
  FLUX_OUTPUT_FORMATS,
  type FluxImageSizePreset,
  type FluxOutputFormat
} from '../catalog/flux-options.js';

// Black Forest Labs FLUX.2 [pro] — endpoint único de text-to-image.
// Schema: prompt (req), image_size (enum o {width,height}), seed,
// safety_tolerance (1-5), enable_safety_checker, output_format, sync_mode.

export type FluxImageSize = FluxImageSizePreset | { width: number; height: number };

export interface Flux2ProT2IBody {
  prompt: string;
  image_size?: FluxImageSize;
  seed?: number;
  safety_tolerance?: 1 | 2 | 3 | 4 | 5;
  enable_safety_checker?: boolean;
  output_format?: FluxOutputFormat;
  sync_mode?: boolean;
}

function isPresetSize(v: unknown): v is FluxImageSizePreset {
  return typeof v === 'string' && (FLUX_IMAGE_SIZE_PRESETS as readonly string[]).includes(v);
}

export async function submitFlux2Pro(
  fal: FalClient,
  modelId: string,
  body: Flux2ProT2IBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) {
    throw new NucleoError(400, 'prompt requerido');
  }

  const input: Record<string, unknown> = { prompt: body.prompt.trim() };

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

  if (body.seed !== undefined) input.seed = body.seed;

  if (body.safety_tolerance !== undefined) {
    if (body.safety_tolerance < 1 || body.safety_tolerance > 5) {
      throw new NucleoError(400, 'safety_tolerance debe estar entre 1 y 5');
    }
    input.safety_tolerance = body.safety_tolerance;
  }

  if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;

  if (body.output_format !== undefined) {
    if (!(FLUX_OUTPUT_FORMATS as readonly string[]).includes(body.output_format)) {
      throw new NucleoError(400, 'output_format inválido (jpeg | png)');
    }
    input.output_format = body.output_format;
  }

  if (body.sync_mode !== undefined) input.sync_mode = body.sync_mode;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function statusFlux2Pro(
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

export async function resultFlux2Pro(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  return { result: result.data };
}
