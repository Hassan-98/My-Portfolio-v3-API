import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import ConfigVars from '../configs/app.config';

let firebaseReady = false;

function ensureFirebaseApp(): void {
  if (firebaseReady) return;

  const Config = ConfigVars();
  if (Config.STORAGE_PROVIDER !== 'firebase') {
    throw new Error('Firebase storage is only available when STORAGE_PROVIDER=firebase');
  }

  const serviceAccount: ServiceAccount = {
    projectId: Config.ServiceAccount_project_id,
    privateKey: Config.ServiceAccount_private_key.replace(/\\n/g, '\n'),
    clientEmail: Config.ServiceAccount_client_email,
  };

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: `${Config.ServiceAccount_project_id}.appspot.com`,
    });
  }

  firebaseReady = true;
}

export async function saveToFirebaseBucket(
  storagePath: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  ensureFirebaseApp();
  const bucket = getStorage().bucket();
  const uploadedFile = bucket.file(storagePath);
  await uploadedFile.save(buffer, {
    contentType,
    gzip: true,
  });
  const [fileUrl] = await uploadedFile.getSignedUrl({
    action: 'read',
    expires: '01-01-2100',
  });
  return fileUrl;
}

export async function deleteFileByURL(fileUrl: string) {
  try {
    const fullPath: string[] = fileUrl.split('?')[0].split('/');
    if (!fullPath) throw new Error('Error occurred while extracting file path');
    const filePath = `${fullPath.at(-3)}/${decodeURI(fullPath.at(-2) as string)}/${fullPath.at(-1)}`;
    ensureFirebaseApp();
    const bucket = getStorage().bucket();
    await bucket.file(filePath).delete();
    return { success: true };
  } catch (e: any) {
    return { err: e.message };
  }
}

export async function deleteFileByPath(filePath: string) {
  try {
    ensureFirebaseApp();
    const bucket = getStorage().bucket();
    await bucket.file(filePath).delete();
    return { success: true };
  } catch (e: any) {
    return { err: e.message };
  }
}
