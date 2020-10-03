import React, { Component } from "react";
import classes from "./Profile.module.css";
import Spinner from "../../components/Spinner/Spinner";

import axios from "../../axiosInstance";

class Profile extends Component {
  state = {
    isLoading: true,
    inEditMode: false,
    userInfo: null,
    newUserInfo: {
      username: "",
      email: "",
    },
    newProfileImage: null,
    validationErrors: {
      username: {
        errorMsg: "",
      },
      email: {
        errorMsg: "",
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
            isLoading: false
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
        newProfileImage: null,
        validationErrors: {
          username: {
            errorMsg: "",
          },
          email: {
            errorMsg: "",
          },
        }
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
    this.setState({ isLoading: true });

    const payload = new FormData();
    payload.append("_id", this.state.userInfo._id);
    payload.append("username", this.state.newUserInfo.username);
    payload.append("email", this.state.newUserInfo.email);

    //checking if new profile img has been set, of so adding that data to payload
    if(this.state.newProfileImage !== null) {
      payload.append(
        "newImg",
        this.state.newProfileImage,
        this.state.newProfileImage.name
      );
    }

    axios
      .post("/changeProfileInfo", payload)
      .then(result => {
        if (result.data.errors && result.data.errors.length > 0) {
          result.data.errors.forEach(errObj => {
            this.setState(prevState => {
              return {
                validationErrors: {
                  ...prevState.validationErrors,
                  [errObj.param]: {
                    errorMsg: errObj.msg,
                  },
                },
                isLoading: false
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
                  avatar: result.data.updatedUser.avatar,
                },
                inEditMode: false,
                isLoading: false
              };
            });
          } else {
            console.log("There was a Problem Updating the info.");
          }
        }
      })
      .catch(err => console.log(err));
  };

  fileSelectedHandler = event => {
    this.setState({
      newProfileImage: event.target.files[0],
    });
  }

  renderEditView = () => {
    if(this.state.isLoading) {
      return <Spinner />
    }
    return (
      <div className={classes.EditArea}>
        <div className={classes.ProfileImgEdit}>
          <label htmlFor="ImageSelector">
            <div data-content="Change Image" className={classes.Overlay}>
              <img src={this.state.userInfo.avatar} alt="Profile Avatar"/>
            </div>
          </label>
          <input
            id="ImageSelector"
            type="file"
            onChange={this.fileSelectedHandler}
          />
        </div>
        <form className={classes.NewInfoForm}>
          <label htmlFor="username">Username</label>
          <p className={classes.ErrorMsg}>
            {this.state.validationErrors.username.errorMsg}
          </p>
          <input
            type="text"
            name="username"
            id="username"
            value={this.state.userInfo ? this.state.newUserInfo.username : null}
            onChange={this.onChangeHandler}
          />
          <label htmlFor="email">E-mail</label>
          <p className={classes.ErrorMsg}>
            {this.state.validationErrors.email.errorMsg}
          </p>
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
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return this.state.userInfo ? (
      <div className={classes.DefaultViewContent}>
        <h2>My Account</h2>
        <div className={classes.ProfileDetails}>
          <div className={classes.ProfileImg}>
            <img src={this.state.userInfo.avatar} alt="Profile Avatar"/>
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