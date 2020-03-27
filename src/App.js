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

    this.db = firebase
      .database()
      .ref()
      .child("words");

    this.state = {
      words: [],
      completedWords: [
        { id: 1, wordContent: "word45" },
        { id: 2, wordContent: "word44" },
        { id: 4, wordContent: "word42" }
      ],
      randomWord: { id: 3, wordContent: "" },
      gotWordFromDb: false
    };
  }

  // before component mounts
  componentWillMount() {
    const previousWords = this.state.words;
    this.db.on("child_added", snap => {
      previousWords.push({
        id: snap.key,
        wordContent: snap.val().wordContent
      });
      this.setState({
        words: previousWords
      });
    });

    // Hvis noe skal lagres
    // this.db.push().set({ wordContent: "tiger" });
  }
  addword = word => {
    console.log(typeof word);
    this.db.push().set({ wordContent: word });
  };

  completedWord = word => {
    const prevWords = this.state.completedWords;
    prevWords.push({ id: prevWords.length + 1, wordContent: word });
    this.setState({ completedWords: prevWords });
    // Remove word from db2!
    // .... Implement//
    return this.getRandomWordFromDb();
  };

  getRandomWordFromDb = () => {
    // Get word from DB

    // This is the new word from the db!
    const newWord = { id: 5, wordContent: "new_word_from_db" };
    this.setState(
      {
        randomWord: {
          id: newWord.id,
          wordContent: newWord.wordContent
        },
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
          <WordForm addword={this.addword} />
          <div>
            <Word
              randomWordContent={this.state.randomWord.wordContent}
              getRandomWordFromDb={this.getRandomWordFromDb}
              gotWordFromDb={this.state.gotWordFromDb}
              key={1}
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
