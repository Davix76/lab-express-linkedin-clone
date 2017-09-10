const app = require('express')();
const mongoose     = require('mongoose');
const globals = require('./config/globals');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose.connect(globals.dbUrl);

// default value for title local
app.locals.title = 'Linkedin - Generated with IronGenerator';


app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

require('./config/express')(app);

const index = require('./routes/auth');
app.use('/', index);

require('./config/error-handler')(app);

module.exports = app;
