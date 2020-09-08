import React from 'react';

import NavItem from './NavItem/NavItem';
import classes from './NavItems.module.css';

const NavItems = () => {
  return (
    <ul className={classes.NavItems}>
      <NavItem link='/' exact>Home</NavItem>
      <NavItem link='/login'>Login</NavItem>
      <NavItem link='/register'>Register</NavItem>
    </ul>
  )
}

export default NavItems;
