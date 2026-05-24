import type { FalClient } from '../types.js';
import { NucleoError } from '../errors.js';

// Schemas convergen casi del todo entre versiones; cada factory normaliza solo
// los campos que el endpoint subyacente acepta. v4.5 no acepta aspect_ratio,
// audio switches ni thinking_type — pasarlos rompería el call. Los factories
// reciben las "capabilities" del endpoint y filtran en consecuencia.

type Resolution = '360p' | '540p' | '720p' | '1080p';
type AspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | '2:3' | '3:2' | '21:9';
type Style = 'anime' | '3d_animation' | 'clay' | 'comic' | 'cyberpunk';
type ThinkingType = 'enabled' | 'disabled' | 'auto';

export type PixVerseCaps = {
  // si false, omitir aspect_ratio (v4.5 no lo soporta)
  aspectRatio: boolean;
  // si false, omitir generate_audio_switch / generate_multi_clip_switch (v4.5 / v5)
  audioSwitch: boolean;
  multiClipSwitch: boolean;
  // si false, omitir thinking_type (v4.5 / v5 / c1)
  thinkingType: boolean;
};

interface CommonBody {
  prompt?: string;
  resolution?: Resolution;
  aspect_ratio?: AspectRatio;
  duration?: number;
  negative_prompt?: string;
  style?: Style;
  seed?: number;
  generate_audio_switch?: boolean;
  generate_multi_clip_switch?: boolean;
  thinking_type?: ThinkingType;
}

function applyCommon(input: Record<string, unknown>, body: CommonBody, caps: PixVerseCaps): void {
  if (body.resolution) input.resolution = body.resolution;
  if (caps.aspectRatio && body.aspect_ratio) input.aspect_ratio = body.aspect_ratio;
  if (body.duration !== undefined) input.duration = body.duration;
  if (body.negative_prompt && body.negative_prompt.trim()) {
    input.negative_prompt = body.negative_prompt.trim();
  }
  if (body.style) input.style = body.style;
  if (body.seed !== undefined) input.seed = body.seed;
  if (caps.audioSwitch && body.generate_audio_switch !== undefined) {
    input.generate_audio_switch = body.generate_audio_switch;
  }
  if (caps.multiClipSwitch && body.generate_multi_clip_switch !== undefined) {
    input.generate_multi_clip_switch = body.generate_multi_clip_switch;
  }
  if (caps.thinkingType && body.thinking_type) input.thinking_type = body.thinking_type;
}

export interface PixVerseI2VBody extends CommonBody {
  image_url: string;
  prompt: string;
}

