import { NavLink } from 'react-router-dom';

import React from 'react';
import classes from './NavItem.module.css';

const NavItem = props => {
  return (
    <li className={classes.NavItem}>
      <NavLink 
        to={props.link} 
        exact={props.exact}
        activeClassName={classes.active}
        className={classes.NavLink}
      >
        {props.children}
      </NavLink>
    </li>
  )
}

export default NavItem;
