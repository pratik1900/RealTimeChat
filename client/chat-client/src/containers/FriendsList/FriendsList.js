import React, { Component } from "react";
import { Link } from "react-router-dom";
import classes from "./FriendsList.module.css";
import socketContext from "../../contexts/socketContext";


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

  getFriends = () => {
    axios
    .get("/getFriends")
    .then(result => {
      console.log(result.data.friends);
      const { friends } = result.data;
      console.log("Friends:",friends)
      this.setState({
        friends: friends,
      });
    })
    .catch(err => console.log(err));
  }

  startChat = friendId => {
    this.context.emit("startChat", { person: friendId });
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
            <li key={friend._id} onClick={ () => this.startChat(friend._id) } >
              <img className={classes.UserImage} src={friend.avatar} />
              <span className={classes.FriendUsername}>{friend.username}</span>
            </li>
          ))}
        </ul>
      </div>
    );
    }
  }
}

FriendsList.contextType = socketContext;
export default FriendsList;
