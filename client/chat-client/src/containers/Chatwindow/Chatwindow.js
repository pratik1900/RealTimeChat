import React, { Component } from "react";
import classes from "./Chatwindow.module.css";
import axios from '../../axiosInstance';
import { MdSend } from "react-icons/md";
import { withRouter } from "react-router-dom";
import currentUserContext from "../../contexts/currentUserContext";

class Chatwindow extends Component {
  state = {
    textHistory: [
      "hey there :D",
      "how're you doing?",
      "I'm great, thanks. How about you?",
    ],
    inputValue: "",
  };

  getConversations = () => {
    axios.post("/getPrivateConversation", {
      participants: [
        this.context._id,
        this.props.match.params.friendId
      ]
    })
    .then(results => {
      this.setState({
        textHistory: results.data.textHistory.messages
      })
    }, console.log(this.state))
    .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getConversations();
  }

  changeHandler = event => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  sendHandler = event => {
    event.preventDefault();
    axios.post('/sendText', {
      sender: this.context._id,
      recipient: this.props.match.params.friendId,
      msg: this.state.inputValue
    })
    .then(response => {
      console.log(response.data);
      this.setState(prevState => {
        return {
          // textHistory: [...prevState.textHistory, `${prevState.inputValue}`],
          inputValue: ""
        }
      })
      this.getConversations();
    })
    .catch(err => console.log(err))
  };

  // enterKeySendHandler = event => {
  //   event.preventDefault();
  //   if (!event.key === "Enter") {
  //     return;
  //   } else {
  //     this.sendHandler(event)
  //   }
  // }

  render() {
    return (
      <div className={classes.Chatwindow}>
        <div className={classes.chatHeader}>
          <h3>Friend Name</h3>
        </div>
        <div className={classes.chatHistory}>
          <ul>
            {this.state.textHistory.map(text => (
              <li>
                <div className={text.sender === this.context._id ? classes.sentText : classes.receivedText }>{text.text}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.textForm}>
          <input
            className={classes.textBox}
            type="text"
            // onKeyPress={ (e) => { if (e.keyCode===13){ this.enterKeySendHandler() }}}
            onChange={e => this.changeHandler(e)}
            value={this.state.inputValue}
          />
          <button
            className={classes.sendButton}
            onClick={e => this.sendHandler(e)}
          >
            <MdSend style={{ fontSize: "34px" }} />
          </button>
        </div>
      </div>
    );
  }
}

Chatwindow.contextType = currentUserContext;

export default withRouter(Chatwindow);
