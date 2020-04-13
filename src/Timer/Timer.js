import React, { Component } from "react";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: this.props.seconds,
      timerOn: false,
      timerTime: 60,
      timerStart: 0,
    };
  }

  startCountDown = () => {
    this.setState({
      timerOn: true,
      timerTime: 60,
      timerStart: this.state.timerTime,
    });
    // start timer after button is clicked
    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 1;
      if (newTime >= 0) {
        this.setState({
          timerTime: newTime,
        });
      } else {
        clearInterval(this.timer);
        this.setState({ timerOn: false });
        console.log("Countdown ended");
        this.props.handleHideWord();
      }
    }, 1000);
  };
  resetTimer = () => {
    if (this.state.timerOn === false) {
      this.setState({
        timerTime: this.state.timerStart,
      });
    }
  };

  //componentWillUnmount() {
  //clearInterval(this.interval);
  //}
  componentDidMount = () => {
    this.startCountDown();
  };

  render() {
    return (
      <div>
        <div>{this.state.timerTime}</div>
        <br />
      </div>
    );
  }
}
export default Timer;
