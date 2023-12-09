//const { check, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// SIGNUP

router.get('/signup',isNotLoggedIn,(req, res) => {
  res.render('auth/signup');
});


router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  //successRedirect: '/signin',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN

router.get('/signin', isNotLoggedIn, (req, res) => {
   res.render('auth/signin');
});


router.post('/signin', (req, res, next) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
    if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
    }
    
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});
/*
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
});
*/
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/signin'); // Redireccionar después de cerrar sesión
  });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;