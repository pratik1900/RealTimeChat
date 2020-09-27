import React, { Component, Fragment } from 'react';
import { NavLink, Route } from "react-router-dom";
import classes from "./SideBar.module.css";
import { FaBars } from "react-icons/fa";
import Backdrop from "../Backdrop/Backdrop";
import { IoIosChatbubbles } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import FriendsList from "../../containers/FriendsList/FriendsList";

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

          <div className={classes.SidebarMainContent}>
            <div className={classes.SidebarSectionSelection}>
              <NavLink
                to="/friendsList"
                exact
                className={classes.SidebarSectionBtn}
                activeClassName={classes.Active}
              >
                <FaUserFriends className={classes.SectionIcon} /> Friends
              </NavLink>
              <NavLink
                to="/chats"
                exact
                className={classes.SidebarSectionBtn}
                activeClassName={classes.Active}
              >
                <IoIosChatbubbles className={classes.SectionIcon} /> Chats
              </NavLink>
            </div>
            <div>
              <Route path="/friendsList">
                <FriendsList closeSideBar={this.props.closeSideBar} />
              </Route>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
