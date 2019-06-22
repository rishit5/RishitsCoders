import React from "react";
import axios from 'axios';
import './Quiz.css'

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otpionselected: null,
      time: 0,
      timeup: false, 
      questionanswered: null
    };
    this.handleClicks = this.handleClicks.bind(this);
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.time === 2001) {
        console.log("Your time is up");
        clearInterval(this.timer);
        this.setState({
          timeup: true,
          questionanswered: false
        })
      } else {
        // console.log(this.state.time);
        this.setState({
          time: this.state.time + 1
        });
      }
    }, 1);
  }
  handleClicks(key) {
    console.log(key);
    clearInterval(this.timer);
    this.setState({
      otpionselected: key, 
      timeup: true, 
      questionanswered: true
    });
    var data = {
      name: 'Rishit Ratna',
      option: key
    }
    axios.post('http://192.168.31.22:8081/', data)
      .then((response, request) => {
        console.log(response.config.data);
      });
  }
  render() {
    var style = {
      width: ((2000 - this.state.time)/2000)*100 + '%'
    };
    return (
      <div className="App">
        <div>
          Aaina Dramatics Club Poll
        </div>
        <div className="questionBox">
        {!this.state.timeup && <div><div >
          <div>The question is pretty Stupid</div>
          {this.state.time !== 2001 && <hr className="line" style={style} />}
        </div>
          <div>
            <ul>
              <li onClick={() => this.handleClicks(1)}>otpion A</li>
              <li onClick={() => this.handleClicks(2)}>otpion B</li>
              <li onClick={() => this.handleClicks(3)}>otpion C</li>
              <li onClick={() => this.handleClicks(4)}>otpion D</li>
            </ul>
          </div>
        </div>}
        {this.state.timeup && this.state.questionanswered && 
        <div>Thank you for answering the question!</div>
          }
          {this.state.timeup && !this.state.questionanswered && 
        <div>You ran out of time, Sorry!</div>
          }
      </div>
      </div>
    );
  }
}

export default Quiz;
