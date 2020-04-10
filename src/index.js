import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import Landing from "./Landing";
import Startpage from "./Startpage/Startpage";

import { createStore, applyMiddleware } from "redux";
import rootReducer from "./Reducers/Reducers";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import promiseMiddleware from "redux-promise";
import { compose } from "redux";

import thunk from "redux-thunk";
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk, promiseMiddleware))
  );
}
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Landing />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
