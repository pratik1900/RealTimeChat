import React, { Component } from "react";

import classes from "./Login.module.css";
import axios from "../../axiosInstance";

class Login extends Component {
  state = {
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
        console.log(result);
        
      }
    })
    .catch(err => console.log("ERROR", err))
  }

  render() {
    return (
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

export default Login;
