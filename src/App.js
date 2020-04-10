import React, { Component } from "react";
import Word from "./Word/Word";
import Button from "react-bootstrap/Button";
import "./App.css";
import WordForm from "./WordForm/WordForm";
import { DB_CONFIG } from "./Config/config";
import firebase from "firebase/app";
import Navbar from "./Navbar/Navbar";
import Wordpool from "./Wordpool/Wordpool";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Rules from "./Rules/Rules";
import { connect } from "react-redux";
import Modal1 from "./Modal/Modal1";

class App extends Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(DB_CONFIG);
    }
    firebase.database.enableLogging(false);
    let id = this.props.globalGameId.toString();
    let key = this.props.globalGameKey.toString(); // The correct redux state is not here yet.
    this.dbMain = firebase
      .database()
      .ref()
      .child("/gameIds/" + key + "/words");

    this.dbDynamic = firebase
      .database()
      .ref()
      .child("/gameIds/" + key + "/dynamicDb");

    this.state = {
      words: [],
      completedWords: [],
      randomWord: { id: 3, wordContent: "" },
      gotWordFromDb: false,
      roundScore: 0,
      moreWordsExist: true,
      mounted: false,
    };
  }
  // before component mounts
  // This function is called on and on...
  componentDidMount() {
    /* When the components is loaded, all the existing words in db2 are loaded into
    the words array 
   */
    console.log("componentWillMount called!!!!");
    const previousWords = [];
    this.dbMain.on("child_added", (snap) => {
      previousWords.push({
        id: snap.key,
        wordContent: snap.val().wordContent,
      });

      this.setState({
        words: previousWords,
        mounted: true,
      });
    });
  }

  updateWordList = async () => {
    console.log("Calling updatewordlist!");
    console.log(this.dbDynamic);
    const previousWords = [];
    let newPromise = new Promise((resolve, reject) => {
      this.dbDynamic.on("child_added", (snap) => {
        previousWords.push({
          id: snap.key,
          wordContent: snap.val().wordContent,
        });
        resolve(previousWords);
      });
    });
    return newPromise;
  };

  addword = (word) => {
    console.log(typeof word);
    // push the new word to both the dbs:
    // same as writing firebase.databse().ref().child('dbMain').push().set({wordContent:word})
    try {
      this.dbMain.push().set({ wordContent: word });
    } catch (e) {
      console.log("Make sure words is filled in");
    }
    try {
      this.dbDynamic.push().set({ wordContent: word });
    } catch (e) {
      console.log("Make sure word is filled in");
    }
  };

  completedWord = () => {
    // if the user gets a point for the word, it is appended to completedWords array:
    // need to check if the words is gotten from the databse.. gotFromDb?
    console.log("This is the current word....");
    console.log(this.state.randomWord);
    const prevWords = this.state.completedWords;
    prevWords.push(this.state.randomWord);

    this.setState(
      {
        completedWords: prevWords,
        roundScore: this.state.roundScore + 1,
      },
      () => {
        console.log("ROUNDSCORE UPDATED", this.state.roundScore);
      }
    );
    // Remove word from db2!
    this.removeWord(this.state.randomWord.id);
    console.log("removed word");
    return this.getRandomWordFromDb();
  };

  removeWord = (wordId) => {
    this.dbDynamic.child(wordId).remove();
  };

  checkIfEmptyDb = () => {
    var myPromise = new Promise((resolve, reject) => {
      //let ref = firebase.database().ref().child("gameIds").child("gameId");
      this.dbDynamic.once("value").then((snapshot) => {
        const a = snapshot.exists();
        console.log("in promis", a);

        if (a === true) {
          resolve(a);
        } else {
          reject(new Error("There are no more words"));
        }
      });
    });
    return myPromise;
  };

  getRandomWordFromDb = async () => {
    // First, check if there are any more words to guess:

    this.checkIfEmptyDb()
      .then((res) => {
        console.log(res);
        this.updateWordList().then((updatedWordList) => {
          console.log(updatedWordList);

          // select a word randomly from the list:
          const newWord =
            updatedWordList[Math.floor(Math.random() * updatedWordList.length)];
          console.log("This is the selected new word:");
          console.log(newWord);
          this.setState(
            {
              randomWord: {
                id: newWord.id,
                wordContent: newWord.wordContent,
              },
              words: updatedWordList,
              gotWordFromDb: true,
            },
            () => {
              console.log("got word from db", this.state.gotWordFromDb);
            }
          );
        }); // {id:x,wordContent:"the_word"}
      })
      .catch((error) => {
        console.log("No more words exist!");
        this.setState({ moreWordsExist: false });
        // (error.message);
      });
  };

  startNewRound = () => {
    // empty completed words
    this.setState(
      { words: [], gotWordFromDb: false, noMoreWords: false },
      () => {
        this.copyFbRecord(this.dbMain);
      }
    );
  };

  copyFbRecord = (oldRef) => {
    const newRef = this.dbDynamic;
    console.log("newRef", newRef);
    console.log("oldRef", oldRef);
    this.setState({ completedWords: [], moreWordsExist: true });
    const promise = new Promise((resolve, reject) => {
      oldRef
        .once("value")
        .then((snap) => {
          return newRef.set(snap.val());
        })
        .then(() => {
          this.updateWordList().then((res) => {
            console.log("THIS IS RES IN the COPY FUNCTION.", res);
            this.setState({ words: res, roundScore: 0 });
          });
          console.log("Done!");
          resolve();
        })
        .catch((err) => {
          console.log(err.message);
          reject();
        });
    });
  };

  render() {
    return (
      <div>
        {" "}
        <div className="App">
          <Navbar />
          <div className="add-word-and-status">
            <div>
              <Modal1
                open={!this.state.moreWordsExist}
                startNewRound={this.startNewRound}
              />
            </div>

            <div className="wordPool">
              <Wordpool numOfWords={this.state.words.length}></Wordpool>
            </div>
            <WordForm className="wordform" addword={this.addword} />
          </div>
          <div>
            <Word
              randomWordContent={this.state.randomWord.wordContent}
              getRandomWordFromDb={this.getRandomWordFromDb}
              gotWordFromDb={this.state.gotWordFromDb}
              key={1}
              roundScore={this.state.roundScore}
              completedWord={this.completedWord}
              noMoreWords={!this.state.moreWordsExist}
            />
          </div>
          <div className="alert-container">
            <Button
              className="start-new-round"
              variant="secondary"
              size="sm"
              block
              onClick={this.startNewRound}
            >
              Start new round
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
    globalGameKey: state.globalGameKey,
  };
}

export default connect(mapStateToProps, null)(App);
