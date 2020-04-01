import React, { Component } from "react";
import "./WordForm.css";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "firebase/database";

class WordForm extends Component {
  constructor(props) {
    super(props);
    this.state = { newWordContent: "", submitted: false };
  }
  // Set new wordcontent of what the value is in the inout box. Do not need to bind with arrow func.
  handleUserInput = e => {
    this.setState({ newWordContent: e.target.value });
  };
  writeWord = () => {
    this.temporaryChangeState();
    this.props.addword(this.state.newWordContent);
    this.setState({ newWordContent: "" });
  };

  temporaryChangeState = () => {
    if (this.state.submitted === false) {
      this.setState({ submitted: !this.state.submitted });
      setTimeout(
        function() {
          this.setState({ submitted: false });
        }.bind(this),
        500
      ); // wait 5 seconds, then reset to false
    }
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.writeWord();
    }
  };
  render() {
    return (
      <div className="word-wrapper">
        <div className="input-word">
          <InputGroup className="mb-3">
            <FormControl
              onKeyDown={e => this.handleKeyPress(e)}
              placeholder="Add new word.."
              value={this.state.newWordContent}
              onChange={this.handleUserInput}
            />

            <InputGroup.Append>
              {}
              <Button variant="outline-secondary btn" onClick={this.writeWord}>
                {this.state.submitted ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <div>Submit</div>
                )}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
    );
  }
}

export default WordForm;
