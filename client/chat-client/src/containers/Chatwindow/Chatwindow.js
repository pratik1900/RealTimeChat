import React, { Component, Fragment } from "react";
import classes from "./Chatwindow.module.css";
import axios from '../../axiosInstance';
import { MdSend } from "react-icons/md";
import { withRouter } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import currentUserContext from "../../contexts/currentUserContext";

class Chatwindow extends Component {
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
  }

  state = {
    isLoading: true,
    textHistory: null,
    inputValue: "",
    friendInfo: null,
  };

  getConversations = () => {
    axios
      .post("/getPrivateConversation", {
        participants: [this.context._id, this.props.match.params.friendId],
      })
      .then(results => {
        this.setState({
          textHistory: results.data.textHistory.messages,
          friendInfo: results.data.friendInfo,
          isLoading: false,
        });
        this.scrollToBottom();
      }, console.log(this.state))
      .catch(err => console.log(err));
  };

  componentDidMount() {
    this.getConversations();
    console.log(this.props);

    this.props.socket.on("message", socket => {
      this.getConversations();
    });
  }

  changeHandler = event => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  sendHandler = event => {
    event.preventDefault();
    axios
      .post("/sendText", {
        sender: this.context._id,
        recipient: this.props.match.params.friendId,
        msg: this.state.inputValue,
      })
      .then(response => {
        console.log(response.data);

        //display latest chat state to recipient in real-time
        this.props.socket.emit("message", {
          sender: this.context._id,
          recipient: this.props.match.params.friendId,
          roomId: this.props.roomId,
          msg: this.state.inputValue,
        });

        this.setState(prevState => {
          return {
            inputValue: "",
          };
        });
        //loads latest chat state for sender
        this.getConversations();
      })
      .catch(err => console.log(err));
  };

  enterKeySendHandler = event => {
    // event.preventDefault();
    let x = event.charCode || event.keyCode;
    if (x == 13) {
      // Enter is 13
      this.sendHandler(event);
    } else {
      this.changeHandler(event);
    }
  };

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    return this.state.isLoading ? (
      <Spinner />
    ) : (
      <div className={classes.Chatwindow}>
        <div className={classes.chatHeader}>
          <img
            className={classes.FriendImage}
            src={this.state.friendInfo.avatar}
            alt="Friend Avatar"
          />
          <h3>{this.state.friendInfo.username}</h3>
        </div>
        <div className={classes.chatHistory}>
          <ul>
            {this.state.textHistory.map((text, index) => (
              <li key={index} className={classes.textMsg}>
                <div
                  className={
                    text.sender === this.context._id
                      ? classes.sentText
                      : classes.receivedText
                  }
                >
                  {
                    <Fragment>
                      <h5 className={classes.senderTitle}>
                        {text.sender === this.context._id
                          ? "You"
                          : this.state.friendInfo.username}
                      </h5>
                      <p>{text.text}</p>
                    </Fragment>
                  }
                </div>
              </li>
            ))}
            <div ref={this.messagesEndRef} />
          </ul>
        </div>
        <div className={classes.textForm}>
          <input
            className={classes.textBox}
            type="text"
            onKeyPress={e => this.enterKeySendHandler(e)}
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
