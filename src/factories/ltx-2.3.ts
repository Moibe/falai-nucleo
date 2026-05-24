import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type AspectRatio = '16:9' | '9:16' | '1:1';
type Resolution = '1080p' | '1440p' | '2160p';

interface BaseBody {
  prompt?: string;
  duration?: number;
  resolution?: Resolution;
  aspect_ratio?: AspectRatio;
  seed?: number;
  negative_prompt?: string;
}

function buildBase(body: BaseBody): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  if (typeof body.prompt === 'string' && body.prompt.trim().length > 0) {
    input.prompt = body.prompt.trim();
  }
  if (body.duration !== undefined) input.duration = body.duration;
  if (body.resolution) input.resolution = body.resolution;
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (typeof body.seed === 'number' && body.seed >= 0) input.seed = body.seed;
  if (body.negative_prompt && body.negative_prompt.trim().length > 0) {
    input.negative_prompt = body.negative_prompt.trim();
  }
  return input;
}

export interface LtxT2VBody extends BaseBody {}

export async function ltxT2VSubmit(
  fal: FalClient,
  modelId: string,
  body: LtxT2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) {
    throw new NucleoError(400, 'prompt requerido');
  }
  const input = buildBase(body);
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface LtxI2VBody extends BaseBody {
  image_url?: string;
  end_image_url?: string;
}

export async function ltxI2VSubmit(
  fal: FalClient,
  modelId: string,
  body: LtxI2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url || typeof body.image_url !== 'string') {
    throw new NucleoError(400, 'image_url requerido (string)');
  }
  if (!body.prompt || !body.prompt.trim()) {
    throw new NucleoError(400, 'prompt requerido');
  }
  const input = buildBase(body);
  input.image_url = body.image_url;
  if (body.end_image_url) input.end_image_url = body.end_image_url;
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface LtxAudio2VBody extends BaseBody {
  audio_url?: string;
  image_url?: string;
}

export async function ltxAudio2VSubmit(
  fal: FalClient,
  modelId: string,
  body: LtxAudio2VBody
): Promise<{ request_id: string }> {
  if (!body.audio_url || typeof body.audio_url !== 'string') {
    throw new NucleoError(400, 'audio_url requerido (string)');
  }
  const input = buildBase(body);
  input.audio_url = body.audio_url;
  if (body.image_url) input.image_url = body.image_url;
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface LtxExtendBody extends BaseBody {
  video_url?: string;
  mode?: 'start' | 'end';
}

export async function ltxExtendSubmit(
  fal: FalClient,
  modelId: string,
  body: LtxExtendBody
): Promise<{ request_id: string }> {
  if (!body.video_url || typeof body.video_url !== 'string') {
    throw new NucleoError(400, 'video_url requerido (string)');
  }
  const input = buildBase(body);
  input.video_url = body.video_url;
  if (body.mode) input.mode = body.mode;
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface LtxRetakeBody extends BaseBody {
  video_url?: string;
  start_time?: number;
  retake_mode?: string;
}

export async function ltxRetakeSubmit(
  fal: FalClient,
  modelId: string,
  body: LtxRetakeBody
): Promise<{ request_id: string }> {
  if (!body.video_url || typeof body.video_url !== 'string') {
    throw new NucleoError(400, 'video_url requerido (string)');
  }
  if (!body.prompt || !body.prompt.trim()) {
    throw new NucleoError(400, 'prompt requerido');
  }
  const input = buildBase(body);
  input.video_url = body.video_url;
  if (typeof body.start_time === 'number' && body.start_time >= 0) {
    input.start_time = body.start_time;
  }
  if (body.retake_mode) input.retake_mode = body.retake_mode;
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function ltxStatus(
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

export async function ltxResult(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  return { result: result.data };
}
