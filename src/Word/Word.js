import React, { Component } from "react";
import "./Word.css";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class Word extends Component {
  constructor(props) {
    super(props);
    this.wordContent = props.wordContent;
    this.wordID = props.wordID;
    this.state = { wordFromDb: "alpakka" };
  }

  getWordFromDB = () => {
    //Get the word from the DB
    // Set state
  };

  render() {
    return (
      <div>
        <div className="add-margin">
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>Your word</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button onclick={this.getWordFromDB}> Get new word</Button>
              <p className="fade-in" style={{ color: "black" }}>
                {this.wordContent}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <i className="fa fa-check-square"></i>
              <i className="fa fa-times"></i>{" "}
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      </div>
    );
  }
}

Word.propTypes = {
  wordContent: PropTypes.string,
  wordID: PropTypes.string
};

export default Word;
