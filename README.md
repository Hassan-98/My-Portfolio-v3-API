# My Portfolio API - Server
This codebase is for the server side api of my portfolio.

### Dependencies
A list of project dependencies can be found [here](package.json).

### Installation

Provision the necessary ENV variables needed for running the application:

1. In Google Cloud Storage, create a storage bucket for hosting the uploaded files.
2. Create a database at MonogoDB Atlas.
3. Export the ENV variables needed or use a package like [dotnev](https://www.npmjs.com/package/dotenv).
4. From the root of the repo, navigate Server folder `cd /Server` to install the node_modules `npm install`. After installation is done start the api in dev mode with `npm run dev`.
5. Without closing the terminal in step 1, navigate to the Client `cd /Client` to install the node_modules `npm install`. After installation is done start the app in dev mode with `npm run start`.

## Testing

This project contains two different test suite: unit tests and End-To-End tests(e2e). Follow these steps to run the tests.

1. `cd Server`
2. `npm run test`

There are no Unit test on the back-end

### Unit Tests:

Unit tests are using the Jasmine Framework.

## Built With

- [Node](https://nodejs.org) - Javascript Runtime
- [Express](https://expressjs.com/) - Javascript API Framework
- [MongoDB (Mongoose)](https://www.mongodb.com) - NoSQL Database
- [TypeScript](https://expressjs.com/)