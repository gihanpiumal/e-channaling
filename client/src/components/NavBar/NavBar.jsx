import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import { Input, Space } from "antd";

import { RoutesConstant } from "../../assets/constants";
import "./NavBar.css";


const { Search } = Input;

export class NavBar extends Component {
  render() {
    return (
      <div className="nav-bar-wrapper">
        <div className="nav-bar-logo">
          <NavLink className={"nav-bar-log-text"} to={RoutesConstant.home}>
            E-channel
          </NavLink>
        </div>
        <div className="nav-bar-items">
          <ul>
            <li>
              <NavLink
                className={"nav-bar-nav-links"}
                activeStyle={{ color: "#FFD369" }}
                to={RoutesConstant.home}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className={"nav-bar-nav-links"}
                activeStyle={{ color: "#FFD369" }}
                to={RoutesConstant.doctors}
              >
                Doctors
              </NavLink>
            </li>
            <li>
              <NavLink
                className={"nav-bar-nav-links"}
                activeStyle={{ color: "#FFD369" }}
                to={RoutesConstant.pharmacy}
              >
                Pharmacy
              </NavLink>
            </li>
            <li>
              <Search
                placeholder="input search text"
                style={{ width: 200 }}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default NavBar;
