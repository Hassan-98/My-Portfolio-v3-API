import { Request, Response } from 'express';
import mongoose from 'mongoose';
//= Decorators
import { Controller, Get } from '../../decorators';
import ConfigVars from '../../configs/app.config';
import { streamTelegramFileToResponse, TelegramStoredFile } from '../../storage/telegram';

@Controller('')
class MediaController {
  @Get('/media/:id')
  async getMedia(req: Request, res: Response): Promise<void> {
    const Config = ConfigVars();
    if (Config.STORAGE_PROVIDER !== 'telegram') {
      res.status(503).send('Telegram storage is not active');
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid id');
      return;
    }

    const doc = await TelegramStoredFile.findById(id).lean();
    if (!doc) {
      res.status(404).send('Not found');
      return;
    }

    const token = Config.TELEGRAM_BOT_TOKEN.trim();
    if (!token) {
      res.status(500).send('TELEGRAM_BOT_TOKEN is not configured');
      return;
    }

    const fileId = doc.telegramFileId;
    if (!fileId) {
      res
        .status(410)
        .send(
          'This file was stored with a legacy Telegram client and cannot be served. Re-upload the asset or run a data migration.'
        );
      return;
    }

    try {
      await streamTelegramFileToResponse(req, res, {
        token,
        apiBase: Config.TELEGRAM_BOT_API_BASE,
        fileId,
        mimeType: doc.mimeType,
      });
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : String(e);
      if (!res.headersSent) {
        res.status(500).send(msg || 'Telegram download failed');
      }
    }
  }
}

export default MediaController;
