import classes from "./Friends.module.css";
import React, { Component } from "react";

import axios from "../../axiosInstance";
// import defaultUserImg from "../../assets/images/default-user-image.png";

const userImg =
  "https://res.cloudinary.com/pratik2/image/upload/v1600430288/realtimechat/default-user-image_o3qrpf.png";

class Friends extends Component {
  state = {
    friends: [],
  };

  componentDidMount() {
    this.getFriends();
  }

  getFriends() {
    axios
      .get("/getFriends")
      .then(result => {
        console.log(result.data.friends);
        const friends = result.data.friends;

        //Seeding
        friends.push({
          _id: "5f637338ca5cb62c0cc4cfa5",
          username: "paro123",
        });

        friends.push({
          _id: "5f637350ca5cb62c0cc4cfa6",
          username: "joy123",
        });

        this.setState({
          friends: friends,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        {this.state.friends.length <= 0 ? (
          <h1>You don't have any friends yet.</h1>
        ) : (
          <ul className={classes.FriendsList}>
            {this.state.friends.map(friend => (
              <li key={friend._id}>
                <img className={classes.UserImage} src={userImg} />
                <span className={classes.FriendUsername}>{friend.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Friends;
