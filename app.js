const createError = require('http-errors');
const express = require('express');
const cors = require('cors')

/** GRAPHQL */ 
//const expressGraphQL = require('express-graphql');

const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const AdminRouter = require('./routes/admin');
const MovieRouter = require('./routes/MovieRouter');
const PersonRouter = require('./routes/PersonRouter');
const GenreRouter = require('./routes/GenreRouter');
const UserRouter = require('./routes/UserRouter');

/** GRAPHQL */ 
 // const schema = require('./schema/schema');

const app = express();

/** Localhost Cors bug fix => Access-Control-Allow-Origin...  */
app.use(cors());

//db connection
const db = require('./config/db.js')();

//Secret key
const config = require('./config/config');
app.set('api_secret_key', config.api_secret_key );

// Middleware
const verifyToken = require('./middleware/verify-token');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** GRAPHQL */ 
  //app.use('/graphql', expressGraphQL({
  // schema,
  // graphiql: true // graphiql arayüzünü aktif hale getirdik
 // }));


// Routes
app.use('/', indexRouter);
app.use('/admin', verifyToken);
app.use('/admin/dashboard', AdminRouter);
//app.use('/api', verifyToken);
app.use('/api/movies', MovieRouter);
app.use('/api/persons', PersonRouter);
app.use('/api/genres', GenreRouter);
app.use('/api/users', UserRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: { message: err.message, code: err.code } });
});

module.exports = app;
