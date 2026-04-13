import { cleanEnv, str, port } from 'envalid';

export type StorageProvider = 'telegram' | 'firebase';

interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  HOST: string;
  MONGO_USER: string;
  MONGO_PASSWORD: string;
  MONGO_PATH: string;
  MONGO_DATABASE: string;
  MONGO_DEV_DATABASE: string;
  WHITELISTED_DOMAINS: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  CRYPTO_SECRET: string;
  CLIENT_URL: string;
  MAILGUN_USERNAME: string;
  MAILGUN_PASSWORD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECERT: string;
  ServiceAccount_project_id: string;
  ServiceAccount_private_key: string;
  ServiceAccount_client_email: string;
  GOOGLE_LOGIN_EMAIL: string;
  STORAGE_PROVIDER: StorageProvider;
  /** Bot token from @BotFather; used with https://core.telegram.org/bots/api */
  TELEGRAM_BOT_TOKEN: string;
  /** Bot API chat_id where files are sent (channel / group / user), not GramJS "me" */
  TELEGRAM_STORAGE_PEER: string;
  /** Default https://api.telegram.org — override if you run a local Bot API server */
  TELEGRAM_BOT_API_BASE: string;
  API_PUBLIC_URL: string;
  TELEGRAM_APP_NAME: string;
  TELEGRAM_BOT_USERNAME: string;
  isProduction: boolean;
}

/** Map legacy .env key names to the ones cleanEnv reads. */
function normalizeEnvAliases(): void {
  const e = process.env;
  if (!e.TELEGRAM_BOT_TOKEN?.trim() && e.TELEGRAM_bot_token?.trim()) {
    e.TELEGRAM_BOT_TOKEN = e.TELEGRAM_bot_token;
  }
  if (!e.TELEGRAM_APP_NAME?.trim() && e.TELEGRAM_app_name?.trim()) {
    e.TELEGRAM_APP_NAME = e.TELEGRAM_app_name;
  }
  if (!e.TELEGRAM_BOT_USERNAME?.trim() && e.TELEGRAM_bot_username?.trim()) {
    e.TELEGRAM_BOT_USERNAME = e.TELEGRAM_bot_username;
  }
}

function deriveApiPublicUrl(host: string, portNum: number): string {
  const trimmed = host.replace(/\/$/, '').trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed.includes('://') ? trimmed : `http://${trimmed}`);
    const p = u.port || String(portNum);
    return `${u.protocol}//${u.hostname}:${p}`;
  } catch {
    return `${trimmed}:${portNum}`;
  }
}

function validateStorageConfig(env: {
  STORAGE_PROVIDER: string;
  ServiceAccount_project_id: string;
  ServiceAccount_private_key: string;
  ServiceAccount_client_email: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_STORAGE_PEER: string;
  API_PUBLIC_URL: string;
}): void {
  if (env.STORAGE_PROVIDER !== 'telegram' && env.STORAGE_PROVIDER !== 'firebase') {
    throw new Error(`STORAGE_PROVIDER must be "telegram" or "firebase", got: ${env.STORAGE_PROVIDER}`);
  }
  if (env.STORAGE_PROVIDER === 'firebase') {
    if (!env.ServiceAccount_project_id?.trim()) {
      throw new Error('STORAGE_PROVIDER=firebase requires ServiceAccount_project_id');
    }
    if (!env.ServiceAccount_private_key?.trim()) {
      throw new Error('STORAGE_PROVIDER=firebase requires ServiceAccount_private_key');
    }
    if (!env.ServiceAccount_client_email?.trim()) {
      throw new Error('STORAGE_PROVIDER=firebase requires ServiceAccount_client_email');
    }
  }
  if (env.STORAGE_PROVIDER === 'telegram') {
    if (!env.TELEGRAM_BOT_TOKEN?.trim()) {
      throw new Error('STORAGE_PROVIDER=telegram requires TELEGRAM_BOT_TOKEN from @BotFather');
    }
    const peer = env.TELEGRAM_STORAGE_PEER.trim();
    if (!peer) {
      throw new Error(
        'STORAGE_PROVIDER=telegram requires TELEGRAM_STORAGE_PEER (Bot API chat_id: numeric id, @channelusername, or -100… for channels)'
      );
    }
    if (peer.toLowerCase() === 'me') {
      throw new Error(
        'TELEGRAM_STORAGE_PEER cannot be "me" with the Bot API. Use a chat the bot can post to, e.g. a private channel where the bot is admin (id often -100…), or your user id in private chat after /start.'
      );
    }
    if (!env.API_PUBLIC_URL?.trim()) {
      throw new Error(
        'STORAGE_PROVIDER=telegram requires API_PUBLIC_URL, or set HOST (and PORT) so the API base URL can be derived'
      );
    }
    try {
      // eslint-disable-next-line no-new
      new URL(env.API_PUBLIC_URL);
    } catch {
      throw new Error('API_PUBLIC_URL must be a valid URL');
    }
  }
}

