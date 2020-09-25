import classes from "./Friends.module.css";
import React, { Component, Fragment } from "react";

import axios from "../../axiosInstance";
import Spinner from "../../components/Spinner/Spinner";
import currentUserContext from "../../contexts/currentUserContext";
// import defaultUserImg from "../../assets/images/default-user-image.png";

const userImg =
  "https://res.cloudinary.com/pratik2/image/upload/v1600430288/realtimechat/default-user-image_o3qrpf.png";

class Friends extends Component {
  state = {
    friends: [],
    friendSearchBarQuery: "",
    foundUsers: [],
  };

  componentDidMount() {
    this.getFriends();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.friendSearchBarQuery !== this.state.friendSearchBarQuery && this.state.friendSearchBarQuery !== "") {
      this.getUsers();
    }
  }

  getUsers() {
    axios.post("/getUsers", {
      searchQuery: this.state.friendSearchBarQuery
    })
    .then(results => {
      this.setState({
        foundUsers: results.data.foundUsers
      })
    })
    .catch(err => console.log(err))
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

  searchBarChangeHandler = event => {
    this.setState({
      friendSearchBarQuery: event.target.value
    }, () => {
      if(this.state.friendSearchBarQuery === "") {
        this.setState({
          foundUsers: []
        })
      }
    });
  }

  sendFriendRequestHandler = id => {
    console.log(id);
    axios.post("/addFriend", {
      recipientId: id
    })
    .then(result =>  {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return
    <currentUserContext.Consumer>
    { currentUser => {
      return this.state.friends.length <= 0 ? (
        <Spinner />
      ) : (
        <div className={classes.Outer}>
          <div className={classes.FriendsList}>
            <ul>
              {this.state.friends.map(friend => (
                <li key={friend._id}>
                  <img className={classes.UserImage} src={userImg} />
                  <span className={classes.FriendUsername}>
                    {friend.username}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={classes.FriendSearchArea}>
            <input
              className={classes.FriendSearchBar}
              type="text"
              value={this.state.friendSearchBarQuery}
              onChange={this.searchBarChangeHandler}
            />
            <div className={classes.SearchResults}>
              <ul>
                {this.state.foundUsers.map(foundUser => (
                  <div className={classes.SearchResultItem} key={foundUser._id}>
                    <li>
                      <div className={classes.FoundUserData}>
                        <img className={classes.UserImage} src={userImg} />
                        <span className={classes.FoundUserUsername}>
                          {foundUser.username}
                        </span>
                      </div>

                      <button
                        className={classes.AddFriendButton}
                        onClick={() => this.sendFriendRequestHandler(foundUser._id)}
                        disabled={currentUser}
                      >
                        Send Friend Request
                      </button>
                    </li>
                    <hr className={classes.LineStyle} />
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }}
    </currentUserContext.Consumer>
  }
}

export default Friends;
