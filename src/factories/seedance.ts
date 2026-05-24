import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type AspectRatio = 'auto' | '21:9' | '16:9' | '4:3' | '1:1' | '3:4' | '9:16';
type Resolution = '480p' | '720p' | '1080p';
// Duration: v2 acepta "auto" o 4-15; v1 acepta 2-12 (siempre como string en payload).
type DurationVal = number | 'auto';

export interface SeedanceI2VBody {
  image_url: string;
  prompt?: string;
  end_image_url?: string;
  duration?: DurationVal;
  resolution?: Resolution;
  aspect_ratio?: AspectRatio;
  generate_audio?: boolean;
  seed?: number;
  camera_fixed?: boolean;
  enable_safety_checker?: boolean;
  num_frames?: number;
  family?: 'v2' | 'v1';
}

export async function seedanceI2VSubmit(
  fal: FalClient,
  modelId: string,
  body: SeedanceI2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');

  const family = body.family ?? (modelId.includes('seedance-2.0') ? 'v2' : 'v1');
  const input: Record<string, unknown> = { image_url: body.image_url };

  if (body.prompt && body.prompt.trim()) input.prompt = body.prompt.trim();
  if (body.end_image_url) input.end_image_url = body.end_image_url;
  if (body.resolution) input.resolution = body.resolution;
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;

  if (body.duration !== undefined) {
    input.duration = typeof body.duration === 'number' ? String(body.duration) : body.duration;
  }
  if (body.seed !== undefined) input.seed = body.seed;

  if (family === 'v2') {
    if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;
  } else {
    if (body.camera_fixed !== undefined) input.camera_fixed = body.camera_fixed;
    if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;
    if (body.num_frames !== undefined) input.num_frames = body.num_frames;
  }

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface SeedanceT2VBody {
  prompt: string;
  duration?: DurationVal;
  resolution?: Resolution;
  aspect_ratio?: AspectRatio;
  generate_audio?: boolean;
  seed?: number;
  camera_fixed?: boolean;
  enable_safety_checker?: boolean;
  num_frames?: number;
  family?: 'v2' | 'v1';
}

export async function seedanceT2VSubmit(
  fal: FalClient,
  modelId: string,
  body: SeedanceT2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const family = body.family ?? (modelId.includes('seedance-2.0') ? 'v2' : 'v1');
  const input: Record<string, unknown> = { prompt: body.prompt.trim() };

  if (body.resolution) input.resolution = body.resolution;
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.duration !== undefined) {
    input.duration = typeof body.duration === 'number' ? String(body.duration) : body.duration;
  }
  if (body.seed !== undefined) input.seed = body.seed;

  if (family === 'v2') {
    if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;
  } else {
    if (body.camera_fixed !== undefined) input.camera_fixed = body.camera_fixed;
    if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;
    if (body.num_frames !== undefined) input.num_frames = body.num_frames;
  }

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

// 2.0 r2v: image_urls (hasta 9), opcional video_urls/audio_urls.
// 1.0 lite r2v: reference_image_urls (1-4) requerido.
export interface SeedanceR2VBody {
  prompt: string;
  image_urls?: string[];
  reference_image_urls?: string[];
  video_urls?: string[];
  audio_urls?: string[];
  duration?: DurationVal;
  resolution?: Resolution;
  aspect_ratio?: AspectRatio;
  generate_audio?: boolean;
  seed?: number;
  camera_fixed?: boolean;
  enable_safety_checker?: boolean;
  num_frames?: number;
  family?: 'v2' | 'v1';
}

export async function seedanceR2VSubmit(
  fal: FalClient,
  modelId: string,
  body: SeedanceR2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const family = body.family ?? (modelId.includes('seedance-2.0') ? 'v2' : 'v1');
  const input: Record<string, unknown> = { prompt: body.prompt.trim() };

  if (family === 'v2') {
    const imgs = body.image_urls ?? body.reference_image_urls ?? [];
    if (!Array.isArray(imgs) || imgs.length === 0) {
      throw new NucleoError(400, 'image_urls requerido (1-9 imágenes)');
    }
    if (imgs.length > 9) throw new NucleoError(400, 'máximo 9 imágenes');
    input.image_urls = imgs;
    if (body.video_urls && body.video_urls.length > 0) input.video_urls = body.video_urls;
    if (body.audio_urls && body.audio_urls.length > 0) input.audio_urls = body.audio_urls;
    if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;
  } else {
    const imgs = body.reference_image_urls ?? body.image_urls ?? [];
    if (!Array.isArray(imgs) || imgs.length === 0) {
      throw new NucleoError(400, 'reference_image_urls requerido (1-4 imágenes)');
    }
    if (imgs.length > 4) throw new NucleoError(400, 'máximo 4 imágenes para Lite');
    input.reference_image_urls = imgs;
    if (body.camera_fixed !== undefined) input.camera_fixed = body.camera_fixed;
    if (body.enable_safety_checker !== undefined) input.enable_safety_checker = body.enable_safety_checker;
    if (body.num_frames !== undefined) input.num_frames = body.num_frames;
  }

  if (body.resolution) input.resolution = body.resolution;
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.duration !== undefined) {
    input.duration = typeof body.duration === 'number' ? String(body.duration) : body.duration;
  }
  if (body.seed !== undefined) input.seed = body.seed;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function seedanceStatus(
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
