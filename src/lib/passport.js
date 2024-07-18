const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const supabase = require('../config/supabase');
const helpers = require('./helpers');

//login
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  console.log(req.body);
  const rows = await supabase.from('users').select('*').eq('username', username);
  if (rows.data.length > 0) {
    const user = rows.data[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username)); // user
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));
//agregar usario
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  let newUser = {
    fullname,
    username,
    password
  };
  //para sifrar la contraseña
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const { data, error } = await supabase.from('users').insert([newUser]).select();
  if (error) {
    console.log('error', error);
    throw error;
  }
  newUser.id = data[0].id;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await supabase.from('users').select('*').eq('id', id);
  done(null, rows.data[0]);
});