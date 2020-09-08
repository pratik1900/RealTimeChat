import React, { Component } from "react";
import classes from "./Chatwindow.module.css";
import axios from '../../axiosInstance';

class Chatwindow extends Component {
  state = {
    textMsg: ''
  }

  componentDidMount() {
    axios.get('/')
    .then(result => {
      //get text history
    })
    .catch(err => {
      // if(err.response.status === 401) {
      //   //Not authenticated, redirecting to Login page.
      //   this.props.history.replace('/login');
      // } else {
      //   console.log(err);
      // }
    })
  }

  changeHandler = event => {
    this.setState({
      textMsg: event.target.value,
    });
  }

  sendHandler = event => {
    event.preventDefault();
    axios.post('/', {
      msg: this.state.textMsg
    })
    .then(response => { 
      console.log(response.data);
      this.setState(prevState => {
        return {
          textMsg: ''
        }
      })
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className={classes.Chatwindow}>
        <form className={classes.textForm} action="">
          <input
            className={classes.textBox}
            type="text"
            onChange={ e => this.changeHandler(e)}
            value={this.state.textMsg}
          />
          <button 
            className={classes.sendButton}
            onClick={ e => this.sendHandler(e) }
          >
            Send
          </button>
        </form>
      </div>
    );
  }
}

export default Chatwindow;
