import React, { Component, Fragment } from 'react';
import classes from "./SideBar.module.css";
import { FaBars } from "react-icons/fa";
import Backdrop from "../Backdrop/Backdrop";

export default class SideBar extends Component {
  state = {
    attachedClasses: [classes.SideBar, classes.Close],
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.showSidebar !== this.props.showSidebar) {
      console.log("ComponentDidUpdate: SIDEBAR:", this.props.showSidebar);
      if (this.props.showSidebar === true) {
        this.setState(prevState => {
          return {
            attachedClasses : [classes.SideBar, classes.Open]
          }
        });
      } else {
        this.setState(prevState => {
          return {
            attachedClasses: [classes.SideBar, classes.Close]
          }
        });
      }
    }
  }

  render() {
    return (
      <Fragment>
        {this.props.showSidebar ? (
          <Backdrop closeSideBar={this.props.closeSideBar} />
        ) : null}
        <div className={this.state.attachedClasses.join(" ")}>
          <div>
            <FaBars
              className={classes.HamburgerIcon}
              onClick={this.props.toggleSideBar}
            />
          </div>
          <h2>Sidebar</h2>
        </div>
      </Fragment>
    );
  }
}
