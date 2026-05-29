// Catálogo curado de endpoints fal.ai conocidos por proveedor.
// La comparativa de precios fetchea pricing en vivo para cada uno.
// Si fal cambia o agrega endpoints, actualizar aquí.

export type KnownEndpoint = {
  id: string;
  provider: 'Kling' | 'Seedance' | 'Wan' | 'PixVerse' | 'Happy Horse' | 'Veo' | 'Hailuo' | 'LTX' | 'Omnihuman' | 'Flux' | 'Nano Banana';
  model: string;
  variant: string;
  task: 'I2V' | 'T2V' | 'R2V' | 'Edit' | 'Extend' | 'Transition' | 'Effects' | 'Swap' | 'Lipsync' | 'FLF' | 'Audio2V' | 'Retake' | 'T2I' | 'VoiceCreate';
  notes?: string;
};

export const KNOWN_ENDPOINTS: KnownEndpoint[] = [
  // ==================== KLING ====================
  // v3 (la generación cinemática más nueva)
  { id: 'fal-ai/kling-video/v3/4k/image-to-video', provider: 'Kling', model: 'v3', variant: '4K', task: 'I2V' },
  { id: 'fal-ai/kling-video/v3/pro/image-to-video', provider: 'Kling', model: 'v3', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/kling-video/v3/standard/image-to-video', provider: 'Kling', model: 'v3', variant: 'Standard', task: 'I2V' },
  { id: 'fal-ai/kling-video/v3/4k/text-to-video', provider: 'Kling', model: 'v3', variant: '4K', task: 'T2V' },
  { id: 'fal-ai/kling-video/v3/pro/text-to-video', provider: 'Kling', model: 'v3', variant: 'Pro', task: 'T2V' },
  { id: 'fal-ai/kling-video/v3/standard/text-to-video', provider: 'Kling', model: 'v3', variant: 'Standard', task: 'T2V' },

  // o3 (Omni — multi-referencia + character consistency)
  { id: 'fal-ai/kling-video/o3/4k/image-to-video', provider: 'Kling', model: 'o3', variant: '4K', task: 'I2V' },
  { id: 'fal-ai/kling-video/o3/pro/image-to-video', provider: 'Kling', model: 'o3', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/kling-video/o3/standard/image-to-video', provider: 'Kling', model: 'o3', variant: 'Standard', task: 'I2V' },
  { id: 'fal-ai/kling-video/o3/4k/text-to-video', provider: 'Kling', model: 'o3', variant: '4K', task: 'T2V' },
  { id: 'fal-ai/kling-video/o3/pro/text-to-video', provider: 'Kling', model: 'o3', variant: 'Pro', task: 'T2V' },
  { id: 'fal-ai/kling-video/o3/standard/text-to-video', provider: 'Kling', model: 'o3', variant: 'Standard', task: 'T2V' },
  { id: 'fal-ai/kling-video/o3/4k/reference-to-video', provider: 'Kling', model: 'o3', variant: '4K', task: 'R2V' },
  { id: 'fal-ai/kling-video/o3/pro/reference-to-video', provider: 'Kling', model: 'o3', variant: 'Pro', task: 'R2V' },
  { id: 'fal-ai/kling-video/o3/standard/reference-to-video', provider: 'Kling', model: 'o3', variant: 'Standard', task: 'R2V' },
  { id: 'fal-ai/kling-video/o3/pro/video-to-video/edit', provider: 'Kling', model: 'o3', variant: 'Pro', task: 'Edit' },

  // v2.6 (cinemática previa a v3 — soporta multi_prompt + elements + voice_ids)
  { id: 'fal-ai/kling-video/v2.6/pro/image-to-video', provider: 'Kling', model: 'v2.6', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/kling-video/v2.6/pro/text-to-video', provider: 'Kling', model: 'v2.6', variant: 'Pro', task: 'T2V' },

  // v2.5-turbo (Pro: + tail_image + t2v / Standard: i2v simple)
  { id: 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video', provider: 'Kling', model: 'v2.5-turbo', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video', provider: 'Kling', model: 'v2.5-turbo', variant: 'Pro', task: 'T2V' },
  { id: 'fal-ai/kling-video/v2.5-turbo/standard/image-to-video', provider: 'Kling', model: 'v2.5-turbo', variant: 'Standard', task: 'I2V' },

  // v2.1 (Master: i2v + t2v / Pro: i2v + tail / Standard: i2v simple)
  { id: 'fal-ai/kling-video/v2.1/master/text-to-video', provider: 'Kling', model: 'v2.1', variant: 'Master', task: 'T2V' },
  { id: 'fal-ai/kling-video/v2.1/master/image-to-video', provider: 'Kling', model: 'v2.1', variant: 'Master', task: 'I2V' },
  { id: 'fal-ai/kling-video/v2.1/pro/image-to-video', provider: 'Kling', model: 'v2.1', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/kling-video/v2.1/standard/image-to-video', provider: 'Kling', model: 'v2.1', variant: 'Standard', task: 'I2V' },

  // v1.x (legacy)
  { id: 'fal-ai/kling-video/v1.6/pro/image-to-video', provider: 'Kling', model: 'v1.6', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/kling-video/v1/standard/image-to-video', provider: 'Kling', model: 'v1', variant: 'Standard', task: 'I2V' },

  // Utilidad: registra una voz custom desde audio (5-30s, una sola voz limpia).
  // Devuelve voice_id reusable en elements[].voice_id de v2.6/v3.
  { id: 'fal-ai/kling-video/create-voice', provider: 'Kling', model: '-', variant: '-', task: 'VoiceCreate', notes: 'Audio 5-30s; devuelve voice_id para v2.6/v3' },

  // ==================== SEEDANCE (Bytedance) ====================
  // 2.0 (última gen — duration auto, generate_audio, formatos extra)
  { id: 'bytedance/seedance-2.0/image-to-video', provider: 'Seedance', model: '2.0', variant: '-', task: 'I2V' },
  { id: 'bytedance/seedance-2.0/text-to-video', provider: 'Seedance', model: '2.0', variant: '-', task: 'T2V' },
  { id: 'bytedance/seedance-2.0/reference-to-video', provider: 'Seedance', model: '2.0', variant: '-', task: 'R2V' },
  // 2.0 Fast (resoluciones 480p/720p)
  { id: 'fal-ai/bytedance/seedance-2.0/fast/image-to-video', provider: 'Seedance', model: '2.0', variant: 'Fast', task: 'I2V' },
  { id: 'fal-ai/bytedance/seedance-2.0/fast/text-to-video', provider: 'Seedance', model: '2.0', variant: 'Fast', task: 'T2V' },
  { id: 'fal-ai/bytedance/seedance-2.0/fast/reference-to-video', provider: 'Seedance', model: '2.0', variant: 'Fast', task: 'R2V' },
  // 1.5 Pro
  { id: 'fal-ai/bytedance/seedance/v1.5/pro/image-to-video', provider: 'Seedance', model: '1.5', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/bytedance/seedance/v1.5/pro/text-to-video', provider: 'Seedance', model: '1.5', variant: 'Pro', task: 'T2V' },
  // 1.0 Pro
  { id: 'fal-ai/bytedance/seedance/v1/pro/image-to-video', provider: 'Seedance', model: '1.0', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/bytedance/seedance/v1/pro/text-to-video', provider: 'Seedance', model: '1.0', variant: 'Pro', task: 'T2V' },
  // 1.0 Pro Fast
  { id: 'fal-ai/bytedance/seedance/v1/pro/fast/image-to-video', provider: 'Seedance', model: '1.0', variant: 'Pro Fast', task: 'I2V' },
  { id: 'fal-ai/bytedance/seedance/v1/pro/fast/text-to-video', provider: 'Seedance', model: '1.0', variant: 'Pro Fast', task: 'T2V' },
  // 1.0 Lite (incluye r2v con reference_image_urls 1-4)
  { id: 'fal-ai/bytedance/seedance/v1/lite/image-to-video', provider: 'Seedance', model: '1.0', variant: 'Lite', task: 'I2V' },
  { id: 'fal-ai/bytedance/seedance/v1/lite/text-to-video', provider: 'Seedance', model: '1.0', variant: 'Lite', task: 'T2V' },
  { id: 'fal-ai/bytedance/seedance/v1/lite/reference-to-video', provider: 'Seedance', model: '1.0', variant: 'Lite', task: 'R2V' },

  // ==================== WAN (Alibaba) ====================
  // v2.7 (latest)
  { id: 'fal-ai/wan/v2.7/text-to-video', provider: 'Wan', model: 'v2.7', variant: '-', task: 'T2V' },
  { id: 'fal-ai/wan/v2.7/image-to-video', provider: 'Wan', model: 'v2.7', variant: '-', task: 'I2V' },
  { id: 'fal-ai/wan/v2.7/reference-to-video', provider: 'Wan', model: 'v2.7', variant: '-', task: 'R2V' },

  // v2.5-preview
  { id: 'fal-ai/wan-25-preview/text-to-video', provider: 'Wan', model: 'v2.5', variant: 'preview', task: 'T2V' },
  { id: 'fal-ai/wan-25-preview/image-to-video', provider: 'Wan', model: 'v2.5', variant: 'preview', task: 'I2V' },

  // v2.6 (note: no fal-ai/ prefix)
  { id: 'fal-ai/wan/v2.6/text-to-video', provider: 'Wan', model: 'v2.6', variant: '-', task: 'T2V' },
  { id: 'fal-ai/wan/v2.6/image-to-video', provider: 'Wan', model: 'v2.6', variant: '-', task: 'I2V' },
  { id: 'fal-ai/wan/v2.6/image-to-video/flash', provider: 'Wan', model: 'v2.6', variant: 'flash', task: 'I2V' },

  // v2.2-a14b (standard 14B)
  { id: 'fal-ai/wan/v2.2-a14b/text-to-video', provider: 'Wan', model: 'v2.2', variant: 'a14b', task: 'T2V' },
  { id: 'fal-ai/wan/v2.2-a14b/text-to-video/turbo', provider: 'Wan', model: 'v2.2', variant: 'a14b turbo', task: 'T2V' },
  { id: 'fal-ai/wan/v2.2-a14b/image-to-video', provider: 'Wan', model: 'v2.2', variant: 'a14b', task: 'I2V' },
  { id: 'fal-ai/wan/v2.2-a14b/image-to-video/turbo', provider: 'Wan', model: 'v2.2', variant: 'a14b turbo', task: 'I2V' },

  // v2.2-5B (lightweight)
  { id: 'fal-ai/wan/v2.2-5b/text-to-video', provider: 'Wan', model: 'v2.2', variant: '5B', task: 'T2V' },
  { id: 'fal-ai/wan/v2.2-5b/text-to-video/fast-wan', provider: 'Wan', model: 'v2.2', variant: '5B fast', task: 'T2V' },
  { id: 'fal-ai/wan/v2.2-5b/image-to-video', provider: 'Wan', model: 'v2.2', variant: '5B', task: 'I2V' },

  // Pro (premium)
  { id: 'fal-ai/wan-pro/text-to-video', provider: 'Wan', model: 'Pro', variant: '-', task: 'T2V' },
  { id: 'fal-ai/wan-pro/image-to-video', provider: 'Wan', model: 'Pro', variant: '-', task: 'I2V' },

  // v2.1
  { id: 'fal-ai/wan-t2v', provider: 'Wan', model: 'v2.1', variant: '-', task: 'T2V' },
  { id: 'fal-ai/wan-i2v', provider: 'Wan', model: 'v2.1', variant: '-', task: 'I2V' },
  { id: 'fal-ai/wan/v2.1/1.3b/text-to-video', provider: 'Wan', model: 'v2.1', variant: '1.3B', task: 'T2V' },

  // Alpha (transparent backgrounds)
  { id: 'fal-ai/wan-alpha', provider: 'Wan', model: 'Alpha', variant: '-', task: 'T2V', notes: 'Salida con canal alpha (transparente)' },

  // ==================== PIXVERSE ====================
  // legacy (existente antes de la integración completa)
  { id: 'fal-ai/pixverse/v3.5/image-to-video', provider: 'PixVerse', model: 'v3.5', variant: '-', task: 'I2V' },
  { id: 'fal-ai/pixverse/extend', provider: 'PixVerse', model: '-', variant: '-', task: 'Extend', notes: 'Extender video existente (legacy)' },

  // v6 — última generación, schema más rich (audio + multi-clip + thinking_type)
  { id: 'fal-ai/pixverse/v6/image-to-video', provider: 'PixVerse', model: 'v6', variant: '-', task: 'I2V' },
  { id: 'fal-ai/pixverse/v6/text-to-video', provider: 'PixVerse', model: 'v6', variant: '-', task: 'T2V' },
  { id: 'fal-ai/pixverse/v6/transition', provider: 'PixVerse', model: 'v6', variant: '-', task: 'Transition' },
  { id: 'fal-ai/pixverse/v6/extend', provider: 'PixVerse', model: 'v6', variant: '-', task: 'Extend' },

  // c1 — character-consistency, único con reference-to-video
  { id: 'fal-ai/pixverse/c1/image-to-video', provider: 'PixVerse', model: 'c1', variant: '-', task: 'I2V' },
  { id: 'fal-ai/pixverse/c1/text-to-video', provider: 'PixVerse', model: 'c1', variant: '-', task: 'T2V' },
  { id: 'fal-ai/pixverse/c1/transition', provider: 'PixVerse', model: 'c1', variant: '-', task: 'Transition' },
  { id: 'fal-ai/pixverse/c1/reference-to-video', provider: 'PixVerse', model: 'c1', variant: '-', task: 'R2V', notes: 'Multi-referencia con @ref_name' },

  // v5.6
  { id: 'fal-ai/pixverse/v5.6/image-to-video', provider: 'PixVerse', model: 'v5.6', variant: '-', task: 'I2V' },
  { id: 'fal-ai/pixverse/v5.6/text-to-video', provider: 'PixVerse', model: 'v5.6', variant: '-', task: 'T2V' },
  { id: 'fal-ai/pixverse/v5.6/transition', provider: 'PixVerse', model: 'v5.6', variant: '-', task: 'Transition' },

  // v5.5 — primera versión con effects
  { id: 'fal-ai/pixverse/v5.5/image-to-video', provider: 'PixVerse', model: 'v5.5', variant: '-', task: 'I2V' },
  { id: 'fal-ai/pixverse/v5.5/text-to-video', provider: 'PixVerse', model: 'v5.5', variant: '-', task: 'T2V' },
  { id: 'fal-ai/pixverse/v5.5/effects', provider: 'PixVerse', model: 'v5.5', variant: '-', task: 'Effects' },
  { id: 'fal-ai/pixverse/v5.5/transition', provider: 'PixVerse', model: 'v5.5', variant: '-', task: 'Transition' },

  // v5
  { id: 'fal-ai/pixverse/v5/image-to-video', provider: 'PixVerse', model: 'v5', variant: '-', task: 'I2V' },
  { id: 'fal-ai/pixverse/v5/text-to-video', provider: 'PixVerse', model: 'v5', variant: '-', task: 'T2V' },
  { id: 'fal-ai/pixverse/v5/effects', provider: 'PixVerse', model: 'v5', variant: '-', task: 'Effects' },
  { id: 'fal-ai/pixverse/v5/transition', provider: 'PixVerse', model: 'v5', variant: '-', task: 'Transition' },

  // v4.5 — sin t2v, sin aspect_ratio
  { id: 'fal-ai/pixverse/v4.5/image-to-video', provider: 'PixVerse', model: 'v4.5', variant: '-', task: 'I2V' },
  { id: 'fal-ai/pixverse/v4.5/effects', provider: 'PixVerse', model: 'v4.5', variant: '-', task: 'Effects' },
  { id: 'fal-ai/pixverse/v4.5/transition', provider: 'PixVerse', model: 'v4.5', variant: '-', task: 'Transition' },

  // Especializados (sin versionado)
  { id: 'fal-ai/pixverse/swap', provider: 'PixVerse', model: '-', variant: '-', task: 'Swap', notes: 'Swap face/object/background en video' },
  { id: 'fal-ai/pixverse/lipsync', provider: 'PixVerse', model: '-', variant: '-', task: 'Lipsync', notes: 'Lipsync por audio o TTS' },

  // ==================== HAPPY HORSE (Alibaba) ====================
  // Mismo conjunto de tasks que Kling o3 (i2v, t2v, r2v, edit) pero sin tiers (un solo nivel).
  // Schema único: usa "resolution" (720p/1080p) en lugar de tiers. Soporta seed determinístico.
  { id: 'alibaba/happy-horse/image-to-video', provider: 'Happy Horse', model: '1.0', variant: '-', task: 'I2V' },
  { id: 'alibaba/happy-horse/text-to-video', provider: 'Happy Horse', model: '1.0', variant: '-', task: 'T2V' },
  { id: 'alibaba/happy-horse/reference-to-video', provider: 'Happy Horse', model: '1.0', variant: '-', task: 'R2V' },
  { id: 'alibaba/happy-horse/video-edit', provider: 'Happy Horse', model: '1.0', variant: '-', task: 'Edit' },

  // ==================== VEO (Google DeepMind) ====================
  // v3.1 — frontier; 3 tiers (Standard/Fast/Lite), audio nativo, t2v/i2v/r2v/FLF.
  { id: 'fal-ai/veo3.1', provider: 'Veo', model: 'v3.1', variant: 'Standard', task: 'T2V' },
  { id: 'fal-ai/veo3.1/image-to-video', provider: 'Veo', model: 'v3.1', variant: 'Standard', task: 'I2V' },
  { id: 'fal-ai/veo3.1/reference-to-video', provider: 'Veo', model: 'v3.1', variant: 'Standard', task: 'R2V', notes: 'duration fija 8s; sin negative_prompt' },
  { id: 'fal-ai/veo3.1/first-last-frame-to-video', provider: 'Veo', model: 'v3.1', variant: 'Standard', task: 'FLF' },
  { id: 'fal-ai/veo3.1/fast', provider: 'Veo', model: 'v3.1', variant: 'Fast', task: 'T2V' },
  { id: 'fal-ai/veo3.1/fast/image-to-video', provider: 'Veo', model: 'v3.1', variant: 'Fast', task: 'I2V' },
  { id: 'fal-ai/veo3.1/lite', provider: 'Veo', model: 'v3.1', variant: 'Lite', task: 'T2V' },
  { id: 'fal-ai/veo3.1/lite/image-to-video', provider: 'Veo', model: 'v3.1', variant: 'Lite', task: 'I2V' },
  { id: 'fal-ai/veo3.1/lite/first-last-frame-to-video', provider: 'Veo', model: 'v3.1', variant: 'Lite', task: 'FLF', notes: 'duration fija 8s' },

  // ==================== HAILUO (MiniMax) ====================
  // Hailuo-02 — Standard (768P) y Pro (1080P), ambos i2v + t2v.
  { id: 'fal-ai/minimax/hailuo-02/standard/image-to-video', provider: 'Hailuo', model: '02', variant: 'Standard', task: 'I2V' },
  { id: 'fal-ai/minimax/hailuo-02/standard/text-to-video', provider: 'Hailuo', model: '02', variant: 'Standard', task: 'T2V' },
  { id: 'fal-ai/minimax/hailuo-02/pro/image-to-video', provider: 'Hailuo', model: '02', variant: 'Pro', task: 'I2V' },
  { id: 'fal-ai/minimax/hailuo-02/pro/text-to-video', provider: 'Hailuo', model: '02', variant: 'Pro', task: 'T2V' },

  // ==================== LTX (Lightricks, open source) ====================
  // v2.3 — único con audio-to-video, retake y extend. Standard + Fast tiers.
  { id: 'fal-ai/ltx-2.3/text-to-video', provider: 'LTX', model: 'v2.3', variant: 'Standard', task: 'T2V' },
  { id: 'fal-ai/ltx-2.3/image-to-video', provider: 'LTX', model: 'v2.3', variant: 'Standard', task: 'I2V' },
  { id: 'fal-ai/ltx-2.3/audio-to-video', provider: 'LTX', model: 'v2.3', variant: 'Standard', task: 'Audio2V', notes: 'Audio + imagen guía opcional' },
  { id: 'fal-ai/ltx-2.3/extend-video', provider: 'LTX', model: 'v2.3', variant: 'Standard', task: 'Extend' },
  { id: 'fal-ai/ltx-2.3/retake-video', provider: 'LTX', model: 'v2.3', variant: 'Standard', task: 'Retake', notes: 'Regenera segmento de video con prompt' },
  { id: 'fal-ai/ltx-2.3/text-to-video/fast', provider: 'LTX', model: 'v2.3', variant: 'Fast', task: 'T2V' },
  { id: 'fal-ai/ltx-2.3/image-to-video/fast', provider: 'LTX', model: 'v2.3', variant: 'Fast', task: 'I2V' },

  // ==================== OMNIHUMAN (ByteDance) ====================
  // Audio-driven character animation (lipsync + cuerpo completo). Endpoint único.
  { id: 'fal-ai/bytedance/omnihuman/v1.5', provider: 'Omnihuman', model: 'v1.5', variant: '-', task: 'Lipsync', notes: 'Anima personaje desde imagen + audio' },

  // ==================== FLUX (Black Forest Labs) ====================
  // Primer proveedor de imagen (T2I) en el catálogo. Endpoint único.
  { id: 'fal-ai/flux-2-pro', provider: 'Flux', model: '2', variant: 'Pro', task: 'T2I' },
  // PuLID adapter sobre Flux.1-dev — preservación de identidad facial.
  { id: 'fal-ai/flux-pulid', provider: 'Flux', model: 'PuLID', variant: '-', task: 'T2I', notes: 'Reference image → escenas variando manteniendo cara' },

  // ==================== NANO BANANA (Google Gemini 2.5 Flash Image) ====================
  // Image gen + edit instruction-based. El /edit es ideal para "remove X" / "add Y"
  // sin máscaras — supera a Kontext en edits quirúrgicos.
  { id: 'fal-ai/nano-banana', provider: 'Nano Banana', model: 'Gemini 2.5 Flash Image', variant: '-', task: 'T2I' },
  { id: 'fal-ai/nano-banana/edit', provider: 'Nano Banana', model: 'Gemini 2.5 Flash Image', variant: '-', task: 'Edit', notes: 'Edit instruction-based con image_urls; multi-referencia soportada' },
  // V2 — state-of-the-art, añade resolution (hasta 4K), system_prompt, web_search,
  // thinking_level y aspect ratios ultra (4:1, 1:4, 8:1, 1:8).
  { id: 'fal-ai/nano-banana-2', provider: 'Nano Banana', model: '2', variant: '-', task: 'T2I' },
  { id: 'fal-ai/nano-banana-2/edit', provider: 'Nano Banana', model: '2', variant: '-', task: 'Edit', notes: 'Edit con image_urls; soporta resolution hasta 4K' }
];
