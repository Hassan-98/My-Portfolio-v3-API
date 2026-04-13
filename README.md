# My Portfolio - Server & API
This codebase is for the server side api of my portfolio.

### Dependencies
A list of project dependencies can be found [here](package.json).

### Installation

Provision the necessary ENV variables needed for running the application:

1. Create a database at MongoDB Atlas (or use local MongoDB for development).
2. Choose **file storage** (see below): Firebase / Google Cloud Storage, or Telegram ([Bot API](https://core.telegram.org/bots/api)).
3. Export the ENV variables needed or use a package like [dotenv](https://www.npmjs.com/package/dotenv).
4. From the root of the repo, navigate to the Server folder `cd /Server` to install the node_modules `npm install`. After installation is done start the api in dev mode with `npm run dev`.
5. Without closing the terminal in step 1, navigate to the Client `cd /Client` to install the node_modules `npm install`. After installation is done start the app in dev mode with `npm run start`.

### File storage (`STORAGE_PROVIDER`)

Set **`STORAGE_PROVIDER`** to either **`firebase`** or **`telegram`**.

| Provider | When to use | Required env |
|----------|-------------|--------------|
| **firebase** | Default; signed URLs on Google Cloud Storage via Firebase Admin | `ServiceAccount_project_id`, `ServiceAccount_private_key`, `ServiceAccount_client_email` |
| **telegram** | Uploads via `sendDocument`; public URLs are `API_PUBLIC_URL/media/:id` on this API | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_STORAGE_PEER` (Bot API **chat_id**), **`API_PUBLIC_URL`** |

**Telegram setup (Bot API)**

Storage uses HTTPS to `https://api.telegram.org/bot<token>/…` as documented in the [Telegram Bot API](https://core.telegram.org/bots/api): multipart `sendDocument` for uploads, `getFile` plus `…/file/bot<token>/<file_path>` for downloads (proxied through `GET /media/:id`).

1. Create a bot with [@BotFather](https://t.me/BotFather) and set `TELEGRAM_BOT_TOKEN`.
2. Choose a **chat the bot is allowed to message** and set `TELEGRAM_STORAGE_PEER` to that chat’s id (per Bot API: integer or string). Common choices: a **private channel** where the bot is an **administrator** (id often looks like `-100…`), or your **numeric user id** in a private chat after you send `/start` to the bot. The value **`me` is not valid** for bots.
3. Set `API_PUBLIC_URL` to the **public base URL of this API** (e.g. `https://api.example.com`) so generated links validate as URLs in the rest of the stack.
4. Optional: `TELEGRAM_BOT_API_BASE` if you use a [self-hosted Bot API server](https://core.telegram.org/bots/api#using-a-local-bot-api-server) (larger uploads/downloads than the cloud limits).

**Recovery (switch back to Google storage)**

1. Set `STORAGE_PROVIDER=firebase` and ensure service account variables are valid.
2. Restart the server. New uploads use GCS again. Existing documents keep whatever URLs they already store (Firebase signed URLs or `/media/...` links).

**Migrating existing Firebase URLs in MongoDB**

With `STORAGE_PROVIDER=telegram` and a DB backup, run:

`npm run migrate:firebase-urls`

This walks collections, downloads `firebasestorage.googleapis.com` URLs, re-uploads via the current storage layer, and replaces strings in place.

**Note:** If you previously used GramJS user-session storage, old `TelegramStoredFile` rows without `telegramFileId` cannot be served; re-upload those assets or migrate data.

## Testing

This project contains two different test suite: unit tests and End-To-End tests(e2e). Follow these steps to run the tests.

1. `cd Server`
2. `npm run test`

There are no Unit test on the back-end

### Unit Tests:

Unit tests are using the Jasmine Framework.

## Built With

- [Nodejs](https://nodejs.org) - Javascript Runtime
- [Express](https://expressjs.com/) - Javascript API Framework
- [MongoDB (Mongoose)](https://www.mongodb.com) - NoSQL Database
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
