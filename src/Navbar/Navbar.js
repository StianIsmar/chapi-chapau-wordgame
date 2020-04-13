import React, { Component } from "react";
import "./Navbar.css";
import { Router, NavLink } from "react-router-dom";
import { connect } from "react-redux";

class Navbar extends Component {
  render() {
    return (
      <div>
        <header className="main-header">
          <div className="nav-container">
            <li>
              <NavLink exact to="/">
                <h1 className="mh-logo">Chapi-chapeau</h1>
              </NavLink>
              <h4>Your game pin: {this.props.globalGameId}</h4>
            </li>
            <nav className="main-nav">
              <ul className="main-nav-list">
                <li>
                  <NavLink to="/rules">
                    <h1 className="rules">Rules</h1>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    );
  }
}
function mapStateToProps(state) {
  console.log("mapStateToProps", state);
  return {
    globalGameId: state.globalGameId,
    globalGameKey: state.globalGameKey,
  };
}

export default connect(mapStateToProps, null)(Navbar);
