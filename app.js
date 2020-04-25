const createError = require('http-errors');
const express = require('express');
/** GRAPHQL */ 
//const expressGraphQL = require('express-graphql');

const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const MovieRouter = require('./routes/MovieRouter');
const PersonRouter = require('./routes/PersonRouter');
const GenreRouter = require('./routes/GenreRouter');

/** GRAPHQL */ 
 // const schema = require('./schema/schema');

const app = express();

//db connection
const db = require('./config/db.js')();

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
app.use('/users', usersRouter);
app.use('/api/movies', MovieRouter);
app.use('/api/persons', PersonRouter);
app.use('/api/genres', GenreRouter);


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
