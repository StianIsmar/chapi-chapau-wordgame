import React, { Component } from "react";
import App from "./App";
import Rules from "./Rules/Rules";
import { Router, Switch, Route } from "react-router-dom";
import Startpage from "./Startpage/Startpage";
import history from "./history.js";

class Landing extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Startpage} />
          <Route exact path="/rules" component={Rules} />
          <Route exact path="/play" component={App} />
        </Switch>
      </Router>
    );
  }
}
export default Landing;
