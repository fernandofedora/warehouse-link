//const { check, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const bodyParser = require('body-parser');
const helpers = require('../lib/helpers');

const pool = require('../database');

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
   res.render('auth/signin', { pageTitle: 'sigin', excludeNavigation: true });
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

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/'); // Redireccionar después de cerrar sesión
  });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {pageTitle: 'Profile'});
});

router.get('/profile/:id', isLoggedIn, (req, res) => {
  res.render('auth/profile/edit');
});

router.post('/profile/:id', isLoggedIn, async (req, res) => {
  const {id} = req.id;
  console.log(id)
  const {fullname, username, currentPassword, newPassword, updatePassword, updateInformation } = req.body;
  const user = await pool.query('SELECT * from users where id = ?', [id]);

  if (updateInformation) {
    const updateUser = {
      fullname,
      username
    };

    await pool.query('UPDATE users set ? where id = ?', [updateUser, id]);

    req.flash('success', 'Profile updated successfully');
    return res.redirect(`/profile/${id}`);
  }

  if (updatePassword) {
    if (!helpers.matchPassword(currentPassword, user[0].password)) {
      req.flash('error', 'User credential not valid');
      return res.redirect(`/profile/${id}`);
    }

    const hashPassword = await helpers.encryptPassword(newPassword);
    const updateUser = {
      password: hashPassword
    };

    await pool.query('UPDATE users set ? where id = ?', [updateUser, id]);

    req.flash('success', 'Password updated successfully');
    return res.redirect(`/profile/${id}`);

  }
})

module.exports = router;