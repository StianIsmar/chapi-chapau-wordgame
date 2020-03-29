import React, { Component } from "react";
import Word from "./Word/Word";
import Button from "react-bootstrap/Button";
import "./App.css";
import WordForm from "./WordForm/WordForm";
import { DB_CONFIG } from "./Config/config";
import firebase from "firebase/app";
import Navbar from "./Navbar/Navbar";

class App extends Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(DB_CONFIG);
    }
    firebase.database.enableLogging(true);

    this.dbMain = firebase
      .database()
      .ref()
      .child("words");

    this.dbDynamic = firebase
      .database()
      .ref()
      .child("dynamicDb");

    this.state = {
      words: [],
      completedWords: [],
      randomWord: { id: 3, wordContent: "" },
      gotWordFromDb: false,
      roundScore: 0,
      moreWordsExist: true
    };
  }

  // before component mounts
  componentWillMount() {
    /* When the components is loaded, all the existing words in db2 are loaded into
    the words array 
   */
    console.log("componentWillMount called");
    const previousWords = [];
    this.dbDynamic.on("child_added", snap => {
      previousWords.push({
        id: snap.key,
        wordContent: snap.val().wordContent
      });
      this.setState(
        {
          words: previousWords
        },
        console.log(this.state.words)
      );
    });

    // Hvis noe skal lagres
    // this.db.push().set({ wordContent: "tiger" });
  }

  updateWordList = async () => {
    const previousWords = [];
    this.dbDynamic.on("child_added", snap => {
      previousWords.push({
        id: snap.key,
        wordContent: snap.val().wordContent
      });
    });
    return previousWords;
  };

  addword = word => {
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

    this.setState({
      completedWords: prevWords,
      roundScore: this.roundScore + 1
    });
    // Remove word from db2!
    this.removeWord(this.state.randomWord.id);
    console.log("removed word");
    return this.getRandomWordFromDb();
  };

  removeWord = wordId => {
    this.dbDynamic.child(wordId).remove();
  };

  checkIfEmptyDb = async => {
    var ref = firebase.database().ref("dynamicDb");
    // Return value of the promise
    return ref.once("value").then(snapshot => {
      const a = snapshot.exists();
      return a;
    });
  };

  getRandomWordFromDb = async () => {
    // First, check if there are any more words to guess:
    let moreWords = await this.checkIfEmptyDb();
    console.log("moreWords", moreWords); //undefined
    /* 
    Await is used to pause the execution until updateWordList returns the updated list 
    from firebase.
    */
    if (!moreWords) {
      console.log("No more words exist!");
      this.setState({ moreWordsExist: false });
    } else {
      const updatedWordList = await this.updateWordList(); // {id:x,wordContent:"the_word"}
      console.log("The new list where we are selecting a random element...");
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
            wordContent: newWord.wordContent
          },
          words: updatedWordList,
          gotWordFromDb: true
        },
        () => {
          console.log("got word from db", this.state.gotWordFromDb);
        }
      );
    }
  };

  startNewRound = () => {
    // empty completed words
    this.setState({ completedWords: [], noMoreWords: false });
    this.copyFbRecord(this.dbMain);

    // backend: put all words back in db2.
  };

  copyFbRecord = oldRef => {
    const newRef = firebase
      .database()
      .ref()
      .child("dynamicDb");
    console.log("newRef", newRef);
    console.log("oldRef", oldRef);

    const promise = new Promise((resolve, reject) => {
      oldRef
        .once("value")
        .then(snap => {
          return newRef.set(snap.val());
        })
        .then(() => {
          console.log("Done!");
          resolve();
        })
        .catch(err => {
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
            <div className="wordPool">
              <div className="number">{this.state.words.length}</div>
              Is the number of words in word pool
            </div>
            <WordForm className="wordform" addword={this.addword} />
          </div>
          <div>
            {!this.state.moreWordsExist ? (
              <div>
                <div className="alert alert-dark" role="alert">
                  No more words exist! Click the "Start New Round button"
                </div>
              </div>
            ) : (
              <div>there are more!</div>
            )}
            <Word
              randomWordContent={this.state.randomWord.wordContent}
              getRandomWordFromDb={this.getRandomWordFromDb}
              gotWordFromDb={this.state.gotWordFromDb}
              key={1}
              roundScore={this.state.roundScore}
              completedWord={this.completedWord}
            />
            );
          </div>
          <Button
            variant="secondary"
            size="lg"
            block
            onClick={this.startNewRound}
          >
            Start new round
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
