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
      showWord: false,
    };
  }
  // before component mounts
  // This function is called on and on...
  componentDidMount() {
    /* When the components is loaded, all the existing words in db2 are loaded into
    the words array 
   */
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
    // push the new word to both the dbs:
    // same as writing firebase.databse().ref().child('dbMain').push().set({wordContent:word})
    try {
      this.dbMain.push().set({ wordContent: word });
    } catch (e) {}
    try {
      this.dbDynamic.push().set({ wordContent: word });
    } catch (e) {}
  };

  completedWord = () => {
    // if the user gets a point for the word, it is appended to completedWords array:
    // need to check if the words is gotten from the databse.. gotFromDb?
    const prevWords = this.state.completedWords;
    prevWords.push(this.state.randomWord);

    this.setState(
      {
        completedWords: prevWords,
        roundScore: this.state.roundScore + 1,
      },
      () => {}
    );
    // Remove word from db2!
    this.removeWord(this.state.randomWord.id);
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
        this.updateWordList().then((updatedWordList) => {
          // select a word randomly from the list:
          const newWord =
            updatedWordList[Math.floor(Math.random() * updatedWordList.length)];

          this.setState(
            {
              randomWord: {
                id: newWord.id,
                wordContent: newWord.wordContent,
              },
              words: updatedWordList,
              gotWordFromDb: true,
            },
            () => {}
          );
        }); // {id:x,wordContent:"the_word"}
      })
      .catch((error) => {
        this.setState({ moreWordsExist: false });
        // (error.message);
      });
  };

  startNewRound = () => {
    // empty completed words
    this.setState(
      { words: [], gotWordFromDb: false, noMoreWords: false, showWord: false },
      () => {
        this.copyFbRecord(this.dbMain);
      }
    );
  };

  copyFbRecord = (oldRef) => {
    const newRef = this.dbDynamic;

    this.setState({ completedWords: [], moreWordsExist: true });
    const promise = new Promise((resolve, reject) => {
      oldRef
        .once("value")
        .then((snap) => {
          return newRef.set(snap.val());
        })
        .then(() => {
          this.updateWordList().then((res) => {
            this.setState({ words: res, roundScore: 0 });
          });
          resolve();
        })
        .catch((err) => {
          reject();
        });
    });
  };
  handleHiddenWordApp = () => {
    this.setState({ showWord: true }, () => {
      console.log(this.state.showWord);
    });
  };

  handleShowWordApp = () => {
    this.setState({ showWord: false });
  };

  render() {
    return (
      <div>
        {this.props.globalGameKey === 0 ? (
          <div>
            {alert(
              "Go back to the homepage and create or log back into the game."
            )}
          </div>
        ) : (
          <div></div>
        )}
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
              <Wordpool
                numOfWords={this.state.words.length}
                mounted={this.state.mounted}
              ></Wordpool>
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
              handleHiddenWordApp={this.handleHiddenWordApp}
              showWord={this.state.showWord}
              handleShowWordApp={this.handleShowWordApp}
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
  return {
    globalGameId: state.globalGameId,
    globalGameKey: state.globalGameKey,
  };
}

export default connect(mapStateToProps, null)(App);
