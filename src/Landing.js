import React, { Component } from "react";
import App from "./App";
import Rules from "./Rules/Rules";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Startpage from "./Startpage/Startpage";

class Landing extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/rules" component={Rules} />
          <Route exact path="/" component={Startpage} />
          <Route exact path="/play" component={App} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Landing;
