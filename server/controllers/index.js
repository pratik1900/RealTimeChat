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

module.exports.getUsers = (req, res) => {
  console.log("IN GETUSER CONTROLLER:", req.body.searchQuery);

  User.find({ username: { $regex: `${req.body.searchQuery}`, $options: "i" } })
  .then(users => {
    res.status(200).json({
      foundUsers: users
    });
  })
  .catch(err => {
    console.log(err);
    res.json({
      errMsg: err,
    });
  });
};

module.exports.addFriend = (req, res) => {
  const sender = req.session.user;
  const recipient = req.body.recipientId;

  User.findOne({ _id: recipient })
  .then(recipient => {
    recipient.pendingFriendRequests.push(sender);
    recipient.save();
  })
  .catch(err => {
    console.log(err);
    res.json({
      errorMsg: err
    });
  })
}

