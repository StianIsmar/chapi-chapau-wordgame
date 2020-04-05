import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Startpage.css";
import firebase from "firebase/app";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { compose } from "redux";
import { setGameId } from "../Actions/actions";
import Button from "@material-ui/core/Button";
import { DB_CONFIG } from "../Config/config";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch"
  }
}));

class Startpage extends Component {
  constructor(props) {
    super(props);
    this.state = { gameObj: { key: null, gameId: null }, testing: false };
    if (!firebase.apps.length) {
      firebase.initializeApp(DB_CONFIG);
    }
    firebase.database.enableLogging(false);

    this.gameIds = firebase
      .database()
      .ref()
      .child("gameIds");
  }
  getLargestGameIdInDb = () => {
    var myPromise = new Promise((resolve, reject) => {
      this.gameIds
        .orderByChild("gameId")
        .limitToLast(1)
        .once("value", function(snap) {
          snap.forEach(child => {
            let filteredObj = child.val().gameId;
            console.log(child.val().gameId);
            resolve(filteredObj);
          });
        });
    });
    return myPromise;
  };

  handleNewGame = async () => {
    // Function fired when new game button is pressed!
    let a = await this.checkIfEmptyDb();
    if (a === false) {
      this.sendNew(0, this.handleState); // setting the new game id to 0.
    }
    if (a === true) {
      console.log("The db exists!");
      try {
        this.updateAndSendNew(this.sendNew);
      } catch (e) {
        console.log("Make sure word is filled in");
      }
    }
  };

  checkIfEmptyDb = async => {
    var ref = firebase.database().ref("gameIds");
    // Return value of the promise
    return ref.once("value").then(snapshot => {
      const a = snapshot.exists();
      return a;
    });
  };

  // callback func
  updateAndSendNew = async callback => {
    this.getLargestGameIdInDb().then(newId => {
      let newGameId = newId + 1; // adding one to the larges gameId in the db
      callback(newGameId, this.handleState);
    });
  };
  sendNew = async (newId, callback) => {
    await callback(newId); // This is completed first before routing to the playing app.
    this.routingFunction();
  };
  handleState = async newId => {
    try {
      var newRef = this.gameIds.push();
      var newKey = newRef.key;
      console.log(newKey, newId);
      newRef.set({ gameId: newId }).then(() => {
        console.log("add to redux state!");
        this.props.changeGlobalId(newId, newKey); // updating store
        this.setState(
          {
            testing: true,
            gameObj: {
              gameId: newId,
              key: newKey
            }
          },
          () => {
            console.log("New state:", this.state);
          }
        );
      });
    } catch (e) {
      console.log("Game update not pushed to firebase");
    }
  };

  // I need to make sure this one is called after all those other ones!
  routingFunction = () => {
    this.props.history.push("/play");
  };

  render() {
    return (
      <div className="wrapper">
        <div>
          <header className="main-header">
            <div className="container">
              <h1 className="mh-logo">Chapi-chapau</h1>
              <nav className="main-nav">
                <ul className="main-nav-list"></ul>
              </nav>
            </div>
          </header>
        </div>
        <div className="container">
          <div className="join">
            <div>Join existing game</div>
            <TextField
              id="outlined-full-width"
              style={{ margin: 8 }}
              placeholder="GAME PIN + ENTER"
              helperText="Full width!"
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />
          </div>

          <div className="new">
            <div>Generate new game pin</div>
            <Button
              id="outlined-button"
              variant="outlined"
              onClick={this.handleNewGame}
            >
              Create game PIN
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("mapStateToProps", state);
  return {
    globalGameId: state.globalGameId,
    globalGameKey: state.globalGameKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeGlobalId: (id, gameKey) => {
      dispatch(setGameId(id, gameKey));
    }
  };
}
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Startpage);
