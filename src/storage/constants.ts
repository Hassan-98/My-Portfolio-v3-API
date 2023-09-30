// Max Uploaded File Sizes (In MB)
export const fileSizes = {
  images: 5,
  videos: 100,
  audios: 15,
  documents: 15,
  files: 25
}

export const documentWhitelistTypes = ["msword", "vnd.openxmlformats-officedocument.wordprocessingml.document", "vnd.openxmlformats-officedocument.wordprocessingml.template", "vnd.ms-word.document.macroEnabled.12", "vnd.ms-excel", "vnd.openxmlformats-officedocument.spreadsheetml.sheet", "vnd.openxmlformats-officedocument.spreadsheetml.template", "vnd.ms-excel.sheet.macroEnabled.12", "vnd.ms-excel.template.macroEnabled.12", "vnd.ms-excel.addin.macroEnabled.12", "vnd.ms-excel.sheet.binary.macroEnabled.12", "vnd.ms-powerpoint", "vnd.openxmlformats-officedocument.presentationml.presentation", "vnd.openxmlformats-officedocument.presentationml.template", "vnd.openxmlformats-officedocument.presentationml.slideshow", "vnd.ms-powerpoint.addin.macroEnabled.12", "vnd.ms-powerpoint.presentation.macroEnabled.12", "vnd.ms-powerpoint.template.macroEnabled.12", "vnd.ms-powerpoint.slideshow.macroEnabled.12", "pdf", "vnd.ms-access"];

export const audioWhitelistExtentions = [".aac", ".mp3", ".mp4", ".m3u", ".ogg", ".wav"];

export const videoWhitelistExtentions = [".mp4", ".m3u8", ".ts", ".3gp", ".avi", ".wmv", "mov"];

export const imagesWhitelistExtentions = [".jpg", ".jpeg", ".png", ".svg", ".webp", ".gif", '.avif'];