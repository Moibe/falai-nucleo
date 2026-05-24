import { ApiError, createFalClient } from '@fal-ai/client';
import { NucleoError } from '../errors.js';

/**
 * Sube un Blob/File a fal storage y devuelve su URL pública.
 *
 * Crea un FalClient efímero por llamada usando la API key provista. Pensado
 * para servidores que ya tienen acceso a `FAL_KEY` en su env — NO usar desde
 * el browser (la key se expondría). Caller responsable de mantener `apiKey`
 * fuera del cliente público.
 *
 * Retorna una URL del CDN de fal (p.ej. `https://fal.media/files/...`) que
 * puede pegarse directamente en cualquier campo `image_url`, `video_url`,
 * `reference_image_urls[]`, etc., al submitear un endpoint de modelo.
 *
 * Errores que envuelve: si fal regresa ApiError (cuenta sin saldo, key
 * inválida, payload muy grande, etc.) extraemos el `detail` del body para
 * que el caller vea el motivo real, no un genérico "Forbidden".
 */
export async function uploadFile(apiKey: string, file: Blob): Promise<string> {
  if (!apiKey) throw new NucleoError(401, 'apiKey requerido');
  if (!file) throw new NucleoError(400, 'file requerido');

  const fal = createFalClient({ credentials: apiKey });
  try {
    return await fal.storage.upload(file);
  } catch (e) {
    if (e instanceof ApiError) {
      // fal mete el motivo real en body.detail. Si no, fallback al message.
      const body = e.body as { detail?: unknown } | undefined;
      const detail = body && typeof body.detail === 'string' ? body.detail : undefined;
      const reason = detail ?? e.message ?? 'Upload falló';
      throw new NucleoError(e.status || 502, `fal storage: ${reason}`);
    }
    const msg = e instanceof Error ? e.message : String(e);
    throw new NucleoError(502, `Upload a fal storage falló: ${msg}`);
  }
}
