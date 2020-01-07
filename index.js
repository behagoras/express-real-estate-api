const express = require('express');
const helmet = require('helmet');
const app = express();

const cors = require('cors')

const { config } = require('./config/index');

const authApi = require('./routes/auth');
const moviesApi = require('./routes/movies.js');
const userMoviesApi = require('./routes/userMovies.js');
const propertiesApi = require('./routes/properties');
const imagesApi = require('./routes/images');

const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

// body parser
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(helmet());

// routes
authApi(app);
moviesApi(app);
userMoviesApi(app);
propertiesApi(app);
imagesApi(app);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port);

console.log('listening on port '+config.port );
