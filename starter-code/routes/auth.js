const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const bcryptSalt = 10;

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Linkedin' });


});



// SIGNUP: Print form
router.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Signup'
  });
});

// SIGNUP: Create user in db
router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const name     = req.body.name;
  const email    =req.body.email;

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }).then(user =>{
    if(user){
      res.render("signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        username: username,
        password: hashPass,
        name:name,
        email:email,
      })
      .save()
      .then(() => res.render("user/profile",{user:username}))
      .catch(e => next(e));
  });

});



// LOGIN: Print form
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login Here!'
  });
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var name     = req.body.name;
  var email    = req.body.email;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.render("user/profile", {
          user: user
        });
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
