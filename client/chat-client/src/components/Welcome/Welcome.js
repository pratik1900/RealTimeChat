import React from 'react';
import classes from './Welcome.module.css'

const Welcome = props => props.isLoggedIn ?
  <div className={classes.Welcome}>
    <h1>Welcome, {props.currentUser !== null ? props.currentUser.username: null}</h1>
  </div>
  : null

export default Welcome
