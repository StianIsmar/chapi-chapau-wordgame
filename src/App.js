import React, { Component } from "react";
import Word from "./Word/Word";
import Button from "react-bootstrap/Button";
import "./App.css";
import WordForm from "./WordForm/WordForm";
import { DB_CONFIG } from "./Config/config";
import firebase from "firebase/app";

class App extends Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(DB_CONFIG);
    }

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
      roundScore: 0
    };
  }

  // before component mounts
  componentWillMount() {
    /* When the components is loaded, all the existing words in db2 are loaded into
    the words array 
   */
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
    // push the new word to both the dbs:
    this.dbMain.push().set({ wordContent: word });
    this.dbDynamic.push().set({ wordContent: word });
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

  getRandomWordFromDb = async () => {
    // Get word from DB, need to call db to get updated version

    /* 
    Await is used to pause the execution until updateWordList returns the updated list 
    from firebase.
    */
    const updatedWordList = await this.updateWordList(); // {id:x,wordContent:"the_word"}

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
        console.log(this.state.gotWordFromDb);
      }
    );
  };

  startNewRound = () => {
    // empty completed words
    this.setState({ completedWords: [] });

    // backend: put all words back in db2.
  };

  render() {
    return (
      <div>
        {" "}
        <div className="App">
          <header className="App-header">
            <h1>chapi-chapau</h1>
          </header>
          <div className="add-word-and-status">
            <div className="wordPool">
              <div className="number">{this.state.words.length}</div>
              Is the number of words in word pool
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
