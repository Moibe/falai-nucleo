import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';
import {
  NANO_BANANA_2_ASPECT_RATIOS,
  NANO_BANANA_2_OUTPUT_FORMATS,
  NANO_BANANA_2_RESOLUTIONS,
  NANO_BANANA_2_SAFETY_TOLERANCES,
  NANO_BANANA_2_THINKING_LEVELS,
  type NanoBanana2AspectRatio,
  type NanoBanana2OutputFormat,
  type NanoBanana2Resolution,
  type NanoBanana2SafetyTolerance,
  type NanoBanana2ThinkingLevel
} from '../catalog/nano-banana-2-options.js';

// Nano Banana 2 — state-of-the-art Google image gen + edit.
// Versión nueva con campos extra: system_prompt, resolution, enable_web_search,
// thinking_level y aspect ratios ultra (4:1, 1:4, 8:1, 1:8).

interface CommonBody {
  prompt: string;
  num_images?: number;
  aspect_ratio?: NanoBanana2AspectRatio;
  output_format?: NanoBanana2OutputFormat;
  safety_tolerance?: NanoBanana2SafetyTolerance;
  resolution?: NanoBanana2Resolution;
  seed?: number;
  sync_mode?: boolean;
  system_prompt?: string;
  limit_generations?: boolean;
  enable_web_search?: boolean;
  thinking_level?: NanoBanana2ThinkingLevel;
}

export interface NanoBanana2T2IBody extends CommonBody {}

export interface NanoBanana2EditBody extends CommonBody {
  image_urls: string[];
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
  if (body.aspect_ratio !== undefined) {
    if (!(NANO_BANANA_2_ASPECT_RATIOS as readonly string[]).includes(body.aspect_ratio)) {
      throw new NucleoError(
        400,
        `aspect_ratio inválido (válidos: ${NANO_BANANA_2_ASPECT_RATIOS.join(', ')})`
      );
    }
  }
  if (body.output_format !== undefined) {
    if (!(NANO_BANANA_2_OUTPUT_FORMATS as readonly string[]).includes(body.output_format)) {
      throw new NucleoError(
        400,
        `output_format inválido (válidos: ${NANO_BANANA_2_OUTPUT_FORMATS.join(', ')})`
      );
    }
  }
  if (body.safety_tolerance !== undefined) {
    if (!(NANO_BANANA_2_SAFETY_TOLERANCES as readonly string[]).includes(body.safety_tolerance)) {
      throw new NucleoError(
        400,
        `safety_tolerance inválido (válidos: ${NANO_BANANA_2_SAFETY_TOLERANCES.join(', ')})`
      );
    }
  }
  if (body.resolution !== undefined) {
    if (!(NANO_BANANA_2_RESOLUTIONS as readonly string[]).includes(body.resolution)) {
      throw new NucleoError(
        400,
        `resolution inválida (válidas: ${NANO_BANANA_2_RESOLUTIONS.join(', ')})`
      );
    }
  }
  if (body.thinking_level !== undefined) {
    if (!(NANO_BANANA_2_THINKING_LEVELS as readonly string[]).includes(body.thinking_level)) {
      throw new NucleoError(
        400,
        `thinking_level inválido (válidos: ${NANO_BANANA_2_THINKING_LEVELS.join(', ')})`
      );
    }
  }
}

function buildCommonInput(body: CommonBody): Record<string, unknown> {
  const input: Record<string, unknown> = { prompt: body.prompt.trim() };
  if (body.num_images !== undefined) input.num_images = body.num_images;
  if (body.aspect_ratio !== undefined) input.aspect_ratio = body.aspect_ratio;
  if (body.output_format !== undefined) input.output_format = body.output_format;
  if (body.safety_tolerance !== undefined) input.safety_tolerance = body.safety_tolerance;
  if (body.resolution !== undefined) input.resolution = body.resolution;
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.sync_mode !== undefined) input.sync_mode = body.sync_mode;
  if (body.system_prompt && body.system_prompt.trim()) input.system_prompt = body.system_prompt.trim();
  if (body.limit_generations !== undefined) input.limit_generations = body.limit_generations;
  if (body.enable_web_search !== undefined) input.enable_web_search = body.enable_web_search;
  if (body.thinking_level !== undefined) input.thinking_level = body.thinking_level;
  return input;
}

export async function submitNanoBanana2T2I(
  fal: FalClient,
  modelId: string,
  body: NanoBanana2T2IBody
): Promise<{ request_id: string }> {
  validateCommon(body);
  const input = buildCommonInput(body);
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function submitNanoBanana2Edit(
  fal: FalClient,
  modelId: string,
  body: NanoBanana2EditBody
): Promise<{ request_id: string }> {
  validateCommon(body);

  if (!Array.isArray(body.image_urls) || body.image_urls.length === 0) {
    throw new NucleoError(400, 'image_urls requerido (array no vacío)');
  }
  if (body.image_urls.some((u) => typeof u !== 'string' || !u.trim())) {
    throw new NucleoError(400, 'image_urls debe contener strings no vacíos');
  }

  const input = buildCommonInput(body);
  input.image_urls = body.image_urls;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function statusNanoBanana2(
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

export async function resultNanoBanana2(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  return { result: result.data };
}
