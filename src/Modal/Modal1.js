import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import "./Modal.css";
import Button from "react-bootstrap/Button";

// Functional compoenent
const Modal1 = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {props.open ? (
        <Modal show={true}>
          <Modal.Header>No more words to guess</Modal.Header>
          <Modal.Body>
            {" "}
            <Button
              className="start-new-round"
              variant="secondary"
              size="lg"
              block
              onClick={props.startNewRound}
            >
              Start new round
            </Button>
          </Modal.Body>
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default Modal1;
