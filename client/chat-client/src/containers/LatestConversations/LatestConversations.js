import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import classes from "./LatestConversations.module.css";
import socketContext from "../../contexts/socketContext";

import axios from "../../axiosInstance";
import Spinner from "../../components/Spinner/Spinner";

class FriendsList extends Component {
  state = {
    friends: null,
  };

  componentDidMount() {
    this.getLatestConversations();
  }

  getLatestConversations = () => {
    axios
      .get("/getLatestConversations")
      .then(result => {
        console.log(result.data.friends);
        const { friends } = result.data;
        console.log("Friends:", friends);
        this.setState({
          friends: friends,
        });
      })
      .catch(err => console.log(err));
  };

  startChat = (currentUser, friendId) => {
    axios
      .post("/getConversationId", {
        currentUser: currentUser,
        friendId: friendId,
      })
      .then(result => {
        let roomId = result.data.conversation._id;
        this.props.setRoomIdHandler(roomId);
        this.context.emit("join", { roomId: roomId });
      })
      .catch(err => console.log(err));

    this.props.closeSideBar();
    this.props.history.push(`/chat/${friendId}`);
  };

  render() {
    {
      return this.state.friends === null ? (
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
              <li
                key={friend._id}
                onClick={() =>
                  this.startChat(this.props.currentUser._id, friend._id)
                }
              >
                <img
                  className={classes.UserImage}
                  src={friend.avatar}
                  alt="Friend Avatar"
                />
                <span className={classes.FriendUsername}>
                  {friend.username}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

FriendsList.contextType = socketContext;
export default withRouter(FriendsList);
