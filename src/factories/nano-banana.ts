import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';
import {
  NANO_BANANA_ASPECT_RATIOS,
  NANO_BANANA_EDIT_ASPECT_RATIOS,
  NANO_BANANA_OUTPUT_FORMATS,
  NANO_BANANA_SAFETY_TOLERANCES,
  type NanoBananaAspectRatio,
  type NanoBananaEditAspectRatio,
  type NanoBananaOutputFormat,
  type NanoBananaSafetyTolerance
} from '../catalog/nano-banana-options.js';

// Google Gemini 2.5 Flash Image (Nano Banana) — generación T2I y edit
// instruction-based. El edit toma image_urls + prompt y aplica la instrucción
// sin máscaras (remove/add/swap/style).

interface CommonBody {
  prompt: string;
  num_images?: number;
  output_format?: NanoBananaOutputFormat;
  safety_tolerance?: NanoBananaSafetyTolerance;
  seed?: number;
  sync_mode?: boolean;
  limit_generations?: boolean;
}

export interface NanoBananaT2IBody extends CommonBody {
  aspect_ratio?: NanoBananaAspectRatio;
}

export interface NanoBananaEditBody extends CommonBody {
  image_urls: string[];
  aspect_ratio?: NanoBananaEditAspectRatio;
}

function validateCommon(body: CommonBody): void {
  if (!body.prompt || !body.prompt.trim()) {
    throw new NucleoError(400, 'prompt requerido');
  }
  if (body.num_images !== undefined) {
    if (!Number.isInteger(body.num_images) || body.num_images < 1) {
      throw new NucleoError(400, 'num_images debe ser entero >= 1');
    }
  }
  if (body.output_format !== undefined) {
    if (!(NANO_BANANA_OUTPUT_FORMATS as readonly string[]).includes(body.output_format)) {
      throw new NucleoError(
        400,
        `output_format inválido (válidos: ${NANO_BANANA_OUTPUT_FORMATS.join(', ')})`
      );
    }
  }
  if (body.safety_tolerance !== undefined) {
    if (!(NANO_BANANA_SAFETY_TOLERANCES as readonly string[]).includes(body.safety_tolerance)) {
      throw new NucleoError(
        400,
        `safety_tolerance inválido (válidos: ${NANO_BANANA_SAFETY_TOLERANCES.join(', ')})`
      );
    }
  }
}

function buildCommonInput(body: CommonBody): Record<string, unknown> {
  const input: Record<string, unknown> = { prompt: body.prompt.trim() };
  if (body.num_images !== undefined) input.num_images = body.num_images;
  if (body.output_format !== undefined) input.output_format = body.output_format;
  if (body.safety_tolerance !== undefined) input.safety_tolerance = body.safety_tolerance;
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.sync_mode !== undefined) input.sync_mode = body.sync_mode;
  if (body.limit_generations !== undefined) input.limit_generations = body.limit_generations;
  return input;
}

export async function submitNanoBananaT2I(
  fal: FalClient,
  modelId: string,
  body: NanoBananaT2IBody
): Promise<{ request_id: string }> {
  validateCommon(body);

  if (body.aspect_ratio !== undefined) {
    if (!(NANO_BANANA_ASPECT_RATIOS as readonly string[]).includes(body.aspect_ratio)) {
      throw new NucleoError(
        400,
        `aspect_ratio inválido para T2I (válidos: ${NANO_BANANA_ASPECT_RATIOS.join(', ')})`
      );
    }
  }

  const input = buildCommonInput(body);
  if (body.aspect_ratio !== undefined) input.aspect_ratio = body.aspect_ratio;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function submitNanoBananaEdit(
  fal: FalClient,
  modelId: string,
  body: NanoBananaEditBody
): Promise<{ request_id: string }> {
  validateCommon(body);

  if (!Array.isArray(body.image_urls) || body.image_urls.length === 0) {
    throw new NucleoError(400, 'image_urls requerido (array no vacío)');
  }
  if (body.image_urls.some((u) => typeof u !== 'string' || !u.trim())) {
    throw new NucleoError(400, 'image_urls debe contener strings no vacíos');
  }

  if (body.aspect_ratio !== undefined) {
    if (!(NANO_BANANA_EDIT_ASPECT_RATIOS as readonly string[]).includes(body.aspect_ratio)) {
      throw new NucleoError(
        400,
        `aspect_ratio inválido para edit (válidos: ${NANO_BANANA_EDIT_ASPECT_RATIOS.join(', ')})`
      );
    }
  }

  const input = buildCommonInput(body);
  input.image_urls = body.image_urls;
  if (body.aspect_ratio !== undefined) input.aspect_ratio = body.aspect_ratio;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function statusNanoBanana(
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

export async function resultNanoBanana(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  return { result: result.data };
}
