import React, { Component } from "react";

class Wordpool extends Component {
  render() {
    return (
      <div className="word-pool">
        <div className="number">
          {this.props.numOfWords === 0 ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>{this.props.numOfWords} </div>
          )}
        </div>
        <div>Unguessed words</div>
      </div>
    );
  }
}

export default Wordpool;
