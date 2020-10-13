const User = require("../models/user");
const Conversation = require("../models/conversation");
const mongoose = require('mongoose');

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
      const friends = user.friends;
      friends.sort( (a, b) => a.username.localeCompare(b.username));  //sorting by username
      let friendsWithCount;
      
      Conversation.find({ participants: { $size: 2, $in: req.session.user } })
      .then(convos => {
        const unseen = convos.map(con => {
          const unseenCount = con.messages.filter(msg => msg.status === "sent").length;
          const friendId = con.participants.filter(p => !p.equals(req.session.user))[0]
          return {
            friendId: friendId,
            unseenCount: unseenCount
          }
        });

        friendsWithCount = friends.map(frnd => {
          const unseenCount = unseen.find(val => frnd._id.equals(val.friendId )).unseenCount; 
          return {
            _id: frnd._id,
            username: frnd.username,
            avatar: frnd.avatar,
            unseenCount: unseenCount 
          }
        });
        res.status(200).json({
          friends: friendsWithCount,
        });
        // console.log("FRIENDS WITH COUNT: ", friendsWithCount);
      })
      .catch(err => console.log(err));
    }
  })
  .catch(err => console.log(err))
}

module.exports.getLatestConversations = (req, res) => {
  Conversation.find({participants: req.session.user })
  .then(conversations => {
    if (conversations){
      const convos = conversations.sort((a, b) => {
        return a.messages[a.messages.length - 1].sentAt - b.messages[b.messages.length - 1].sentAt;
      });
      res.status(200).json({ convos: convos })
    }
  })
  .catch(err => console.log(err))
};


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

        const convo = new Conversation({
          conversationType: "private",
          participants: [
            recipient,
            sender
          ]
        });
        convo.save();

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

module.exports.getPrivateConversation = (req, res) => {
  Conversation.findOne({ participants: { $size: 2, $all: req.body.participants } })
  .then(convo => {
    User.findOne({ _id: req.body.participants[1] }, "username avatar")
    .then(friend => {
      res.status(200).json({
        roomId: convo._id,
        textHistory: convo,
        friendInfo: friend
      });
    })
  })
  .catch(err => {
    console.log(err);
    res.json({
      errorMsg: err,
    });
  })
}

module.exports.sendText = (req, res) => {
  Conversation.findOne({
    participants: { $size: 2, $all: [ req.body.sender, req.body.recipient ] },
  })
    .then(convo => {
      convo.messages.push({
        text: req.body.msg,
        sender: mongoose.Types.ObjectId(req.body.sender)
      });
      convo.save()
      .then(result => {
        const msgId = result.messages[result.messages.length - 1]._id;
        res.status(200).json({
          msg: "SUCCESS",
          msgId: msgId
        }); 
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        errorMsg: err,
      });
    });
}

module.exports.getConversationId = (req, res) => {
  Conversation.findOne({
    participants: { $size: 2, $all: [req.body.currentUser, req.body.friendId] },
  }, "_id")
  .then(convo => {
    res.status(200).json({
      conversation: convo
    })
  })
  .catch(err => {
    console.log(err);
      res.json({
        errorMsg: err,
      });
  })
};

module.exports.setTextStatustoSeen = (req, res) => {
  const { sender, recipient, roomId, msg, msgId } = req.body;
  
  Conversation.findOne({
    participants: { $size: 2, $all: [sender, recipient] },
  })
    .then(convo => {
      const messages = convo.messages.map(doc => {
        if (doc._id.equals(mongoose.Types.ObjectId(msgId))) {
          doc.status = "seen";
          return doc;
        } else {
          return doc;
        }
      });
      convo.messages = messages;
      return convo.save();
    })
    .then(result => {
      res.status(200).json({ response: "Success" });
    })
    .catch(err => console.log(err));
}

module.exports.setTextStatustoSeenAll = (req, res) => {
  const { sender, recipient, roomId } = req.body;

  Conversation.findOne({
    participants: { $size: 2, $all: [sender, recipient] },
  })
    .then(convo => {
      const messages = convo.messages.map(doc => {
        if (doc.sender.equals(mongoose.Types.ObjectId(sender)) && doc.status === "sent") {
          console.log("BINGO");
          doc.status = "seen";
          return doc;
        } else {
          return doc;
        }
      });
      convo.messages = messages;
      return convo.save();
    })
    .then(result => {
      res.status(200).json({ response: "Success" });
    })
    .catch(err => console.log(err));
};
