import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import socketContext from "./contexts/socketContext";
import currentUserContext from "./contexts/currentUserContext";
import Welcome from './components/Welcome/Welcome';
import Chatwindow from "./containers/Chatwindow/Chatwindow";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./containers/Logout/Logout";
import axios from "./axiosInstance";
import Profile from "./containers/Profile/Profile";
import ManageFriends from "./containers/ManageFriends/ManageFriends";
import io from "socket.io-client";

const socket = io("http://localhost:5000/"); //initiating socket connection
console.log("INSTANCE: ", socket)



class App extends Component {
  state = {
    isLoggedIn: false,
    currentUser: null, //to store current logged in user info
    roomId: null,
    displayWelcome: true
  }

  componentDidMount() {
    this.setAuthStatus()
  }

  setAuthStatus = () => {
    //prevents the navbar resetting to "Logged out" mode after refreshing the page
    axios.get("http://localhost:5000/getAuthStatus")
    .then(result => {
      this.setState({
        isLoggedIn: result.data.authStatus,
        currentUser: result.data.currentUser
      }, () => {
        console.log(this.state.currentUser.friends[0])
        this.joinAllRooms()
      })
    })
    .catch(err => console.log(err))
  }

  loggedInHandler = () => {
    this.setState({
      isLoggedIn: !this.state.isLoggedIn
    })
  }

  setRoomIdHandler = roomId => {
    this.setState({ roomId: roomId });
  }

  joinAllRooms = () => {
    axios.post("/joinAllRooms", { currentUser: this.state.currentUser})
    .then(response => {
      socket.emit("joinAllRooms", { allConvoIds: response.data.allConvoIds });
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <Router>
        <currentUserContext.Provider value={this.state.currentUser}>
          <socketContext.Provider value={socket}>
            <Fragment>
              <Navbar
                isLoggedIn={this.state.isLoggedIn}
                loggedInHandler={this.loggedInHandler}
                setRoomIdHandler={this.setRoomIdHandler}
              />
              <Route path="/" exact>
                <Welcome currentUser={this.state.currentUser} />
              </Route>
              {/* passing socket to chatwindow as a prop (instead of using context) as its already using another context */}
              <Route path="/chat/:friendId" exact>
                <Chatwindow socket={socket} roomId={this.state.roomId} />
              </Route>

              <Route path="/login">
                <Login
                  loggedInHandler={this.loggedInHandler}
                  setAuthStatus={this.setAuthStatus}
                />
              </Route>

              <Route path="/logout">
                <Logout loggedInHandler={this.loggedInHandler} />
              </Route>

              <Route path="/manageFriends">
                <ManageFriends />
              </Route>

              <Route path="/profile">
                <Profile />
              </Route>

              <Route path="/register">
                <Register />
              </Route>
            </Fragment>
          </socketContext.Provider>
        </currentUserContext.Provider>
      </Router>
    );
  }
}

export default App;
