import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type Shot = { prompt: string; duration: number };
type RichElement = {
  frontal_image_url: string;
  reference_image_urls?: string[];
  voice_id?: string;
};

function buildPromptOrMulti(body: {
  prompt?: string;
  multi_prompt?: Shot[];
  shot_type?: string;
}): Record<string, unknown> {
  const hasMulti = Array.isArray(body.multi_prompt) && body.multi_prompt.length > 0;
  const hasPrompt = typeof body.prompt === 'string' && body.prompt.trim().length > 0;
  if (!hasMulti && !hasPrompt) throw new NucleoError(400, 'prompt o multi_prompt requerido');
  if (hasMulti && hasPrompt) throw new NucleoError(400, 'usa prompt o multi_prompt, no ambos');

  const out: Record<string, unknown> = {};
  if (hasMulti) {
    out.multi_prompt = body.multi_prompt;
    out.shot_type = body.shot_type ?? 'customize';
  } else {
    out.prompt = body.prompt;
  }
  return out;
}

export interface KlingO3I2VBody {
  image_url: string;
  end_image_url?: string;
  prompt?: string;
  multi_prompt?: Shot[];
  duration?: number;
  generate_audio?: boolean;
  cfg_scale?: number;
  negative_prompt?: string;
  elements?: RichElement[];
  shot_type?: string;
}

export async function klingO3I2VSubmit(
  fal: FalClient,
  modelId: string,
  body: KlingO3I2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');

  const input: Record<string, unknown> = {
    image_url: body.image_url,
    ...buildPromptOrMulti(body)
  };
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;
  if (body.cfg_scale !== undefined) input.cfg_scale = body.cfg_scale;
  if (body.negative_prompt) input.negative_prompt = body.negative_prompt;
  if (body.end_image_url) input.end_image_url = body.end_image_url;
  if (body.elements && body.elements.length > 0) input.elements = body.elements;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface KlingO3T2VBody {
  prompt?: string;
  multi_prompt?: Shot[];
  duration?: number;
  generate_audio?: boolean;
  cfg_scale?: number;
  negative_prompt?: string;
  shot_type?: string;
  aspect_ratio?: '16:9' | '9:16' | '1:1';
}

export async function klingO3T2VSubmit(
  fal: FalClient,
  modelId: string,
  body: KlingO3T2VBody
): Promise<{ request_id: string }> {
  const input: Record<string, unknown> = {
    ...buildPromptOrMulti(body),
    aspect_ratio: body.aspect_ratio ?? '16:9'
  };
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;
  if (body.cfg_scale !== undefined) input.cfg_scale = body.cfg_scale;
  if (body.negative_prompt) input.negative_prompt = body.negative_prompt;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface KlingO3R2VBody {
  prompt?: string;
  multi_prompt?: Shot[];
  start_image_url?: string;
  end_image_url?: string;
  image_urls?: string[];
  elements?: RichElement[];
  duration?: number;
  generate_audio?: boolean;
  shot_type?: string;
}

export async function klingO3R2VSubmit(
  fal: FalClient,
  modelId: string,
  body: KlingO3R2VBody
): Promise<{ request_id: string }> {
  const input: Record<string, unknown> = {
    ...buildPromptOrMulti(body)
  };
  if (body.start_image_url) input.start_image_url = body.start_image_url;
  if (body.end_image_url) input.end_image_url = body.end_image_url;
  if (body.image_urls && body.image_urls.length > 0) input.image_urls = body.image_urls;
  if (body.elements && body.elements.length > 0) input.elements = body.elements;
  if (body.duration !== undefined) input.duration = body.duration;
  if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface KlingO3EditBody {
  video_url: string;
  prompt: string;
  image_urls?: string[];
  elements?: RichElement[];
}

export async function klingO3EditSubmit(
  fal: FalClient,
  modelId: string,
  body: KlingO3EditBody
): Promise<{ request_id: string }> {
  if (!body.video_url) throw new NucleoError(400, 'video_url requerido');
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const input: Record<string, unknown> = {
    video_url: body.video_url,
    prompt: body.prompt.trim()
  };
  if (body.image_urls && body.image_urls.length > 0) input.image_urls = body.image_urls;
  if (body.elements && body.elements.length > 0) input.elements = body.elements;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function klingO3Status(
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
