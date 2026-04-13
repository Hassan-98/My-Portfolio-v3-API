import ConfigVars from '../../configs/app.config';
import { sendDocument } from './bot-api';
import TelegramStoredFile from './stored-file.model';

export async function saveToTelegram(params: {
  buffer: Buffer;
  mimetype: string;
  size: number;
  newFileName: string;
  logicalPath: string;
}): Promise<{ url: string; path: string }> {
  const Config = ConfigVars();
  const token = Config.TELEGRAM_BOT_TOKEN.trim();
  const chatId = Config.TELEGRAM_STORAGE_PEER.trim();
  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_STORAGE_PEER are required for Telegram storage');
  }

  const mimeSub = (params.mimetype.split('/')[1] || 'bin').split('+')[0];
  const ext = params.newFileName.includes('.') ? '' : `.${mimeSub}`;
  const fileName = params.newFileName.includes('.') ? params.newFileName : `${params.newFileName}${ext}`;

  const telegramFileId = await sendDocument({
    token,
    chatId,
    fileName,
    mimeType: params.mimetype,
    buffer: params.buffer,
    apiBase: Config.TELEGRAM_BOT_API_BASE,
  });

  const doc = await TelegramStoredFile.create({
    telegramFileId,
    storageChatId: chatId,
    mimeType: params.mimetype,
    size: params.size,
    logicalPath: params.logicalPath,
    fileName,
  });

  const base = Config.API_PUBLIC_URL.replace(/\/$/, '');
  return { url: `${base}/media/${doc._id.toString()}`, path: params.logicalPath };
}
