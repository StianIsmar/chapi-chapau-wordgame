import React, { Component } from "react";
import App from "./App";
import Rules from "./Rules/Rules";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/rules" component={Rules} />
          <Route exact path="/" component={App} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Landing;
