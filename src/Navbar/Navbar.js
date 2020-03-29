import React, { Component } from "react";
import "./Navbar.css";
class Navbar extends Component {
  render() {
    return (
      <div>
        <header className="main-header">
          <div className="container">
            <h1 className="mh-logo">Chapi-chapau</h1>
            <nav className="main-nav">
              <ul className="main-nav-list">
                <li>
                  <a href="#">Rules</a>
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
