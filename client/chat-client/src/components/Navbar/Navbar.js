import React from 'react';

import NavItems from './NavItems/NavItems';
import Logo from './Logo/Logo';
import classes from './Navbar.module.css'

const Navbar = props => {
  return (
    <div className={classes.Navbar}>
      <span>
        <Logo />
      </span>
      <nav>
        <NavItems isLoggedIn={props.isLoggedIn} />
      </nav>
    </div>
  );
}

export default Navbar;
