import { Request, Response } from 'express';
import axios from 'axios';
import { pipeline } from 'stream/promises';
import { botFileDownloadUrl, getFilePath } from './bot-api';

/**
 * Proxies a Telegram file to the HTTP response (getFile + CDN stream).
 */
export async function streamTelegramFileToResponse(
  req: Request,
  res: Response,
  opts: { token: string; apiBase: string; fileId: string; mimeType: string }
): Promise<void> {
  const filePath = await getFilePath({
    token: opts.token,
    fileId: opts.fileId,
    apiBase: opts.apiBase,
  });
  const downloadUrl = botFileDownloadUrl(opts.token, filePath, opts.apiBase);

  const upstream = await axios.get(downloadUrl, {
    responseType: 'stream',
    maxRedirects: 5,
    validateStatus: (s) => s >= 200 && s < 400,
  });

  res.setHeader('Content-Type', opts.mimeType);
  res.setHeader('Cache-Control', 'public, max-age=86400');

  const destroyUpstream = (): void => {
    const s = upstream.data as NodeJS.ReadableStream & { destroy?: (e?: Error) => void };
    if (typeof s.destroy === 'function') s.destroy();
  };

  req.on('aborted', destroyUpstream);
  req.on('close', () => {
    if (!res.writableEnded) destroyUpstream();
  });

  try {
    await pipeline(upstream.data, res);
  } catch (pipeErr) {
    destroyUpstream();
    if (!res.headersSent) {
      const msg =
        pipeErr && typeof pipeErr === 'object' && 'message' in pipeErr
          ? String((pipeErr as { message: unknown }).message)
          : 'Download stream failed';
      res.status(500).send(msg);
    } else if (!res.writableEnded) {
      res.destroy(pipeErr instanceof Error ? pipeErr : undefined);
    }
  }
}
