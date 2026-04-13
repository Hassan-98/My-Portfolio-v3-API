/**
 * Telegram Bot API (HTTPS) — https://core.telegram.org/bots/api
 * sendDocument (multipart), getFile, file download URL.
 */

const DEFAULT_API_BASE = 'https://api.telegram.org';

function normalizedBase(raw?: string): string {
  const s = (raw || DEFAULT_API_BASE).trim().replace(/\/$/, '');
  return s || DEFAULT_API_BASE;
}

function methodUrl(token: string, method: string, apiBase?: string): string {
  return `${normalizedBase(apiBase)}/bot${token}/${method}`;
}

export function botFileDownloadUrl(token: string, filePath: string, apiBase?: string): string {
  const pathSeg = filePath.replace(/^\//, '');
  return `${normalizedBase(apiBase)}/file/bot${token}/${pathSeg}`;
}

type ApiOk<T> = { ok: true; result: T } | { ok: false; description?: string; error_code?: number };

type SentMessage = {
  document?: { file_id: string };
  photo?: { file_id: string }[];
  sticker?: { file_id: string };
};

function fileIdFromSentMessage(msg: SentMessage): string | undefined {
  if (msg.document?.file_id) return msg.document.file_id;
  if (msg.sticker?.file_id) return msg.sticker.file_id;
  const photos = msg.photo;
  if (photos?.length) return photos[photos.length - 1]?.file_id;
  return undefined;
}

async function parseJson<T>(res: Response): Promise<ApiOk<T>> {
  return (await res.json()) as ApiOk<T>;
}

export async function sendDocument(params: {
  token: string;
  chatId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  apiBase?: string;
}): Promise<string> {
  const url = methodUrl(params.token, 'sendDocument', params.apiBase);
  const form = new FormData();
  form.append('chat_id', params.chatId);
  const blob = new Blob([new Uint8Array(params.buffer)], { type: params.mimeType || 'application/octet-stream' });
  form.append('document', blob, params.fileName);

  const res = await fetch(url, { method: 'POST', body: form });
  const json = await parseJson<SentMessage>(res);

  if (!json.ok) {
    throw new Error(json.description || `sendDocument failed (HTTP ${res.status})`);
  }
  const fileId = fileIdFromSentMessage(json.result);
  if (!fileId) {
    throw new Error(
      'sendDocument: could not read file_id from Telegram response (expected document, sticker, or photo on Message)'
    );
  }
  return fileId;
}

export async function getFilePath(params: { token: string; fileId: string; apiBase?: string }): Promise<string> {
  const url = new URL(methodUrl(params.token, 'getFile', params.apiBase));
  url.searchParams.set('file_id', params.fileId);
  const res = await fetch(url.toString(), { method: 'GET' });
  const json = await parseJson<{ file_path?: string }>(res);
  if (!json.ok) {
    throw new Error(json.description || `getFile failed (HTTP ${res.status})`);
  }
  const filePath = json.result.file_path;
  if (!filePath) {
    throw new Error('getFile: result had no file_path');
  }
  return filePath;
}
