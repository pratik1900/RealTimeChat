import React, { Component, Fragment } from "react";
import classes from "./Chatwindow.module.css";
import axios from '../../axiosInstance';
import { MdSend } from "react-icons/md";
import { BsCheck, BsCheckAll } from "react-icons/bs";
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
    roomId: null,
    inputValue: "",
    friendInfo: null,
    isTyping: false,
    typingTimeout: null,
    otherPersonIsTyping: false,
  };

  getConversations = (shouldScroll = false) => {
    axios
      .post("/getPrivateConversation", {
        participants: [this.context._id, this.props.match.params.friendId],
      })
      .then(results => {
        this.setState({
          roomId: results.data.roomId,
          textHistory: results.data.textHistory.messages,
          friendInfo: results.data.friendInfo,
          isLoading: false,
        }, () => { this.setTextStatusToSeenAll(this.state.friendInfo._id,this.context._id,this.state.roomId) });
        this.scrollToBottom(shouldScroll);
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    this.getConversations(true);


    //SETTING UP SOCKET LISTENERS
    this.props.socket.on("message", socket => {
      const { sender, recipient, roomId, msg, msgId } = socket;
      this.setTextStatusToSeen(sender, recipient, roomId,  msg, msgId);
      this.getConversations();
    });

    this.props.socket.on("typingStatusChange", socket => {
      console.log("OTHER PERSON:", socket);
      this.setState({
        otherPersonIsTyping: socket.typingStatus,
      });
    });

    this.props.socket.on("setTextStatusToSeen", socket => {
      this.getConversations();
    });

    this.props.socket.on("setTextStatusToSeenAll", socket => {
      this.getConversations();
    });
    // --*--
  }

  componentWillUnmount() {
    //Removing Listeners
    this.props.socket.off("message")
    this.props.socket.off("typingStatusChange");
    this.props.socket.off("setTextStatusToSeen");
    this.props.socket.off("setTextStatusToSeenAll");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isTyping !== prevState.isTyping) {
      this.props.socket.emit("typingStatusChange", {
        typingStatus: this.state.isTyping,
        roomId: this.props.roomId,
      });
    }
  }

  changeHandler = event => {
    //debouncing
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      inputValue: event.target.value,
      isTyping: true,
      typingTimeout: setTimeout(() => {
        this.setState({
          isTyping: false,
        });
      }, 1000),
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
        //display latest chat state to recipient in real-time
        this.props.socket.emit("message", {
          sender: this.context._id,
          recipient: this.props.match.params.friendId,
          roomId: this.props.roomId,
          msg: this.state.inputValue,
          msgId: response.data.msgId,
        });

        this.setState(prevState => {
          return {
            inputValue: "",
          };
        });
        //loads latest chat state for sender
        this.getConversations();
      })
      .catch(err => console.log("CAUGHT:", err));
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

  scrollToBottom = (shouldScroll = false) => {
    if(shouldScroll) {
      this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  setTextStatusToSeen = (sender, recipient, roomId, msg, msgId) => {
    // set status to seen
    axios.post("/setTextStatustoSeen", {
      sender: sender,
      recipient: recipient,
      roomId: roomId,
      msg: msg,
      msgId: msgId
    })
    .then(result => {
      this.props.socket.emit("setTextStatusToSeen", {
        sender: sender,
        recipient: recipient,
        roomId: roomId,
        msg: msg,
        msgId: msgId,
      });
    })
    .catch(err => console.log(err))
  };

  setTextStatusToSeenAll = (sender, recipient, roomId) => {
    // set status to seen
    axios.post("/setTextStatustoSeenAll", {
      sender: sender,
      recipient: recipient,
      roomId: roomId
    })
    .then(result => {
      this.props.socket.emit("setTextStatusToSeenAll", {
        sender: sender,
        recipient: recipient,
        roomId: roomId,
      });
    })
    .catch(err => console.log(err))
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
                      <div className={classes.friendPicAndNameDiv}>
                        <img
                          className={classes.smallFriendPic}
                          src={
                            text.sender === this.context._id
                              ? this.context.avatar
                              : this.state.friendInfo.avatar
                          }
                          alt={
                            text.sender === this.context._id
                              ? "Your Pic"
                              : "Friend Pic"
                          }
                        />
                        <h5 className={classes.senderTitle}>
                          {text.sender === this.context._id
                            ? "You"
                            : this.state.friendInfo.username}
                        </h5>
                      </div>
                      <p>{text.text}</p>
                      <p>
                        {text.sender === this.context._id ? (
                          text.status === "seen" ? (
                            <BsCheckAll style={{ color: "#0084ff", marginLeft: "90%" }} />
                          ) : (
                            <BsCheck style={{ marginLeft: "90%" }} />
                          )
                        ) : null}
                      </p>
                    </Fragment>
                  }
                </div>
              </li>
            ))}
            <div className={classes.TypingIndicator}>
              {this.state.otherPersonIsTyping
                ? `${this.state.friendInfo.username} is typing...`
                : ""}
            </div>
          </ul>
          <div ref={this.messagesEndRef}></div>
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
