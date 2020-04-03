import React, { Component } from "react";
import "./Navbar.css";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
class Navbar extends Component {
  render() {
    return (
      <div>
        <header className="main-header">
          <div className="container">
            <li>
              <NavLink exact to="/">
                <h1 className="mh-logo">Chapi-chapau</h1>
              </NavLink>
            </li>
            <nav className="main-nav">
              <ul className="main-nav-list">
                <li>
                  <NavLink to="/rules">Rules</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    );
  }
}

export default Navbar;
