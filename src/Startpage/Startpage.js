import React, { Component } from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import "./Startpage.css";
import firebase from "firebase/app";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { DB_CONFIG } from "../Config/config";
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
    this.state = { gameObj: { key: "", gameId: -1 } };
    if (!firebase.apps.length) {
      firebase.initializeApp(DB_CONFIG);
    }
    firebase.database.enableLogging(false);

    this.gameIds = firebase
      .database()
      .ref()
      .child("gameIds");
  }

  componentDidMount() {
    /* When the components is loaded, all the existing words in db2 are loaded into
    the words array 
   */
    /*console.log("componentWillMount called!!!!");
    const previousIds = [];
    this.gameIds.on("child_added", snap => {
      previousIds.push({
        id: snap.key,
        gameId: snap.val().gameId
      });
      var newGameId = 0;
      if (previousIds.length === 0) {
        newGameId = 100;
      } else {
        newGameId = previousIds[previousIds.length - 1].gameId + 1;
      }
      this.setState(
        {
          gameId: newGameId
        },
        console.log(this.state.gameId)
      );
    });
*/
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
    let a = await this.checkIfEmptyDb();
    if (a === false) {
      // get the content
      //return this.gameIds.once("value").then(function(snapshot) {
      //var gameIds = snapshot.val();
      //console.log("this is in the fetch one", gameIds);
      //});
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
      callback(newGameId);
    });
  };
  sendNew = newId => {
    try {
      this.gameIds.push().set({ gameId: newId });
    } catch (e) {
      console.log("Did not push to firebase.");
    }
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
export default Startpage;
