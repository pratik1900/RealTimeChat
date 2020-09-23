import React, { Component } from "react";

import classes from "./Register.module.css";
import axios from "../../axiosInstance";
import { withRouter } from "react-router-dom";

class Register extends Component {
  state = {
    username: {
      value: "",
      errorMsg: null
    },
    email: {
      value: "",
      errorMsg: null
    },
    password: {
      value: "",
      errorMsg: null
    },
    confirmPassword: {
      value: "",
      errorMsg: null
    },
  };

  changeHandler = event => {
    this.setState({
      [event.target.name]: {
        value: event.target.value,
      }
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const payload = {
      username: this.state.username.value,
      email: this.state.email.value,
      password: this.state.password.value,
      confirmPassword: this.state.confirmPassword.value
    };
    this.setState({
      username: {
        value: "",
        errorMsg: null
      },
      email: {
        value: "",
        errorMsg: null
      },
      password: {
        value: "",
        errorMsg: null
      },
      confirmPassword: {
        value: "",
        errorMsg: null
      },
    });
    axios
      .post("/register", payload)
      .then(result => {
        if(result.data.errors){
          //validation failed
          result.data.errors.forEach(errObj => {
            this.setState(prevState => {
              return {
                [errObj.param]: {
                  errorMsg: errObj.msg
                }
              }
            })
          })
        } else {
          //validation passed
          if(result.status === 201) {
            this.props.history.push('/login')
          }
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <form
        className={classes.RegisterForm}
        action="http://localhost:5000/register"
        method="POST"
      >
        <h1 className={classes.FormHeader}>Sign Up</h1>
        <p className={classes.error}>{this.state.username.errorMsg}</p>
        <input
          name="username"
          placeholder="Username"
          type="text"
          value={this.state.username.value}
          onChange={e => this.changeHandler(e)}
        />
        <p className={classes.error}>{this.state.email.errorMsg}</p>
        <input
          name="email"
          placeholder="E-mail"
          type="email"
          value={this.state.email.value}
          onChange={e => this.changeHandler(e)}
        />
        <p className={classes.error}>{this.state.password.errorMsg}</p>
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={this.state.password.value}
          onChange={e => this.changeHandler(e)}
        />
        <p className={classes.error}>{this.state.confirmPassword.errorMsg}</p>
        <input
          name="confirmPassword"
          placeholder="Re-Enter Password"
          type="password"
          value={this.state.confirmPassword.value}
          onChange={e => this.changeHandler(e)}
        />
        <button type="submit" onClick={e => this.submitHandler(e)}>
          Sign Up
        </button>
      </form>
    );
  }
}

export default withRouter(Register);
