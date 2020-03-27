import React, { Component } from "react";
import Word from "./Word/Word";
import Button from "react-bootstrap/Button";
import "./App.css";
import WordForm from "./WordForm/WordForm";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [{ id: 1, wordContent: "Show the random word from the database" }],
      completedWords: [
        { id: 1, wordContent: "word45" },
        { id: 2, wordContent: "word44" },
        { id: 4, wordContent: "word42" }
      ],
      randomWord: { id: 1, wordContent: "randomRetreivedWord" },
      gotWordFromDb: false
    };
  }

  completedWord = word => {
    this.completedWord.push(word);
    //Get the word from the DB
  };

  failedWord = () => {};

  getRandomWordFromDb = () => {
    // Get word from DB.
  };

  render() {
    return (
      <div>
        {" "}
        <div className="App">
          <header className="App-header">
            <h1>chapi chapeau</h1>
          </header>
          <WordForm />
          <div>
            {this.state.words.map(word => {
              return (
                <Word
                  wordContent={word.wordContent}
                  randomWord={this.state.randomWord.wordContent}
                  wordID={word.ID}
                  key={word.ID}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
