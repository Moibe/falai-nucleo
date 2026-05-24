import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

// Kling create-voice — endpoint utilitario (no genera video).
// Sube un audio/video de 5-30s con una sola voz limpia y devuelve un voice_id
// reusable en elements[].voice_id de generaciones v2.6/v3.
// Formatos aceptados: .mp3, .wav, .m4a, .mp4, .mov

export interface KlingCreateVoiceBody {
  voice_url: string;
}

export async function submitKlingCreateVoice(
  fal: FalClient,
  modelId: string,
  body: KlingCreateVoiceBody
): Promise<{ request_id: string }> {
  if (!body.voice_url || typeof body.voice_url !== 'string') {
    throw new NucleoError(400, 'voice_url requerido (string)');
  }

  const submission = await fal.queue.submit(modelId, {
    input: { voice_url: body.voice_url }
  });
  return { request_id: submission.request_id };
}

export async function statusKlingCreateVoice(
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

export async function resultKlingCreateVoice(
  fal: FalClient,
  modelId: string,
  requestId: string
): Promise<{ voice_id: string; result: unknown }> {
  const result = await fal.queue.result(modelId, { requestId });
  const data = result.data as { voice_id?: string } | undefined;
  if (!data || typeof data.voice_id !== 'string') {
    throw new NucleoError(500, 'respuesta sin voice_id');
  }
  return { voice_id: data.voice_id, result: data };
}
