import http from 'http';
import path from 'path';
import * as HttpStatus from 'http-status-codes';
import express from 'express';
import bodyParser from 'body-parser';
import ConnectionState from 'mongoose/lib/connectionstate';
import GracefulShutdown from 'http-graceful-shutdown';

import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';

import {
  createPatient,
  readPatient,
  readByIdPatient,
  updateByIdPatient,
  deleteByIdPatient,
} from './handlers/patientHandlers';

import {
  createPhysician,
  readPhysician,
  readByIdPhysician,
  updateByIdPhysician,
  deleteByIdPhysician,
} from './handlers/physicianHandlers';

import { patientSchema, physicianSchema } from './models';

// data connection function
const mLabOpen = async (user, pass, db) => {
  let conn;

  try {
    conn = await mongoose.connect(
      `mongodb+srv://${user}:${pass}@cluster0-fzb1w.mongodb.net/${db}?retryWrites=true&w=majority`,
      {useNewUrlParser: true },
    );
  } catch (err) {
    throw err;
  }

  return conn;
};

let models;
let mongoConnection;
// sets exithandler when microservice starts
const start = async () => {
  console.log('starting');

  // eslint-disable-next-line no-unused-vars
  const exitHandler = async (options, err) => {
    try {
      if (mongoConnection) {
        console.log('Closing database connection.');
        // close mongo connection after getting response for every request
        mongoConnection.disconnect();
      }
    } catch (err) {
      console.log(`Error closing mongo connection: ${err}`);
    }
    console.log(`Closing: ${options.reason}`);
    process.exit();
  };

  /*
   * exit - catches normal app close
   * sigint - catches ctrl-c
   * uncaughtException - exactly what it says
   * sigterm - catches kill commands
   */
  ['exit', 'SIGINT', 'SIGTERM', 'uncaughtException'].forEach((signal) => {
    process.on(signal, exitHandler.bind(null, { reason: signal }));
  });

  try {
    console.log('Opening database connection.');
    mongoConnection = await mLabOpen(process.env.MONGODB_USER, process.env.MONGODB_PASS, process.env.MONGODB_NAME);

    const Patient = mongoConnection.model('Patient', patientSchema);
    const Physician = mongoConnection.model('Physician', physicianSchema);
    // use mongo models (database objects) in all route handlers
    models = { Patient, Physician };
  } catch (e) {
    // return mongo/vault error (if any) before entering route handlers
    console.log(e.message);
    process.exit(1);
  }

};


/**
 * Create the microservice application
 */
const app = express();

/**
 * Setup middleware
 */

// implement security, https://helmetjs.github.io/docs/
app.use(helmet());


/**
 * setup json parsing of data
 */
// grab data from body of a post
app.use(bodyParser.urlencoded({
  extended: true,
}));

// parse json data
app.use(bodyParser.json({
  type: [
    'application/json',
  ],
}));

// protect against parameter pollution attacks
app.use(hpp());

// Open database connection using the library
app.use(async (req, res, next) => {
  // let mongoConnection = null;

  try {
    if (!mongoConnection || !models) {
      console.log('Opening database connection.');
      mongoConnection = await mLabOpen(process.env.MONGODB_USER, process.env.MONGODB_PASS, process.env.MONGODB_NAME);
      const Patient = mongoConnection.model('Patient', patientSchema);
      const Physician = mongoConnection.model('Physician', physicianSchema);
      // use mongo models (database objects) in all route handlers
      req.models = { Patient, Physician };
    } else {
      console.log('Using existing database connection.');
      req.models = models;
    }
  } catch (err) {
    // return mongo/vault error (if any) before entering route handlers
    next(new Error(err.message));
  }

  next();
});


/**
 * Setup route handlers
 */

// patient Read routes
app.get(/^\/Patient\/([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})$/, readByIdPatient);
app.get(/^\/Patient/, readPatient);

// patient Create routes
app.post(/^\/Patient/, createPatient);

// patient Update routes
app.patch(/^\/Patient\/([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})$/, updateByIdPatient);

// patient Delete routes
app.delete(/^\/Patient\/([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})$/, deleteByIdPatient);

// physician Read routes
app.get(/^\/Physician\/([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})$/, readByIdPhysician);
app.get(/^\/Physician/, readPhysician);

// physician Create routes
app.post(/^\/Physician/, createPhysician);

// physician Update routes
app.patch(/^\/Physician\/([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})$/, updateByIdPhysician);

// physician Delete routes
app.delete(/^\/Physician\/([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})$/, deleteByIdPhysician);

// default error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

  console.log(':default error handler: error ', err.message);
  res.status(httpCode).json({
    Error: err.message,
  });

  next();
});

// specifies the root directory from which to serve static assets.
app.use(express.static('public'));

// Web Application Loading Page
app.get('*', function(req, res) {
  console.log('Sending file');
  // load the single view file (angular will handle the page changes on the front-end)
  res.sendfile(path.resolve('public/index.html'));
});

/**
 * Launch the HTTP based microservice
 */
let server;

start()
  .then(() => {
    server = http.createServer({}, app).listen(process.env.PORT, () => {
      console.log(`Server listening on port: ${process.env.PORT}`);
    });

    // ensure a graceful shutdown of the server
    GracefulShutdown(
      server,
      {
        signals: 'SIGINT SIGTERM',
        timeout: 30000,
        finally: () => {
          console.log('Server has shut down gracefully');
        },
      },
    );
  })
  .catch((e) => {
    try {
      if (mongoConnection) {
        console.log('Closing database connection.');
        // close mongo connection after getting response for every request
        mongoConnection.disconnect();
      }
    } catch (err) {
      console.log(`Error closing mongo connection: ${err}`);
    }
    e.message = `Error: ${e.message}`;
    console.log(e.message);
    process.exit(1);
  });

export default app;
