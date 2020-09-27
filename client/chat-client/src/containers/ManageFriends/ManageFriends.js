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
        this.setState({
          foundUsers: results.data.foundUsers,
        });
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
      })
      .catch(err => {
        console.log(err);
      });
  };

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

  checkIfFriendAlready = (currentUser, foundUser) => {
    if(currentUser.friends.includes(foundUser._id)) {
      console.log("Already Friends!!!");
      return true;
    }
    return false;
  }

  render() {
    return (
      <currentUserContext.Consumer>
        {currentUser =>
          this.state.pendingFriendRequests === null ? (
            <Spinner />
          ) : (
            <div className={classes.Outer}>
              <div className={classes.pendingRequests}>
                <h3>Pending Friend Requests</h3>
                <ul>
                  {this.state.pendingFriendRequests.map(sender => (
                    <li key={sender._id}>
                      <img className={classes.UserImage} src={userImg} />
                      <span className={classes.SenderUsername}>
                        {sender.username}
                      </span>
                      <button
                        className={classes.AddFriendButton}
                        onClick={() =>
                          this.acceptFriendRequestHandler(sender._id)
                        }
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
                    {this.state.foundUsers.map(foundUser => (
                      <div
                        className={classes.SearchResultItem}
                        key={foundUser._id}
                      >
                        <li>
                          <div className={classes.FoundUserData}>
                            <img className={classes.UserImage} src={userImg} />
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
                              currentUser._id === foundUser._id ||
                              this.checkIfFriendAlready(currentUser, foundUser)
                            }
                          >
                            { this.checkIfFriendAlready(currentUser, foundUser)
                              ? "Already Added" : "Send Friend Request"
                            }
                          </button>
                        </li>
                        <hr className={classes.LineStyle} />
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      </currentUserContext.Consumer>
    );
  }
}

export default ManageFriends;
