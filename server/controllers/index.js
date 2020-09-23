const User = require("../models/user");
const mongoose = require('mongoose')

module.exports.getTexts = (req, res) => {
  // console.log("inside getTexts.js");
  res.json({msg: 'Connected!'})
};

module.exports.postText = (req, res) => {
  console.log(req.body.msg);
  console.log('TEXT POSTED')
  res.status(200).end();
}

module.exports.getUserInfo = (req, res) => {
  User.findOne(mongoose.Types.ObjectId(req.session.user), 'username email avatar')
    .then(user => {
      res.json({
        userInfo: user,
      });
    })
    .catch(err => {
      console.log(err);
    });

}

module.exports.getFriends = (req, res) => {
  User.findOne({ _id: req.session.user })
  .then(user => {
    if(user) {
      res.status(200).json({
        friends: user.friends
      });
    }
  })
  .catch(err => console.log(err))
}

