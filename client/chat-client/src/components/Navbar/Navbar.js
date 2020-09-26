import React, { Component } from 'react';

import NavItems from './NavItems/NavItems';
import Logo from './Logo/Logo';
import { FaBars, FaClosedCaptioning } from "react-icons/fa";
import classes from './Navbar.module.css';
import Sidebar from "../SideBar/SideBar";

class Navbar extends Component {
  state = {
    showSidebar: false
  }

  // DELETE
  componentDidMount() {
    console.log(this.state  );
  }

  toggleSideBar = () => {
    this.setState(
      prevState => {
        return {
          showSidebar: !prevState.showSidebar,
        };
      }, () => console.log(this.state)
    );
  }

  closeSideBar = () => {
    this.setState(prevState => {
      return {
        showSidebar: false,
      };
    },() => console.log(this.state));
  }

  render() {
    return (
      <div className={classes.Navbar}>
        <span style={{ "cursor": "pointer" }}>
          <FaBars
            className={classes.HamburgerIcon}
            onClick={this.toggleSideBar}
          />
        </span>
        <Sidebar 
          toggleSideBar={this.toggleSideBar} 
          closeSideBar={this.closeSideBar}
          showSidebar={this.state.showSidebar} 
        />
        <nav>
          <NavItems isLoggedIn={this.props.isLoggedIn} />
        </nav>
      </div>
    );
  }
}

export default Navbar;
