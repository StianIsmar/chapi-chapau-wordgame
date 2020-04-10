import React, { Component } from "react";
import { Route, Link, Switch, withRouter, matchPath } from "react-router-dom";
import "./Rules.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

class Rules extends Component {
  render() {
    return (
      <div className="rules-container row">
        <NavLink className="arrowback" exact to="/play">
          <ArrowBackIcon className="arrow" />
        </NavLink>
        <div>
          <header className="column">
            <h1>Rules</h1>
          </header>

          <ol>
            <li>Add words to database</li>
            <li>Get word when it's your turn</li>
          </ol>
        </div>
      </div>
    );
  }
}

export default Rules;
