import React, { Component } from "react";
import "./Word.css";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Timer from "../Timer/Timer";

class Word extends Component {
  constructor(props) {
    super(props);
    this.randomWordContent = props.randomWordContent;
    this.wordContent = props.wordContent;
    this.state = { wordFromDb: "alpakka", showWord: false, startTimer: false };
  }
  handleFirstWord = () => {
    this.setState({
      firstWordReceived: true,
    });
  };

  handleHideWord = () => {
    console.log("Word should be hidden!");
    this.setState({ showWord: false });
  };

  startTimer = () => {
    console.log("Start timer called");
    this.setState({ startTimer: true, showWord: true });
  };
  render() {
    return (
      <div>
        <div className="add-margin">
          {!this.state.showWord ? (
            <Button
              className="brk-btn first-word"
              disabled={this.props.noMoreWords}
              variant="primary"
              size="xxl"
              onClick={(event) => {
                this.props.getRandomWordFromDb();
                this.startTimer();
              }}
            >
              Click when your turn
            </Button>
          ) : (
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title className="modal-title">
                  <div className="your-word">Your word</div>
                  <div className="timer">
                    <Timer
                      seconds={60}
                      startTimer={this.state.startTimer}
                      handleHideWord={this.handleHideWord}
                    />
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="fade-in word-content">
                  {this.props.randomWordContent}
                </p>
              </Modal.Body>
              <Modal.Footer className="footer">
                <div className="score">
                  {this.props.roundScore > 0 ? (
                    <div>Current round score: {this.props.roundScore}</div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <Button
                  className="green-btn"
                  onClick={this.props.completedWord}
                >
                  <i className="fa fa-check green"></i>
                </Button>
                <Button
                  className="red-btn"
                  onClick={this.props.getRandomWordFromDb}
                >
                  <i className="fa fa-times red"></i>{" "}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          )}
        </div>
      </div>
    );
  }
}

Word.propTypes = {
  wordContent: PropTypes.string,
  wordID: PropTypes.string,
};

export default Word;
