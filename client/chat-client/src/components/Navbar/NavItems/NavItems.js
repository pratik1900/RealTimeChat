import React, { Fragment } from 'react';

import NavItem from './NavItem/NavItem';
import classes from './NavItems.module.css';

const NavItems = props => {
  return (
    <ul className={classes.NavItems}>
      <NavItem link="/" exact>
        Home
      </NavItem>
      {props.isLoggedIn ? (
        <Fragment>
          <NavItem link="/friends">Friends</NavItem>
          <NavItem link="/logout">Logout</NavItem>
        </Fragment>
      ) : (
        <Fragment>
          <NavItem link="/login">Login</NavItem>
          <NavItem link="/register">Register</NavItem>
        </Fragment>
      )}
    </ul>
  );
}

export default NavItems;
