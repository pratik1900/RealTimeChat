import React, { Component } from "react";
import classes from "./Profile.module.css";

import axios from "../../axiosInstance";

class Profile extends Component {
  state = {
    inEditMode: false,
    userInfo: null,
    newUserInfo: {
      username: "",
      email: "",
    },
    validationErrors: {
      username: {
        errorMsg: "",
      },
      email: {
        errorMsg: ""
      },
    },
  };

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo = () => {
    axios
      .get("/getUserInfo")
      .then(result => {
        this.setState(
          {
            userInfo: result.data.userInfo,
            newUserInfo: {
              username: result.data.userInfo.username,
              email: result.data.userInfo.email,
            },
          },
          () => {
            console.log(this.state);
          }
        );
      })
      .catch(err => console.log(err));
  };

  toggleEditModeHandler = () => {
    this.setState(prevState => {
      return {
        inEditMode: !prevState.inEditMode,
        newUserInfo: {
          username: prevState.userInfo.username,
          email: prevState.userInfo.email,
        },
      };
    });
  };

  onChangeHandler = event => {
    this.setState({
      newUserInfo: {
        ...this.state.newUserInfo,
        [event.target.name]: event.target.value,
      },
    });
  };

  updateProfileInfo = () => {
    axios
      .post("/changeProfileInfo", {
        _id: this.state.userInfo._id,
        username: this.state.newUserInfo.username,
        email: this.state.newUserInfo.email,
      })
      .then(result => {
        console.log(result);
        if (result.data.errors && result.data.errors.length > 0) {
          console.log(result.data.errors);
          result.data.errors.forEach(errObj => {
            this.setState(prevState => {
              return {
                validationErrors: {
                  ...prevState.validationErrors,
                  [errObj.param]: {
                    errorMsg: errObj.msg,
                  },
                },
              };
            });
          });
          setTimeout(() => console.log(this.state), 1000);
        } else {
          if (result.data.successfulUpdate) {
            this.setState(prevState => {
              return {
                userInfo: {
                  ...prevState.userInfo,
                  username: result.data.updatedUser.username,
                  email: result.data.updatedUser.email,
                },
                inEditMode: false,
              };
            });
            setTimeout(() => console.log(this.state), 1000);
          } else {
            console.log("There was a Problem Updating the info.");
          }
        }
      })
      .catch(err => console.log(err));
  };

  renderEditView = () => {
    return (
      <div className={classes.EditArea}>
        <div className={classes.ProfileImg}>
          <img
            src={this.state.userInfo.avatar}
            onClick={this.toggleEditAreaHandler}
          />
        </div>
        <form className={classes.NewInfoForm}>
          <label htmlFor="username">Username</label>
          <p className={classes.ErrorMsg}>{this.state.validationErrors.username.errorMsg}</p>
          <input
            type="text"
            name="username"
            id="username"
            value={this.state.userInfo ? this.state.newUserInfo.username : null}
            onChange={this.onChangeHandler}
          />
          <label htmlFor="email">E-mail</label>
          <p className={classes.ErrorMsg}>{this.state.validationErrors.email.errorMsg}</p>
          <input
            type="email"
            name="email"
            id="email"
            value={this.state.userInfo ? this.state.newUserInfo.email : null}
            onChange={this.onChangeHandler}
          />
        </form>
        <button
          style={{ marginTop: "30%" }}
          className={classes.Btn}
          onClick={this.toggleEditModeHandler}
        >
          Cancel
        </button>
        <button
          style={{ marginTop: "30%" }}
          className={classes.Btn}
          onClick={this.updateProfileInfo}
        >
          Save
        </button>
      </div>
    );
  };

  renderDefaultView = () => {
    return this.state.userInfo ? (
      <div className={classes.DefaultViewContent}>
        <h2>My Account</h2>
        <div className={classes.ProfileDetails}>
          <div className={classes.ProfileImg}>
            <img
              src={this.state.userInfo.avatar}
              onClick={this.toggleEditAreaHandler}
            />
          </div>
          <div className={classes.ProfileCreds}>
            <p>Username: {this.state.userInfo.username}</p>
            <p>E-mail: {this.state.userInfo.email}</p>
          </div>
        </div>
        <button className={classes.Btn} onClick={this.toggleEditModeHandler}>
          Edit
        </button>
      </div>
    ) : null;
  };

  render() {
    return (
      <div className={classes.ProfileData}>
        {this.state.inEditMode
          ? this.renderEditView()
          : this.renderDefaultView()}
      </div>
    );
  }
}

export default Profile;