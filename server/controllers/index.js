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
  .populate("friends")
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
  User.findOne({ _id: req.session.user })
  .then(currentUser => {
    //finding all users with username matching search query, except those already friends with currentUser
    User.find({
      username: { $regex: `${req.body.searchQuery}`, $options: "i" },
      _id: { $ne: { _id: req.session.user }, $nin: currentUser.friends },
    }, "avatar email friends pendingFriendRequests sentFriendRequests username")
    .then(users => {
      res.status(200).json({
        foundUsers: users,
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        errMsg: err,
      });
    });
  })
};

module.exports.addFriend = (req, res) => {
  const sender = req.session.user;
  const recipient = req.body.recipientId;

  User.findOne({ _id: recipient })
  .then(recipient => {
    //checking if request has not been sent before
    if (!recipient.pendingFriendRequests.includes(sender)){
      recipient.pendingFriendRequests.push(sender);
      recipient.save();

      User.findOne({ _id: sender })
      .then(sender => {
        sender.sentFriendRequests.push(recipient);
        sender.save();
      })

      res.status(200).json({
        msg: "Friend Request Sent.",
      });
    } else {
      res.status(200).json({
        msg: "Friend Request has been Sent already.",
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.json({
      errorMsg: err
    });
  })
};

module.exports.acceptFriendRequest = (req, res) => {
  const recipient = req.session.user; //already obj
  const sender = mongoose.Types.ObjectId(req.body.senderId);  //converting string to obj

  User.findOne({ _id: recipient })
  .then(recipient => {
    //checking if they are not already friends
    if(!recipient.friends.includes(sender)) {
      //adding sender to recipient's friendlist
      recipient.friends.push(sender);
      //removing the friend request from recipient's Pending Requests
      let temp = recipient.pendingFriendRequests.filter(fr => !fr.equals(sender));
      recipient.pendingFriendRequests = temp;
      return recipient.save();
    }
  })
  .then(result => {
    User.findOne({ _id: sender })
    .then(sender => {
      //checking if they are not already friends
      if (!sender.friends.includes(recipient)) {
        //adding recipient to sender's friendlist
        sender.friends.push(recipient);
        //removing the friend request from sender's Sent Requests
        let temp = sender.sentFriendRequests.filter(fr => !fr.equals(recipient));
        sender.sentFriendRequests = temp;
        sender.save();
        res.status(200).json({
          msg: "Friend Request Accepted.",
        });
      }
    })
  })
  .catch(err => {
    console.log(err);
    res.json({
      errorMsg: err,
    });
  });
};

module.exports.getPendingRequests = (req, res) => {
  User.findOne({ _id: req.session.user })
    .populate("pendingFriendRequests")
    .then(user => {
      res.status(200).json({
        pendingFriendRequests: user.pendingFriendRequests,
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        errorMsg: err,
      });
    });
}

