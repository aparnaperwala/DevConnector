const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route GET api/users/test
// @desc  Tests user route
// @access Public 

router.get('/test', 
(req,res) => res.json({
  msg: 'Users works'
}));

// @route POST api/users/resgister
// @desc  register user 
// @access Public

router.post('/register', (req,res) => {
  
  const {errors, isValid} = validateRegisterInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
    const avatar = gravatar.url(req.body.email,{
      s: '200',
      r:'pg',
      d:'mm'
    });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10,(err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err,hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
        })
      })

    }
  })
})

// @route POST api/users/login
// @desc Login user /Returning JWT token
// @access Public
router.post('/login', (req,res) => {
const {errors, isValid} = validateLoginInput(req.body);

if(!isValid) {
  return res.status(400).json(errors);
}


  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({email})
  .then(
    user => {
      if (!user){
        return res.status(400).json({email: 'User not found'});
      }
      // Check password
      bcrypt.compare(password, user.password)
      .then(isMatch =>{
        if (isMatch){
          //User matched
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          //Sign token
          jwt.sign(
            payload, 
            keys.secretOrKey,
            {expiresIn: 3600},
            (err, token) => {
              res.json(
                {
                  success: true,
                  token: 'Bearer ' + token
                }
              )
            }
            );
        } else {
          return res.status(400).json({email: 'password incorrect'});
        }
      });
    }
  )
})

// @route GET api/users/current
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name
  });
})
module.exports = router;