import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import {join} from 'path';
import index from './routes/index';
import users from './routes/users';
import posts from './routes/posts';
import cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet
import path = require('path');

// local file config
import * as appAuthConfig from '../config/config';
// process environment variable config
//import * as appAuthConfig from './appconfig/config';

import * as passport from 'passport';
import * as passportAuth from './appconfig/passport';


const app: express.Express = express();
const configs : appAuthConfig.AuthConfigSecrets = new appAuthConfig.AuthConfigSecrets();


mongoose.connect(configs.mongodb.connection);

const ppauth: passportAuth.PassportConfig = new passportAuth.PassportConfig(passport, configs);

// view engine setup
// app.set('views', join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// required for passport
// session secret
app.use(session({secret: configs.session.session_secret,
                  saveUninitialized: true,
                  resave: true}));
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());


app.use(express.static(path.join(__dirname, '/public')));

app.use('/postapi',posts);
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// // error handlers
// 
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
// 
//   app.use((error: any, req, res, next) => {
//     res.status(error['status'] || 500);
//     res.render('error', {
//       message: error.message,
//       error
//     });
//   });
// }
// 
// // production error handler
// // no stacktraces leaked to user
// app.use((error: any, req, res, next) => {
//   res.status(error['status'] || 500);
//   res.render('error', {
//     message: error.message,
//     error: {}
//   });
//   return null;
// });


export default app;