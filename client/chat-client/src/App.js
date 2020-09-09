import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from "socket.io-client";
import socketContext from "./socketContext";
import Chatwindow from "./containers/Chatwindow/Chatwindow";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import axios from './axiosInstance';

const socket = io("http://localhost:5000/");

socket.on("login", data => {
  console.log(data);
  console.log(socket.id);
});

class App extends Component {
  componentDidMount() {
    axios.get("http://localhost:5000/", { withCredentials: true })
    .then(result => {
      console.log(result.data);
    });
  }
  render() {
    return (
      <Router>
        <socketContext.Provider value={socket}>
          <Fragment>
            <Navbar />
            <Route path="/" exact component={Chatwindow} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Fragment>
        </socketContext.Provider>
      </Router>
    );
  }
}

export default App;
