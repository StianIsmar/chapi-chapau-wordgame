import React, { Component } from "react";
import "./WordForm.css";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

class WordForm extends Component {
  constructor(props) {
    super(props);
    this.state = { newWordContent: "" };
  }

  // Set new wordcontent of what the value is in the inout box. Do not need to bind with arrow func.
  handleUserInput = e => {
    this.setState({ newWordContent: e.target.value });
  };
  writeWord = () => {
    // Send word to db
    // Set input back to empty string.
    this.setState({ newWordContent: "" });
  };
  render() {
    return (
      <div className="word-wrapper">
        <div className="input-word">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Add new word.."
              value={this.state.newWordContent}
              onChange={this.handleUserInput}
            />

            <InputGroup.Append>
              <Button variant="outline-secondary" onclick={this.writeWord}>
                Button
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
    );
  }
}

export default WordForm;
