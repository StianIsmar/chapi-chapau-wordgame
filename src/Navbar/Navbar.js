import React, { Component } from "react";
import "./Navbar.css";
class Navbar extends Component {
  render() {
    return (
      <div>
        <header class="main-header">
          <div class="container">
            <h1 class="mh-logo">Chapi-chapau</h1>
            <nav class="main-nav">
              <ul class="main-nav-list">
                <li>
                  <a href="#">Rules</a>
                </li>
                <li>
                  <a href="#">About the game</a>
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
