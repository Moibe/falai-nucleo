import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export interface WanT2VBody {
  prompt: string;
  aspect_ratio?: AspectRatio;
  resolution?: string;
  duration?: number | string;
  seed?: number;
  negative_prompt?: string;
  enable_safety_checker?: boolean;
  enable_prompt_expansion?: boolean;
}

export interface WanI2VBody extends WanT2VBody {
  image_url: string;
  end_image_url?: string;
}

function buildInput(body: WanT2VBody | WanI2VBody, isI2V: boolean): Record<string, unknown> {
  const input: Record<string, unknown> = { prompt: body.prompt.trim() };
  if (isI2V) {
    const i2v = body as WanI2VBody;
    input.image_url = i2v.image_url;
    if (i2v.end_image_url) input.end_image_url = i2v.end_image_url;
  }
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.resolution) input.resolution = body.resolution;
  if (body.duration !== undefined) input.duration = String(body.duration);
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.negative_prompt && body.negative_prompt.trim()) {
    input.negative_prompt = body.negative_prompt.trim();
  }
  if (body.enable_safety_checker !== undefined) {
    input.enable_safety_checker = body.enable_safety_checker;
  }
  if (body.enable_prompt_expansion !== undefined) {
    input.enable_prompt_expansion = body.enable_prompt_expansion;
  }
  return input;
}

export async function wanT2VSubmit(
  fal: FalClient,
  modelId: string,
  body: WanT2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');
  const input = buildInput(body, false);
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function wanI2VSubmit(
  fal: FalClient,
  modelId: string,
  body: WanI2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');
  const input = buildInput(body, true);
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function wanStatus(
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
