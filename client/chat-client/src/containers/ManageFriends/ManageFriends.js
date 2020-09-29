import React, { Component, Fragment } from "react";
import classes from "./ManageFriends.module.css";


import axios from "../../axiosInstance";
import Spinner from "../../components/Spinner/Spinner";
import currentUserContext from "../../contexts/currentUserContext";
// import defaultUserImg from "../../assets/images/default-user-image.png";

const userImg =
  "https://res.cloudinary.com/pratik2/image/upload/v1600430288/realtimechat/default-user-image_o3qrpf.png";

class ManageFriends extends Component {
  state = {
    pendingFriendRequests: null,
    userSearchBarQuery: "",
    foundUsers: [],
  };

  componentDidMount() {
    this.getPendingRequests();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.userSearchBarQuery !== this.state.userSearchBarQuery &&
      this.state.userSearchBarQuery !== ""
    ) {
      this.getUsers();
    }
  }

  getUsers() {
    axios
      .post("/getUsers", {
        searchQuery: this.state.userSearchBarQuery,
      })
      .then(results => {
        console.log("CONTEXT:", this.context);
        let foundUsers = results.data.foundUsers.map(foundUser => {
          // console.log(foundUser.sentFriendRequests.includes(this.context._id));

          let returnable = {};
          
          if (foundUser.pendingFriendRequests.includes(this.context._id)) {
            console.log("ALREADY SENT!")
            returnable =  {
              ...foundUser,
              requestSent: true
            };
          }
          else if (foundUser.sentFriendRequests.includes(this.context._id)) {
            console.log("ALREADY RECEIVED!");
            returnable = {
              ...foundUser,
              requestReceived: true,
            };
          }
          else {
            returnable = {
              ...foundUser,
              requestSent: false,
              requestReceived: false
            };
          }
          return returnable;
        })
        this.setState({
          foundUsers: foundUsers,
        }, () => console.log(this.state));
      })
      .catch(err => console.log(err));
  }

  getPendingRequests() {
    axios
      .get("/getPendingRequests")
      .then(result => {
        console.log(result.data.pendingFriendRequests);

        this.setState(
          {
            pendingFriendRequests: result.data.pendingFriendRequests,
          },
          () => console.log(this.state)
        );
      })
      .catch(err => console.log(err));
  }

  searchBarChangeHandler = event => {
    this.setState(
      {
        userSearchBarQuery: event.target.value,
      },
      () => {
        if (this.state.userSearchBarQuery === "") {
          this.setState({
            foundUsers: [],
          });
        }
      }
    );
  };

  sendFriendRequestHandler = id => {
    axios
      .post("/addFriend", {
        recipientId: id,
      })
      .then(result => {
        console.log(result);
        this.setState({
          state: this.state
        })
        // this.forceUpdate(); //not recommended but perhaps necessary. Might change later if better solution is
      })
      .catch(err => {
        console.log(err);
      });
  };

  cancelFriendRequest = id => {
    axios
      .post("/cancelFriendRequest", {
        recipientId: id,
      })
      .then(result => {
        console.log(result);
        // this.setState({
        //   f
        // })
      })
      .catch(err => {
        console.log(err);
      });
  }

  acceptFriendRequestHandler = id => {
    axios
      .post("/acceptFriendRequest", {
        senderId: id,
      })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return this.state.pendingFriendRequests === null ? (
      <Spinner />
    ) : (
      <div className={classes.Outer}>
        <div className={classes.pendingRequests}>
          <h3>Pending Friend Requests</h3>
          <ul>
            {this.state.pendingFriendRequests.map(sender => (
              <li key={sender._id}>
                <img className={classes.UserImage} src={sender.avatar} />
                <span className={classes.SenderUsername}>
                  {sender.username}
                </span>
                <button
                  className={classes.AddFriendButton}
                  onClick={() => this.acceptFriendRequestHandler(sender._id)}
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.UserSearchArea}>
          <h2 className={classes.SearchHeader}>Search for a User</h2>
          <input
            className={classes.UserSearchBar}
            type="text"
            value={this.state.userSearchBarQuery}
            onChange={this.searchBarChangeHandler}
          />
          <div className={classes.SearchResults}>
            <ul>
              {this.state.foundUsers.length > 0 &&
                this.state.foundUsers.map(foundUser => (
                  <div className={classes.SearchResultItem} key={foundUser._id}>
                    <li>
                      <div className={classes.FoundUserData}>
                        <img
                          className={classes.UserImage}
                          src={foundUser.avatar}
                        />
                        <span className={classes.FoundUserUsername}>
                          {foundUser.username}
                        </span>
                      </div>

                      
                      <button
                        className={classes.AddFriendButton}
                        onClick={() =>
                          this.sendFriendRequestHandler(foundUser._id)
                        }
                        disabled={
                          this.context._id === foundUser._id ||
                          foundUser.requestSent === true
                        }
                      >
                        {foundUser.requestSent
                          ? "Already Sent"
                          : "Send Friend Request"}
                      </button>
                      {foundUser.requestSent ? (
                        <button 
                        className={classes.AddFriendButton}
                        onClick={ () => this.cancelFriendRequest(foundUser._id) }
                        >
                          Cancel Request
                        </button>
                      ) : null}
                    </li>
                    <hr className={classes.LineStyle} />
                  </div>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

  ManageFriends.contextType = currentUserContext;

  export default ManageFriends;
