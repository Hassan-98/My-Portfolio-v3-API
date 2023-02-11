//= Modules
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import logger from 'morgan';
import cors, { CorsOptions, CorsRequest } from 'cors';
//= Router
import { AppRouter } from './router/AppRouter';
import './components/Root/root.controller';
import './components/Auth/auth.controller';
import './components/User/user.controller';
import './components/General/general.controller';
import './components/Work/work.controller';
import './components/Experience/experience.controller';
import './components/Stack/stack.controller';
import './components/Contact/contact.controller';
import './components/Logs/log.controller';
//= Migrations
import migrateGeneralSettings from './components/General/general.migration';
import migrateStacks from './components/Stack/stack.migration';
//= Database Configurations
import { databaseConfig } from './configs/db.config';

class App {
  public app: express.Application;
  public port: (string | number);
  public isProduction: boolean;
  public whitelistedDomains: string[] = process.env.WHITELISTED_DOMAINS?.split('|') || [''];

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 9999;
    this.isProduction = process.env.NODE_ENV === 'production' ? true : false;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeAppRouter();
    this.initMigrations();
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log('\x1b[32m%s\x1b[0m', `\n✅ [Server] listening at port ${this.port}`);
    });
  }

  private async initMigrations() {
    await migrateStacks();
    await migrateGeneralSettings();
  }

  private initializeMiddlewares() {
    if (this.isProduction) {
      // Disable etag and x-powered-by
      this.app.disable("etag").disable("x-powered-by");
      // HPP Protect
      this.app.use(hpp());
      // Helmet Protect
      this.app.use(helmet());
      // Cross-Origin Resource Sharing
      this.app.use(cors(this.corsOptionsDelegate));
    } else {
      this.app.use(cors({ origin: true, credentials: true }));
    }

    // Cookie Parser
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    // Req & Res Compression
    this.app.use(compression());
    // Set Morgan Logger
    this.app.use(logger(':method :url :status - :response-time ms'));
    // Setting JSON in Body Of Requests
    this.app.use(express.json({ limit: '20mb' }));
    this.app.use(express.urlencoded({ limit: '20mb', extended: true }));
  }

  public initializeAppRouter() {
    this.app.use(AppRouter.getRouter())
  }

  private corsOptionsDelegate(req: CorsRequest, callback: (err: Error | null, options?: CorsOptions) => void): void {
    var corsOptions;

    if (this.whitelistedDomains.indexOf(req.headers.origin as string) > -1) corsOptions = {
      origin: true,
      credentials: true,
    }

    else corsOptions = { origin: false, credentials: true }

    callback(null, corsOptions)
  }

  private connectToDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DATABASE, MONGO_DEV_DATABASE } = databaseConfig;

    if (this.isProduction) {
      mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DATABASE}?retryWrites=true&w=majority`);
    } else {
      mongoose.connect(`mongodb://127.0.0.1:27017/${MONGO_DEV_DATABASE}`);
    }

    mongoose.connection.on('connected', () => {
      console.log('\x1b[32m%s\x1b[0m', '✅ [MongoDB] Connected...');
    });

    mongoose.connection.on('error', (err: Error) => console.log('\x1b[31m%s\x1b[0m', '❌ [MongoDB] Error : ' + err));

    mongoose.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '❌ [MongoDB] Disconnected...'));
  }
}

export default App;
