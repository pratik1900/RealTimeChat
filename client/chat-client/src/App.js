import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import socketContext from "./socketContext";
import Chatwindow from "./containers/Chatwindow/Chatwindow";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./containers/Logout/Logout";
import axios from "./axiosInstance";
import Friends from "./containers/Friends/Friends";
import Profile from "./containers/Profile/Profile";


class App extends Component {
  state = {
    isLoggedIn: false
  }

  componentDidMount() {
    this.setAuthStatus()
  }

  setAuthStatus() {
    //prevents the navbar resetting to "Logged out" mode after refreshing the page
    axios.get("http://localhost:5000/getAuthStatus")
    .then(result => {
      this.setState({
        isLoggedIn: result.data.authStatus
      })
    })
    .catch(err => console.log(err))
  }

  loggedInHandler = () => {
    this.setState({
      isLoggedIn: !this.state.isLoggedIn
    })
  }

  render() {
    return (
      <Router>
        <socketContext.Provider>
          <Fragment>
            <Navbar
              isLoggedIn={this.state.isLoggedIn}
              loggedInHandler={this.loggedInHandler}
            />
            
            <Route path="/" exact>
              <Chatwindow />
            </Route>

            <Route path="/login">
              <Login loggedInHandler={this.loggedInHandler} />
            </Route>

            <Route path="/logout">
              <Logout loggedInHandler={this.loggedInHandler} />
            </Route>

            <Route path="/friends">
              <Friends />
            </Route>

            <Route path="/profile">
              <Profile />
            </Route>

            <Route path="/register">
              <Register />
            </Route>

          </Fragment>
        </socketContext.Provider>
      </Router>
    );
  }
}

export default App;
