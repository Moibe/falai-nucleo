import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type AspectRatio = '16:9' | '9:16' | '1:1';

export interface KlingV21I2VBody {
  prompt: string;
  image_url: string;
  tail_image_url?: string;
  duration?: number;
  negative_prompt?: string;
  cfg_scale?: number;
}

export async function klingV21I2VSubmit(
  fal: FalClient,
  modelId: string,
  supportsTail: boolean,
  body: KlingV21I2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');

  const input: Record<string, unknown> = {
    prompt: body.prompt.trim(),
    image_url: body.image_url
  };
  if (supportsTail && body.tail_image_url) input.tail_image_url = body.tail_image_url;
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.negative_prompt) input.negative_prompt = body.negative_prompt;
  if (body.cfg_scale !== undefined) input.cfg_scale = body.cfg_scale;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface KlingV21T2VBody {
  prompt: string;
  duration?: number;
  aspect_ratio?: AspectRatio;
  negative_prompt?: string;
  cfg_scale?: number;
}

export async function klingV21T2VSubmit(
  fal: FalClient,
  modelId: string,
  body: KlingV21T2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const input: Record<string, unknown> = { prompt: body.prompt.trim() };
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.negative_prompt) input.negative_prompt = body.negative_prompt;
  if (body.cfg_scale !== undefined) input.cfg_scale = body.cfg_scale;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function klingV21Status(
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
