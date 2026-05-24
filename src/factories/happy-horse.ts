import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
type Resolution = '720p' | '1080p';

export interface HappyHorseI2VBody {
  image_url: string;
  prompt?: string;
  resolution?: Resolution;
  duration?: number;
  seed?: number;
  enable_safety_checker?: boolean;
}

export async function happyHorseI2VSubmit(
  fal: FalClient,
  modelId: string,
  body: HappyHorseI2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');

  const input: Record<string, unknown> = { image_url: body.image_url };
  if (body.prompt) input.prompt = body.prompt;
  if (body.resolution) input.resolution = body.resolution;
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface HappyHorseT2VBody {
  prompt: string;
  aspect_ratio?: AspectRatio;
  resolution?: Resolution;
  duration?: number;
  seed?: number;
  enable_safety_checker?: boolean;
}

export async function happyHorseT2VSubmit(
  fal: FalClient,
  modelId: string,
  body: HappyHorseT2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const input: Record<string, unknown> = { prompt: body.prompt.trim() };
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.resolution) input.resolution = body.resolution;
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface HappyHorseR2VBody {
  prompt: string;
  image_urls: string[];
  aspect_ratio?: AspectRatio;
  resolution?: Resolution;
  duration?: number;
  seed?: number;
  enable_safety_checker?: boolean;
}

export async function happyHorseR2VSubmit(
  fal: FalClient,
  modelId: string,
  body: HappyHorseR2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');
  if (!Array.isArray(body.image_urls) || body.image_urls.length === 0) {
    throw new NucleoError(400, 'image_urls requerido (1-9 imágenes)');
  }
  if (body.image_urls.length > 9) {
    throw new NucleoError(400, 'máximo 9 imágenes en image_urls');
  }

  const input: Record<string, unknown> = {
    prompt: body.prompt.trim(),
    image_urls: body.image_urls
  };
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.resolution) input.resolution = body.resolution;
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface HappyHorseEditBody {
  video_url: string;
  prompt: string;
  reference_image_urls?: string[];
  resolution?: Resolution;
  audio_setting?: 'auto' | 'origin';
  seed?: number;
  enable_safety_checker?: boolean;
}

export async function happyHorseEditSubmit(
  fal: FalClient,
  modelId: string,
  body: HappyHorseEditBody
): Promise<{ request_id: string }> {
  if (!body.video_url) throw new NucleoError(400, 'video_url requerido');
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');
  if (body.reference_image_urls && body.reference_image_urls.length > 5) {
    throw new NucleoError(400, 'máximo 5 imágenes de referencia');
  }

  const input: Record<string, unknown> = {
    video_url: body.video_url,
    prompt: body.prompt.trim()
  };
  if (body.reference_image_urls && body.reference_image_urls.length > 0) {
    input.reference_image_urls = body.reference_image_urls;
  }
  if (body.resolution) input.resolution = body.resolution;
  if (body.audio_setting) input.audio_setting = body.audio_setting;
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function happyHorseStatus(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ status: string; result?: unknown; logs: unknown[] }> {
  const status = await fal.queue.status(modelId, { requestId, logs: true });
  if (status.status === 'COMPLETED') {
    const result = await fal.queue.result(modelId, { requestId });
    return {
      status: 'COMPLETED',
      result: result.data,
      logs: 'logs' in status ? status.logs ?? [] : []
    };
  }
  return {
    status: status.status,
    logs: 'logs' in status ? status.logs ?? [] : []
  };
}
