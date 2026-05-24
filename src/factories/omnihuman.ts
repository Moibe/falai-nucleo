import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

// Bytedance Omnihuman v1.5 — endpoint único (audio-driven character animation).
// El prompt opcional sólo se incluye cuando viene en el body — la doc no lo lista
// como required y enviarlo vacío puede romper el call.

export interface OmnihumanSubmitBody {
  image_url: string;
  audio_url: string;
  prompt?: string;
}

export async function submitOmnihuman(
  fal: FalClient,
  modelId: string,
  body: OmnihumanSubmitBody
): Promise<{ request_id: string }> {
  if (!body.image_url || typeof body.image_url !== 'string') {
    throw new NucleoError(400, 'image_url requerido (string)');
  }
  if (!body.audio_url || typeof body.audio_url !== 'string') {
    throw new NucleoError(400, 'audio_url requerido (string)');
  }

  const input: Record<string, unknown> = {
    image_url: body.image_url,
    audio_url: body.audio_url
  };
  if (body.prompt && body.prompt.trim()) {
    input.prompt = body.prompt.trim();
  }

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function statusOmnihuman(
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

export async function resultOmnihuman(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  return { result: result.data };
}
