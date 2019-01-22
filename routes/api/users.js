const express = require('express');
const router = express.Router();

// @route GET api/users/test
// @desc  Tests user route
// @access Public 

router.get('/test', (req,res) => res.json({
  msg: 'Users works'
}))

router.post('/register', (req,res) => {
  User.findOne({email: req.body.email})
  .then(user => {
    return res.status(400).json({email: 'Email already exists'})
    ;
  }
  else {
    
  })
})
module.exports = router;