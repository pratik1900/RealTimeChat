import React, { Fragment } from 'react';

import NavItems from './NavItems/NavItems';
import Logo from './Logo/Logo';
import classes from './Navbar.module.css'

const Navbar = () => {
  return (
    <div className={classes.Navbar}>
      <span>
        <Logo />
      </span>
      <nav>
        <NavItems />
      </nav>
    </div>
  );
}

export default Navbar;