export async function pixverseI2VSubmit(
  fal: FalClient,
  modelId: string,
  caps: PixVerseCaps,
  body: PixVerseI2VBody
): Promise<{ request_id: string }> {
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const input: Record<string, unknown> = {
    image_url: body.image_url,
    prompt: body.prompt.trim()
  };
  applyCommon(input, body, caps);

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface PixVerseT2VBody extends CommonBody {
  prompt: string;
}

export async function pixverseT2VSubmit(
  fal: FalClient,
  modelId: string,
  caps: PixVerseCaps,
  body: PixVerseT2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const input: Record<string, unknown> = { prompt: body.prompt.trim() };
  applyCommon(input, body, caps);

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface PixVerseTransitionBody extends CommonBody {
  first_image_url: string;
  end_image_url: string;
  prompt: string;
}

export async function pixverseTransitionSubmit(
  fal: FalClient,
  modelId: string,
  caps: PixVerseCaps,
  body: PixVerseTransitionBody
): Promise<{ request_id: string }> {
  if (!body.first_image_url) throw new NucleoError(400, 'first_image_url requerido');
  if (!body.end_image_url) throw new NucleoError(400, 'end_image_url requerido');
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const input: Record<string, unknown> = {
    first_image_url: body.first_image_url,
    end_image_url: body.end_image_url,
    prompt: body.prompt.trim()
  };
  applyCommon(input, body, caps);

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface PixVerseExtendBody extends CommonBody {
  video_url: string;
  prompt: string;
}

export async function pixverseExtendSubmit(
  fal: FalClient,
  modelId: string,
  caps: PixVerseCaps,
  body: PixVerseExtendBody
): Promise<{ request_id: string }> {
  if (!body.video_url) throw new NucleoError(400, 'video_url requerido');
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');

  const input: Record<string, unknown> = {
    video_url: body.video_url,
    prompt: body.prompt.trim()
  };
  // extend NO acepta aspect_ratio
  applyCommon(input, body, { ...caps, aspectRatio: false });

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

interface R2VImageRef {
  image_url: string;
  type?: 'subject' | 'background';
  ref_name: string;
}

export interface PixVerseR2VBody extends CommonBody {
  prompt: string;
  image_references: R2VImageRef[];
}

export async function pixverseR2VSubmit(
  fal: FalClient,
  modelId: string,
  caps: PixVerseCaps,
  body: PixVerseR2VBody
): Promise<{ request_id: string }> {
  if (!body.prompt || !body.prompt.trim()) throw new NucleoError(400, 'prompt requerido');
  if (!Array.isArray(body.image_references) || body.image_references.length === 0) {
    throw new NucleoError(400, 'image_references requerido (al menos 1)');
  }

  const input: Record<string, unknown> = {
    prompt: body.prompt.trim(),
    image_references: body.image_references
  };
  applyCommon(input, body, caps);

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface PixVerseEffectsBody {
  effect: string;
  image_url: string;
  resolution?: Resolution;
  duration?: number;
  negative_prompt?: string;
  thinking_type?: ThinkingType;
}

export async function pixverseEffectsSubmit(
  fal: FalClient,
  modelId: string,
  caps: PixVerseCaps,
  body: PixVerseEffectsBody
): Promise<{ request_id: string }> {
  if (!body.effect) throw new NucleoError(400, 'effect requerido');
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');

  const input: Record<string, unknown> = {
    effect: body.effect,
    image_url: body.image_url
  };
  if (body.resolution) input.resolution = body.resolution;
  if (body.duration !== undefined) input.duration = body.duration;
  if (body.negative_prompt && body.negative_prompt.trim()) {
    input.negative_prompt = body.negative_prompt.trim();
  }
  if (caps.thinkingType && body.thinking_type) input.thinking_type = body.thinking_type;

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface PixVerseSwapBody {
  video_url: string;
  image_url: string;
  mode?: 'person' | 'object' | 'background';
  keyframe_id?: number;
  resolution?: '360p' | '540p' | '720p';
  seed?: number;
  original_sound_switch?: boolean;
}

export async function pixverseSwapSubmit(
  fal: FalClient,
  modelId: string,
  body: PixVerseSwapBody
): Promise<{ request_id: string }> {
  if (!body.video_url) throw new NucleoError(400, 'video_url requerido');
  if (!body.image_url) throw new NucleoError(400, 'image_url requerido');

  const input: Record<string, unknown> = {
    video_url: body.video_url,
    image_url: body.image_url
  };
  if (body.mode) input.mode = body.mode;
  if (body.keyframe_id !== undefined) input.keyframe_id = body.keyframe_id;
  if (body.resolution) input.resolution = body.resolution;
  if (body.seed !== undefined) input.seed = body.seed;
  if (body.original_sound_switch !== undefined) {
    input.original_sound_switch = body.original_sound_switch;
  }

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export interface PixVerseLipsyncBody {
  video_url: string;
  audio_url?: string;
  voice_id?: string;
  text?: string;
}

export async function pixverseLipsyncSubmit(
  fal: FalClient,
  modelId: string,
  body: PixVerseLipsyncBody
): Promise<{ request_id: string }> {
  if (!body.video_url) throw new NucleoError(400, 'video_url requerido');
  if (!body.audio_url && !body.text) {
    throw new NucleoError(400, 'audio_url o text (para TTS) requerido');
  }

  const input: Record<string, unknown> = { video_url: body.video_url };
  if (body.audio_url) input.audio_url = body.audio_url;
  if (body.voice_id) input.voice_id = body.voice_id;
  if (body.text && body.text.trim()) input.text = body.text.trim();

  const submission = await fal.queue.submit(modelId, { input });
  return { request_id: submission.request_id };
}

export async function pixverseStatus(
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

// ---- Capabilities por version ----
export const PIXVERSE_VERSIONS = ['v6', 'c1', 'v5.6', 'v5.5', 'v5', 'v4.5'] as const;
type PixVerseCapsVersion = (typeof PIXVERSE_VERSIONS)[number];

export const PIXVERSE_CAPS: Record<PixVerseCapsVersion, PixVerseCaps> = {
  v6: { aspectRatio: true, audioSwitch: true, multiClipSwitch: true, thinkingType: true },
  c1: { aspectRatio: true, audioSwitch: true, multiClipSwitch: false, thinkingType: false },
  'v5.6': { aspectRatio: true, audioSwitch: true, multiClipSwitch: false, thinkingType: true },
  'v5.5': { aspectRatio: true, audioSwitch: true, multiClipSwitch: true, thinkingType: true },
  v5: { aspectRatio: true, audioSwitch: false, multiClipSwitch: false, thinkingType: false },
  'v4.5': { aspectRatio: false, audioSwitch: false, multiClipSwitch: false, thinkingType: false }
};
