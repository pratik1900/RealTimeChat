import React, { Component } from "react";
import { Link } from "react-router-dom";
import classes from "./FriendsList.module.css";


import axios from "../../axiosInstance";
import Spinner from "../../components/Spinner/Spinner";
// import defaultUserImg from "../../assets/images/default-user-image.png";

const userImg =
  "https://res.cloudinary.com/pratik2/image/upload/v1600430288/realtimechat/default-user-image_o3qrpf.png";

class FriendsList extends Component {
  state = {
    friends: null,
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
        console.log("Friends:",friends)
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
    { return this.state.friends === null ? (
      <Spinner />
    ) : (
      <div className={classes.FriendsList}>
        <div onClick={this.props.closeSideBar}>
          <Link to="/manageFriends" className={classes.PersonSearchBtn}>
            Manage Friends
          </Link>
        </div>
        <hr className={classes.LineStyle} />
        <ul>
          {this.state.friends.map(friend => (
            <li key={friend._id}>
              <img className={classes.UserImage} src={userImg} />
              <span className={classes.FriendUsername}>{friend.username}</span>
            </li>
          ))}
        </ul>
      </div>
    );
    }
  }
}

export default FriendsList;
