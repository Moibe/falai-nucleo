import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

// Kling create-voice — endpoint utilitario (no genera video).
// Sube un audio/video de 5-30s con una sola voz limpia y devuelve un voice_id
// reusable en elements[].voice_id de generaciones v2.6/v3.

export const KLING_VOICE_FORMATS = ['mp3', 'wav', 'm4a', 'mp4', 'mov'] as const;
export type KlingVoiceFormat = (typeof KLING_VOICE_FORMATS)[number];

export const KLING_VOICE_MIN_SECONDS = 5;
export const KLING_VOICE_MAX_SECONDS = 30;

function extractExtension(url: string): string | null {
  // Strip query/fragment antes de leer la extensión.
  const clean = url.split('?')[0].split('#')[0];
  const lastDot = clean.lastIndexOf('.');
  const lastSlash = clean.lastIndexOf('/');
  if (lastDot === -1 || lastDot < lastSlash) return null;
  return clean.slice(lastDot + 1).toLowerCase();
}

export interface KlingCreateVoiceBody {
  voice_url: string;
  // Opcional: si el caller ya midió la duración (en el front), validamos rango.
  // Si no se pasa, no validamos — fal rechaza si está fuera de 5-30s.
  duration_seconds?: number;
}

export async function submitKlingCreateVoice(
  fal: FalClient,
  modelId: string,
  body: KlingCreateVoiceBody
): Promise<{ request_id: string }> {
  if (!body.voice_url || typeof body.voice_url !== 'string') {
    throw new NucleoError(400, 'voice_url requerido (string)');
  }

  const ext = extractExtension(body.voice_url);
  if (!ext || !(KLING_VOICE_FORMATS as readonly string[]).includes(ext)) {
    throw new NucleoError(
      400,
      `formato inválido: extensión "${ext ?? '?'}" no soportada. Aceptados: ${KLING_VOICE_FORMATS.join(', ')}`
    );
  }

  if (body.duration_seconds !== undefined) {
    if (
      typeof body.duration_seconds !== 'number' ||
      !Number.isFinite(body.duration_seconds) ||
      body.duration_seconds < KLING_VOICE_MIN_SECONDS ||
      body.duration_seconds > KLING_VOICE_MAX_SECONDS
    ) {
      throw new NucleoError(
        400,
        `duration_seconds fuera de rango (${KLING_VOICE_MIN_SECONDS}-${KLING_VOICE_MAX_SECONDS}s)`
      );
    }
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
