const { validationResult } = require('express-validator');
const { use } = require('../routes');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


module.exports.postRegister = (req, res) => {
  const errors = validationResult(req);

  // console.log('In Register Controller', errors)

  if(!errors.isEmpty()) {
    //validation failed
    res.json(errors);
  } else {
    //validation passed
    const { username, email, password } = req.body;

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });
      return newUser.save();
    })
    .then(result => {
      res.status(201).end();
    })
    .catch(err => console.log(err))
  }
};


module.exports.postLogin = (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    //validation failed
    res.json(errors);
  } else {
    // validation pass
    console.log(req.body);
    User.findOne({ username: req.body.username })
    .then(user => {
      //Not doing if(user) as existence of user with given username is already done during data validation(routes)
      bcrypt.compare(req.body.password, user.password)
      .then(doMatch => {
        if(doMatch){
          const payload = {
            username: user.username,
            email: user.email,
            password: user.password
          }
          // const token = jwt.sign(payload, process.env.PASSPORT_JWT_SECRET);
          // res.json({accessToken: token});
          // const cookieValue = `acessToken=${token}`;
          // res.setHeader('Set-Cookie', cookieValue).json({msg: 'JWT Set'});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({err: err});
      })
    })
    .catch(err => console.log(err))
  }
  console.log(errors);
  console.log("In Login Controller");
};
