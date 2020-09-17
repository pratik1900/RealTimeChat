import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import socketContext from "./socketContext";
import Chatwindow from "./containers/Chatwindow/Chatwindow";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./containers/Logout/Logout";


class App extends Component {
  state = {
    isLoggedIn: false
  }

  // componentDidMount() {
  //   console.log(document.cookie)
  // }

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
