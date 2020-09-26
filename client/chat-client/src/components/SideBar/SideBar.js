import React, { Component, Fragment } from 'react';
import classes from "./SideBar.module.css";
import { FaBars } from "react-icons/fa";
import Backdrop from "../Backdrop/Backdrop";

export default class SideBar extends Component {
  attachedClasses = [classes.SideBar, classes.Close];

  componentDidMount() {
    if (this.props.showSidebar === true) {
      console.log("ComponentDidMount: SIDEBAR:", this.props.showSidebar);
      this.attachedClasses = [classes.SideBar, classes.Open];
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.showSidebar !== this.props.showSidebar) { 
      if(this.props.showSidebar === true){
      console.log("ComponentDidUpdate: SIDEBAR:", this.props.showSidebar);
        this.attachedClasses = [classes.SideBar, classes.Open];
      }
    // }
  }

  render() {
    return (
      <Fragment>
        {this.props.showSidebar ? <Backdrop closeSideBar={this.props.closeSideBar} /> : null }
        <div className={this.attachedClasses.join(" ")} >
          <div>
            <FaBars className={classes.HamburgerIcon} onClick={this.props.toggleSideBar} />
          </div>
          <h2>Sidebar</h2>
        </div>
      </Fragment>
    );
  }
}
