const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
//const validator = require('validator');
//const { check, validationResult } = require('express-validator');
//const expressValidator = require('express-validator');

const { database } = require('./keys');
//const {PORT} = require ('./config.js');
// Importar las rutas


// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//borrar la cache
app.use((req, res, next) => {
    // Configurar el encabezado Cache-Control en la respuesta HTTP
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
   // Configurar el encabezado Expires en un valor en el pasado para indicar que la respuesta ha expirado
  res.header('Expires', '-1');
    // Configurar el encabezado Pragma en 'no-cache' para indicar que no debe almacenarse en caché
  res.header('Pragma', 'no-cache');
  next();
});

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(expressValidator());

app.use(session({
  secret: 'fertmysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());


// Global variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting dev

app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

//starting to prod
//app.listen(PORT)
//console.log('Server on port', PORT)