const ENV = (): EnvironmentVariables => {
  normalizeEnvAliases();

  const env = cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str(),
    HOST: str({ default: '' }),
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_DATABASE: str(),
    MONGO_DEV_DATABASE: str(),
    WHITELISTED_DOMAINS: str(),
    CLIENT_URL: str(),
    JWT_SECRET: str(),
    COOKIE_SECRET: str(),
    CRYPTO_SECRET: str(),
    MAILGUN_USERNAME: str({ default: '' }),
    MAILGUN_PASSWORD: str({ default: '' }),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECERT: str(),
    GOOGLE_LOGIN_EMAIL: str(),
    ServiceAccount_project_id: str({ default: '' }),
    ServiceAccount_private_key: str({ default: '' }),
    ServiceAccount_client_email: str({ default: '' }),
    STORAGE_PROVIDER: str({ default: 'telegram' }),
    TELEGRAM_BOT_TOKEN: str({ default: '' }),
    TELEGRAM_STORAGE_PEER: str({ default: '' }),
    TELEGRAM_BOT_API_BASE: str({ default: 'https://api.telegram.org' }),
    API_PUBLIC_URL: str({ default: '' }),
    TELEGRAM_APP_NAME: str({ default: '' }),
    TELEGRAM_BOT_USERNAME: str({ default: '' }),
  });

  const apiPublicUrl =
    env.API_PUBLIC_URL.trim() || (env.HOST.trim() ? deriveApiPublicUrl(env.HOST, env.PORT) : '');

  validateStorageConfig({
    ...env,
    API_PUBLIC_URL: apiPublicUrl,
  });

  const botBase = env.TELEGRAM_BOT_API_BASE.trim().replace(/\/$/, '') || 'https://api.telegram.org';

  return {
    PORT: env.PORT,
    NODE_ENV: env.NODE_ENV,
    HOST: env.HOST,
    MONGO_USER: env.MONGO_USER,
    MONGO_PASSWORD: env.MONGO_PASSWORD,
    MONGO_PATH: env.MONGO_PATH,
    MONGO_DATABASE: env.MONGO_DATABASE,
    MONGO_DEV_DATABASE: env.MONGO_DEV_DATABASE,
    WHITELISTED_DOMAINS: env.WHITELISTED_DOMAINS,
    JWT_SECRET: env.JWT_SECRET,
    COOKIE_SECRET: env.COOKIE_SECRET,
    CRYPTO_SECRET: env.CRYPTO_SECRET,
    CLIENT_URL: env.CLIENT_URL,
    MAILGUN_USERNAME: env.MAILGUN_USERNAME,
    MAILGUN_PASSWORD: env.MAILGUN_PASSWORD,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECERT: env.GOOGLE_CLIENT_SECERT,
    ServiceAccount_project_id: env.ServiceAccount_project_id,
    ServiceAccount_private_key: env.ServiceAccount_private_key,
    ServiceAccount_client_email: env.ServiceAccount_client_email,
    GOOGLE_LOGIN_EMAIL: env.GOOGLE_LOGIN_EMAIL,
    STORAGE_PROVIDER: env.STORAGE_PROVIDER as StorageProvider,
    TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_STORAGE_PEER: env.TELEGRAM_STORAGE_PEER,
    TELEGRAM_BOT_API_BASE: botBase,
    API_PUBLIC_URL: apiPublicUrl,
    TELEGRAM_APP_NAME: env.TELEGRAM_APP_NAME,
    TELEGRAM_BOT_USERNAME: env.TELEGRAM_BOT_USERNAME,
    isProduction: process.env.NODE_ENV === 'production',
  };
};

export default ENV;
