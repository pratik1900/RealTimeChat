const { validationResult } = require('express-validator');
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
    User.findOne({ username: req.body.username })
    .then(user => {
      //Not doing if(user) as existence of user with given username is already done during data validation(routes)
      bcrypt.compare(req.body.password, user.password)
      .then(doMatch => {
        if(doMatch){
          req.session.user = user._id
          req.session.isLoggedIn = true
          req.session.save()
          res.status(200).json({msg: 'Done'})
        } else {
          res.status(401).json({error: { field: 'password', msg: 'Wrong Password' } });
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

module.exports.postLogout = (req, res) => {
 req.session.destroy(err => {
   if(err){
     console.log(err);
   }
   console.log('Logged out. Session destroyed.');
   res.status(200).json({msg: "Logged out."})
 })
}

module.exports.getAuthStatus = (req, res) => {
  res.json({ authStatus: req.session.isLoggedIn });
}

module.exports.changeProfileInfo = (req, res) => {

  const errors = validationResult(req);

  //validation fail
  if(!errors.isEmpty()) {
    res.json(errors);
  } else {
    //validation passed
    const { _id, username, email } = req.body;
    User.updateOne({ _id: _id }, { username: username, email: email })
      .then(result => {
        console.log(result);
        if (result.ok) {
          User.findOne({ _id: _id }, "username email").then(updatedUser => {
            res.status(200).json({
              successfulUpdate: true,
              updatedUser: updatedUser,
            });
          });
        }
      })
      .catch(err => console.log(err));
  }
}