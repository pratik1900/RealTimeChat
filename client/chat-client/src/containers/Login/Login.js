import React, { Component } from "react";

import classes from "./Login.module.css";
import axios from "../../axiosInstance";
import Spinner from "../../components/Spinner/Spinner";
import { withRouter } from "react-router-dom";

class Login extends Component {
  state = {
    isLoading: false,
    username: {
      value: "",
      errorMsg: null
    },
    password: {
      value: "",
      errorMsg: null
    },
  };

  changeHandler = event => {
    this.setState({
      [event.target.name] : {
        value: event.target.value
      }
    });
  }

  submitHandler = event => {
    event.preventDefault();
    this.setState({
      isLoading: true
    });
    const payload = {
      username: this.state.username.value,
      password: this.state.password.value
    };
    this.setState({
      username: {
        value: "",
        errorMsg: null,
      },
      password: {
        value: "",
        errorMsg: null,
      },
    });
    axios.post('/login', payload)
    .then(result => {
      if(result.data.errors) {
        //validation fail
        result.data.errors.forEach(errObj => {
          this.setState(prevState => {
            return {
              [errObj.param]: {
                errorMsg: errObj.msg
              } 
            }
          })
        })
      } 
      else {
        //validation pass
        console.log('validation pass!');
        //wrong credentials (username)
        if(result.status === 401 && result.error) {
          this.setState({
            [result.error.field] : result.error.msg
          })
        }
        if(result.status === 200) {
          this.setState({
            isLoading: false
          })
          this.props.history.replace("/");
          this.props.loggedInHandler();
          this.props.setAuthStatus()

        }
      }
    })
    .catch(err => {
      //wrong credentials (password)
      // if (err.response.status === 401 && err.response.data.error) {
      //   this.setState({
      //     [err.response.data.error.field]: {
      //       errorMsg : err.response.data.error.msg,
      //     }
      //   });
      // }
    })
  }

  render() {
    return this.state.isLoading ? <Spinner /> : (
      <form
        className={classes.LoginForm}
        action="http://localhost:5000/login"
        method="POST"
      >
        <h1 className={classes.FormHeader}>Log In</h1>
        <p className={classes.error}>{this.state.username.errorMsg ? this.state.username.errorMsg : null }</p>
        <input
          name="username"
          placeholder="Username"
          type="text"
          value={this.state.username.value}
          onChange={e => this.changeHandler(e)}
        />
        <p className={classes.error}>{this.state.password.errorMsg ? this.state.password.errorMsg : null }</p>
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={this.state.password.value}
          onChange={e => this.changeHandler(e)}
        />
        <p>
          Forgot Password? <a href="/reset-password">Click Here</a>
        </p>

        <button type="submit" onClick={e => this.submitHandler(e)}>
          Log In
        </button>
      </form>
    );
  }
}

export default withRouter(Login);
