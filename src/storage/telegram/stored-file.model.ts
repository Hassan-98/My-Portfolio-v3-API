import mongoose from 'mongoose';

const TelegramStoredFileSchema = new mongoose.Schema(
  {
    telegramFileId: { type: String, required: true },
    storageChatId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    logicalPath: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { timestamps: true }
);

const TelegramStoredFile =
  mongoose.models.TelegramStoredFile || mongoose.model('TelegramStoredFile', TelegramStoredFileSchema);

export default TelegramStoredFile;
