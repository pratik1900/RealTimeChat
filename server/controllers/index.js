const User = require("../models/user");
const Conversation = require("../models/conversation");
const mongoose = require('mongoose');
const Events = require("events")
const eventEmitter = new Events();


// module.exports.getTexts = (req, res) => {
//   // console.log("inside getTexts.js");
//   res.json({msg: 'Connected!'})
// };

// module.exports.postText = (req, res) => {
//   console.log(req.body.msg);
//   console.log('TEXT POSTED')
//   res.status(200).end();
// }

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
  if (req.body.searchQuery !== "") {
    //finding all users with username matching search query
    User.find({
      username: { $regex: `${req.body.searchQuery}`, $options: "i" },
      _id: { $ne: { _id: req.session.user } },
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
  } else {
    res.end();
  }
};

module.exports.addFriend = (req, res) => {
  const sender = mongoose.Types.ObjectId(req.session.user);
  const recipient = mongoose.Types.ObjectId(req.body.recipientId);

  console.log("ADD FRIEND SENDER:",sender);
  console.log("ADD FRIEND RECIPIENT:", recipient);

  User.findOne({ _id: recipient })
  .then(recipientDoc => {
    User.findOne({ _id: sender})
    .then(senderDoc => {
      //checking if request has not been sent before, or that they are not already friends
      if (
        !recipientDoc.pendingFriendRequests.includes(sender) &&
        !recipientDoc.sentFriendRequests.includes(sender) &&
        !recipientDoc.friends.includes(sender) &&
        !senderDoc.sentFriendRequests.includes(recipient) &&
        !senderDoc.pendingFriendRequests.includes(recipient) &&
        !senderDoc.friends.includes(recipient)
      ) {
        recipientDoc.pendingFriendRequests.push(sender);
        recipientDoc.save();

        senderDoc.sentFriendRequests.push(recipient);
        senderDoc.save();

        res.status(200).json({
          msg: "Friend Request Sent.",
        });
      } else {
        res.status(200).json({
          msg: "Friend Request has been Sent already.",
        });
      }
    })
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
  .then(recipientDoc => {
    User.findOne({ _id: sender })
    .then(senderDoc => {
      //checking if they are not already friends
      if (
        !recipientDoc.friends.includes(sender) &&
        !senderDoc.friends.includes(recipient)
      ) {
        //adding sender to recipient's friendlist
        recipientDoc.friends.push(sender);
        //removing the friend request from recipient's Pending Requests
        let temp = recipientDoc.pendingFriendRequests.filter(fr => !fr.equals(sender));
        recipientDoc.pendingFriendRequests = temp;
        recipientDoc.save();

        senderDoc.friends.push(recipient);
        temp = senderDoc.sentFriendRequests.filter(fr => !fr.equals(recipient));
        senderDoc.sentFriendRequests = temp;
        senderDoc.save();
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

module.exports.cancelFriendRequest = (req, res) => {
  const sender = mongoose.Types.ObjectId(req.body.senderId); //already obj
  const recipient = mongoose.Types.ObjectId(req.body.recipientId); //converting string to obj

  console.log("SENDER:", typeof sender)
  console.log("RECIPIENT", typeof recipient)
  
  User.findOne({ _id: recipient })
  .then(recipientDoc => {
    User.findOne({ _id: sender })
    .then(senderDoc => {
      
      let temp = recipientDoc.pendingFriendRequests.filter(fr => !fr.equals(sender));
      recipientDoc.pendingFriendRequests = temp;
      recipientDoc.save();

      console.log("THIS IS THE SENDER:", sender);
      temp = senderDoc.sentFriendRequests.filter(fr => !fr.equals(recipient));
      senderDoc.sentFriendRequests = temp;
      senderDoc.save();

      res.json({
        msg: "Friend Request Cancelled."
      });
    })
  })
  .catch(err => {
    console.log(err);
    res.json({
      errorMsg: err,
    });
  });
};

// module.exports.rejectFriendRequest = (req, res) => {

// }

module.exports.getOngoingRequests = (req, res) => {
  User.findOne({ _id: req.session.user })
    .populate("pendingFriendRequests sentFriendRequests")
    .then(user => {
      res.status(200).json({
        pendingFriendRequests: user.pendingFriendRequests,
        sentFriendRequests: user.sentFriendRequests,
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        errorMsg: err,
      });
    });
};

