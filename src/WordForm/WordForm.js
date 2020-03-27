import React, { Component } from "react";
import "./WordForm.css";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "firebase/database";

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
    this.props.addword(this.state.newWordContent);
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
              <Button variant="outline-secondary" onClick={this.writeWord}>
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
