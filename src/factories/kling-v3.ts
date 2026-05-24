import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type Shot = { prompt: string; duration: number };
type Element = {
  frontal_image_url: string;
  reference_image_urls?: string[];
  voice_id?: string;
};

export interface KlingV3I2VBody {
  image_url: string;
  end_image_url?: string;
  prompt?: string;
  multi_prompt?: Shot[];
  duration?: number;
  generate_audio?: boolean;
  cfg_scale?: number;
  negative_prompt?: string;
  elements?: Element[];
  shot_type?: string;
}

export interface KlingV3T2VBody {
  prompt?: string;
  multi_prompt?: Shot[];
  duration?: number;
  generate_audio?: boolean;
  cfg_scale?: number;
  negative_prompt?: string;
  shot_type?: string;
  aspect_ratio?: '16:9' | '9:16' | '1:1';
}

function buildSharedInput(body: KlingV3I2VBody | KlingV3T2VBody): Record<string, unknown> {
  const hasMulti = Array.isArray(body.multi_prompt) && body.multi_prompt.length > 0;
  const hasPrompt = typeof body.prompt === 'string' && body.prompt.trim().length > 0;

  if (!hasMulti && !hasPrompt) {
    throw new NucleoError(400, 'prompt o multi_prompt requerido');
  }
  if (hasMulti && hasPrompt) {
    throw new NucleoError(400, 'usa prompt o multi_prompt, no ambos');
  }

  const input: Record<string, unknown> = {};
  if (hasMulti) {
    input.multi_prompt = body.multi_prompt;
    input.shot_type = body.shot_type ?? 'customize';
  } else {
    input.prompt = body.prompt;
  }
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;
  if (body.cfg_scale !== undefined) input.cfg_scale = body.cfg_scale;
  if (body.negative_prompt) input.negative_prompt = body.negative_prompt;
  return input;
}

export async function klingV3I2VSubmit(
  fal: FalClient,
  modelId: string,
  body: KlingV3I2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url || typeof body.image_url !== 'string') {
    throw new NucleoError(400, 'image_url requerido (string)');
  }

  const input = buildSharedInput(body);
  input.start_image_url = body.image_url;
  if (body.end_image_url) input.end_image_url = body.end_image_url;
  if (Array.isArray(body.elements) && body.elements.length > 0) {
    input.elements = body.elements;
  }

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function klingV3T2VSubmit(
  fal: FalClient,
  modelId: string,
  body: KlingV3T2VBody
): Promise<{ request_id: string }> {
  const input = buildSharedInput(body);
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function klingV3Status(
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
