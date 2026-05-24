import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type Resolution = '720p' | '1080p' | '4k';
type Duration = '4s' | '6s' | '8s';
type AspectRatio = '16:9' | '9:16' | 'auto';

interface BaseBody {
  prompt: string;
  aspect_ratio?: AspectRatio;
  duration?: Duration;
  resolution?: Resolution;
  generate_audio?: boolean;
  negative_prompt?: string;
  seed?: number;
  auto_fix?: boolean;
  safety_tolerance?: string;
}

function buildBase(body: BaseBody): Record<string, unknown> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');
  const input: Record<string, unknown> = { prompt: body.prompt.trim() };
  if (body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.duration) input.duration = body.duration;
  if (body.resolution) input.resolution = body.resolution;
  if (body.generate_audio !== undefined) input.generate_audio = body.generate_audio;
  if (body.negative_prompt && body.negative_prompt.trim()) {
    input.negative_prompt = body.negative_prompt.trim();
  }
  if (body.seed !== undefined && body.seed !== null) input.seed = body.seed;
  if (body.auto_fix !== undefined) input.auto_fix = body.auto_fix;
  if (body.safety_tolerance) input.safety_tolerance = body.safety_tolerance;
  return input;
}

export interface Veo31T2VBody extends BaseBody {}

export async function veo31T2VSubmit(
  fal: FalClient,
  modelId: string,
  body: Veo31T2VBody
): Promise<{ request_id: string }> {
  const input = buildBase(body);
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface Veo31I2VBody extends BaseBody {
  image_url: string;
}

export async function veo31I2VSubmit(
  fal: FalClient,
  modelId: string,
  body: Veo31I2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');
  const input = buildBase(body);
  input.image_url = body.image_url;
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

// R2V: duration fija 8s y NO acepta negative_prompt (rechazado por fal).
export interface Veo31R2VBody extends BaseBody {
  image_urls?: string[];
  reference_image_urls?: string[];
}

export async function veo31R2VSubmit(
  fal: FalClient,
  modelId: string,
  body: Veo31R2VBody
): Promise<{ request_id: string }> {
  const imgs = body.image_urls ?? body.reference_image_urls ?? [];
  if (!Array.isArray(imgs) || imgs.length === 0) {
    throw new NucleoError(400, 'image_urls requerido (al menos 1 imagen de referencia)');
  }
  if (body.duration !== undefined && body.duration !== '8s') {
    throw new NucleoError(400, 'R2V tiene duration fija de 8s');
  }
  if (body.negative_prompt && body.negative_prompt.trim()) {
    throw new NucleoError(400, 'R2V no acepta negative_prompt');
  }
  const input = buildBase(body);
  input.image_urls = imgs;
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface Veo31FLFBody extends BaseBody {
  first_frame_url: string;
  last_frame_url: string;
}

export async function veo31FLFSubmit(
  fal: FalClient,
  modelId: string,
  body: Veo31FLFBody
): Promise<{ request_id: string }> {
  if (!body.first_frame_url) throw new NucleoError(400, 'first_frame_url requerido');
  if (!body.last_frame_url) throw new NucleoError(400, 'last_frame_url requerido');
  // Lite FLF tiene duration fija 8s; el endpoint standard FLF acepta el rango normal.
  if (modelId.includes('/lite/') && body.duration !== undefined && body.duration !== '8s') {
    throw new NucleoError(400, 'Lite FLF tiene duration fija de 8s');
  }
  const input = buildBase(body);
  input.first_frame_url = body.first_frame_url;
  input.last_frame_url = body.last_frame_url;
  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function veo31Status(
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
