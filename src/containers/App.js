import React from 'react';
import './App.css'
import q2 from '../components/questions/q2.json';
import q1 from '../components/questions/q1.json';
import q3 from '../components/questions/q3.json';
import q4 from '../components/questions/q4.json';
import Home from '../components/Home/Home';
import * as firebase from 'firebase';
import { BrowserRouter } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor/CodeEditor'
import { connect } from 'react-redux';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
        q1: true,
        q2: false,
        q3: false,
        q4: false,
        name: "",
        data: null
    }
    this.changeQuestion = this.changeQuestion.bind(this);
  }
  changeQuestion(val) {
    if(val === 1) {
      this.setState({
        q1:true,
        q2:false,
        q3:false,
        q4:false,
      })
    }else if(val === 2) {
      this.setState({
        q1:false,
        q2:true,
        q3:false,
        q4:false,
      })
    }
    if(val === 3) {
      this.setState({
        q1:false,
        q2:false,
        q3:true,
        q4:false,
      })
    }
    if(val === 4) {
      this.setState({
        q1:false,
        q2:false,
        q3:false,
        q4:true,
      })
    }
  }
  componentDidMount() {
    this.setState({isMounted: true} , () => {
      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
              this.props.onLogin();
              var db = firebase.firestore();
              db.collection('score').doc(firebase.auth().currentUser.uid).onSnapshot((snapshot) => {
                  if(this.state.isMounted){
                      this.setState({
                          name: snapshot.data().name,
                          data : snapshot.data().score1 + snapshot.data().score2 + snapshot.data().score3 + snapshot.data().score4,
                          scoreFirst: snapshot.data().score1,  
                          scoreSecond: snapshot.data().score2,  
                          scoreThird: snapshot.data().score3,  
                          scoreFourth: snapshot.data().score4,  
                      })
                  }
              })
          }else {
              localStorage.clear()
              this.props.onLogout();
          } 
    }); 
  });
  }
  componentWillUnmount() {
    this.setState( { isMounted: false } )
  }
  render() {
    return (
    <BrowserRouter>
      <Home score={this.state.data} name={this.state.name} />
      {this.props.loggedin &&  
        <div className="quesnav">
          <button className="pagination" onClick={(val) => this.changeQuestion(1)}>1</button>
          <button className="pagination" onClick={(val) => this.changeQuestion(2)}>2</button>
          <button className="pagination" onClick={(val) => this.changeQuestion(3)}>3</button>
          <button className="pagination" onClick={(val) => this.changeQuestion(4)}>4</button>
        </div>
      }
      {/* {this.props.loggedin && <CodeEditor question={q1}></CodeEditor>} */}
      {this.props.loggedin && this.state.q1 && <CodeEditor question={q1} qkey='1' maxscore={this.state.scoreFirst} />}
      {this.props.loggedin && this.state.q2 && <CodeEditor question={q2} qkey='2' maxscore={this.state.scoreFirst} />}
      {this.props.loggedin && this.state.q3 && <CodeEditor question={q3} qkey='3' maxscore={this.state.scoreFirst} />}
      {this.props.loggedin && this.state.q4 && <CodeEditor question={q4} qkey='4' maxscore={this.state.scoreFirst} />}
    </BrowserRouter>
    )
  }
};

const mapStateToProps = (state) => {
  return  {
    loggedin: state.loggedIn,
    scoreFirst: state.scoreFirst,
    scoreSecond: state.scoreSecond,
    scoreThird: state.scoreThird,
    scoreFourth: state.scoreFourth
  }
}


const mapDispatchToProps = (dispatch) => {
  return  {
    onLogin: () => dispatch({type: "ONLOGIN"}), 
    onLogout: () => dispatch({type: "ONLOGOUT"}),
    onUpdateOne: (newval) => dispatch({type: "UPDATEFIRST", val: newval}),
    onUpdateTwo: (newval) => dispatch({type: "UPDATESECOND", val: newval}),
    onUpdateThree: (newval) => dispatch({type: "UPDATETHIRD", val: newval}),
    onUpdateFour: (newval) => dispatch({type: "UPDATEFOURTH", val: newval})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);