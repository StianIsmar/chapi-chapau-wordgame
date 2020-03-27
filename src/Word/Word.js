import React, { Component } from "react";
import "./Word.css";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class Word extends Component {
  constructor(props) {
    super(props);
    this.randomWordContent = props.randomWordContent;
    this.wordContent = props.wordContent;
    this.state = { wordFromDb: "alpakka" };
  }
  handleFirstWord = () => {
    this.setState({
      firstWordReceived: true
    });
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
              {!this.props.gotWordFromDb ? (
                <Button onClick={this.props.getRandomWordFromDb}>
                  {" "}
                  Get your first word
                </Button>
              ) : (
                <div></div>
              )}

              <p className="fade-in" style={{ color: "black" }}>
                {this.props.randomWordContent}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.completedWord}>
                <i className="fa fa-check-square green"></i>
              </Button>
              <Button variant="danger" onClick={this.props.getRandomWordFromDb}>
                <i className="fa fa-times red"></i>{" "}
              </Button>
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
