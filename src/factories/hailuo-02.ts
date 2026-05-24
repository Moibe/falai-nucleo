import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

type HailuoResolution = '512P' | '768P' | '1080P';
type HailuoTier = 'standard' | 'pro';

// Whitelists por tier (sincronizadas con catalog/hailuo-options.ts).
const HAILUO_TIER_CAPS: Record<HailuoTier, { durations: number[]; resolutions: HailuoResolution[] }> = {
  standard: { durations: [6], resolutions: ['512P', '768P'] },
  pro: { durations: [6, 10], resolutions: ['768P', '1080P'] }
};

function detectTier(modelId: string): HailuoTier | null {
  if (modelId.includes('/pro/')) return 'pro';
  if (modelId.includes('/standard/')) return 'standard';
  return null;
}

interface SharedBody {
  prompt?: string;
  duration?: number;
  resolution?: HailuoResolution;
  prompt_optimizer?: boolean;
}

function buildSharedInput(modelId: string, body: SharedBody): Record<string, unknown> {
  const hasPrompt = typeof body.prompt === 'string' && body.prompt.trim().length > 0;
  if (!hasPrompt) {
    throw new NucleoError(400, 'prompt requerido');
  }

  const tier = detectTier(modelId);
  if (tier && body.duration !== undefined && !HAILUO_TIER_CAPS[tier].durations.includes(body.duration)) {
    throw new NucleoError(
      400,
      `duration ${body.duration}s no soportada en ${tier} (aceptadas: ${HAILUO_TIER_CAPS[tier].durations.join(', ')}s)`
    );
  }
  if (tier && body.resolution && !HAILUO_TIER_CAPS[tier].resolutions.includes(body.resolution)) {
    throw new NucleoError(
      400,
      `resolution ${body.resolution} no soportada en ${tier} (aceptadas: ${HAILUO_TIER_CAPS[tier].resolutions.join(', ')})`
    );
  }

  const input: Record<string, unknown> = { prompt: body.prompt };
  if (body.duration !== undefined) input.duration = body.duration;
  if (body.resolution) input.resolution = body.resolution;
  if (body.prompt_optimizer !== undefined) input.prompt_optimizer = body.prompt_optimizer;
  return input;
}

export interface Hailuo02I2VBody extends SharedBody {
  image_url: string;
  end_image_url?: string;
}

export async function hailuo02I2VSubmit(
  fal: FalClient,
  modelId: string,
  body: Hailuo02I2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url || typeof body.image_url !== 'string') {
    throw new NucleoError(400, 'image_url requerido (string)');
  }

  const input = buildSharedInput(modelId, body);
  input.image_url = body.image_url;
  if (body.end_image_url) input.end_image_url = body.end_image_url;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface Hailuo02T2VBody extends SharedBody {
  first_frame_image?: string;
}

export async function hailuo02T2VSubmit(
  fal: FalClient,
  modelId: string,
  body: Hailuo02T2VBody
): Promise<{ request_id: string }> {
  const input = buildSharedInput(modelId, body);
  if (body.first_frame_image) input.first_frame_image = body.first_frame_image;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function hailuo02Status(
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
