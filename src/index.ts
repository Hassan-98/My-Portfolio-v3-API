//= Load Environment Variables
import 'dotenv/config';
//= Application
import App from './app';
//= Validate Config Vars
import validateConfigVars from './configs/app.config';

// Validate Config Vars
validateConfigVars();

// Init New Application
const app = new App();

// Start The App
app.start();

export default app;
