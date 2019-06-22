import React from 'react';
import axios from 'axios';
import './CodeEditor.css';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/clike/clike.js');
import {connect} from 'react-redux';
import * as firebase from 'firebase';

import {Controlled as CodeMirror} from 'react-codemirror2';

class CodeEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            value: "#include <bits/stdc++.h>" + "\n" + "using namespace std;\n" + "int main() {\n" + "\tcout << \"Hello World\";\n\treturn 0;\n}",
            token: "",
            output: null,
            loading: false,
            answer: 0,
            submissionCode: null,
            res: [],
            submitted: false,
            subBox: [],
            currSum: 0
        }
        this.compile = this.compile.bind(this);
        this.run = this.run.bind(this);
        this.submit = this.submit.bind(this);
        this.checkSubmission = this.checkSubmission.bind(this);
    }
    compile() {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
          }
        this.setState({
            output: null,
            loading: true,
            answer: 0,
            submitted: false,
            subBox: []
        })
        var headers = {
            "Content-Type": "application/json"
        }
        var data = {
            "source_code": this.state.value,
            "language_id": 11,
            "stdin": this.props.question["input-example"],
            "expected_output": this.props.question["output-example"]
        }
        axios.post("http://localhost:3000/submissions/?base64_encoded=false&wait=true", data , {headers: headers})
        .then((response) => {
            console.log(response);
            this.setState({
                token: response.data.token
            })
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            this.setState({
                loading: false
            })
        })
        console.log(this.props.qkey);
        localStorage.setItem(this.props.qkey, this.state.value);
    }
    run() {
        axios.get("http://localhost:3000/submissions/" + this.state.token + "?base64_encoded=false&fields=stdout,stderr,status_id,compile_output")
            .then((res) => {
                console.log(res);
                this.setState({
                    output: res.data.stdout || res.data.compile_output,
                    answer: res.data.status_id
                })
                
            })
            .finally(() => {
                if(this.state.answer === 3) {
                    this.setState({
                        submissionCode: this.state.value
                    })
                }
            })
            
    }
    submit() {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        this.setState({
            loadingsub: true
        })
        var headers = {
            "Content-Type": "application/json"
        }
        var data = [
            {
                "source_code": this.state.submissionCode,
                "language_id": 11,
                "stdin": this.props.question.testcase1,
                "expected_output": this.props.question.testcase1output
            },
            {
                "source_code": this.state.submissionCode,
                "language_id": 11,
                "stdin": this.props.question.testcase2,
                "expected_output": this.props.question.testcase2output
            },
            {
                "source_code": this.state.submissionCode,
                "language_id": 11,
                "stdin": this.props.question.testcase3,
                "expected_output": this.props.question.testcase3output
            },
            {
                "source_code": this.state.submissionCode,
                "language_id": 11,
                "stdin": this.props.question.testcase4,
                "expected_output": this.props.question.testcase4output
            }
        ]
        var result = [null, null, null, null]
        var da = data.map((data, key) => {  
          axios.post("http://localhost:3000/submissions/?base64_encoded=false&wait=true", data , {headers: headers})
            .then((res) => {
                    axios.get("http://localhost:3000/submissions/" + res.data.token + "?base64_encoded=false&fields=stdout,stderr,status_id,compile_output")
                    .then((res) => {
                        result[key] = res.data.status_id;
                    })
        })
        });
        sleep(8000).then(() => {
            this.setState({
                loadingsub: false
            })
            this.setState({
                res: result,
                submitted: true
            })
            this.checkSubmission();
        });
        
    }
    checkSubmission() {
        var subBox = this.state.res.map((data, key) => {
            return (data === 3) ? <div className="passcase">Test Case {key} passed!</div> : <div className="failcase">Test Case {key} Failed!</div>
        })
        this.setState({
            subBox: subBox
        })
        var sum1 = this.state.res.map((data) => {
            return data === 3 ? 25 : 0
        })
        var sum = 0;
        for(var i = 0; i<sum1.length; i++) {
            sum += sum1[i];
        }        
        this.setState({
            currSum: sum
        })
        var db = firebase.firestore();
        console.log(sum);
        if(this.props.qkey === '1') {
            this.props.onUpdateOne(sum);
            if(sum >= this.props.maxscore)
            db.collection('score').doc(firebase.auth().currentUser.uid).update({score1: sum});
        }else if(this.props.qkey === '2'){
            this.props.onUpdateTwo(sum);
            if(sum >= this.props.maxscore)
            db.collection('score').doc(firebase.auth().currentUser.uid).update({score2: sum});
        }else if(this.props.qkey === '3') {
            this.props.onUpdateThree(sum);
            if(sum >= this.props.maxscore)
            db.collection('score').doc(firebase.auth().currentUser.uid).update({score3: sum})
        }else if(this.props.qkey === '4') {
            this.props.onUpdateFour(sum);
            if(sum >= this.props.maxscore)
            db.collection('score').doc(firebase.auth().currentUser.uid).update({score4: sum})
        }
    }
    componentDidMount() {
        localStorage.getItem(this.props.qkey) && this.setState({
            value: localStorage.getItem(this.props.qkey)
        })
    }
    render() {
        return (
            <div className="codebox">
            <h1>{this.props.question.title}</h1>
            <div className="marginbox">Question: <pre className="question">{this.props.question.question}</pre></div>
            <div className="marginbox">Input: <pre className="question">{this.props.question.input}</pre></div>
            <div className="marginbox">Input Format: <pre className="question">{this.props.question["input-example"]}</pre></div>
            <div className="marginbox">Output: <pre className="question">{this.props.question.output}</pre></div>
            <div className="marginbox">Output Format: <pre className="question">{this.props.question["output-example"]}</pre></div>
            <div className="marginbox">Explanation: <pre className="question">{this.props.question["explanation"]}</pre></div>
            <div className="marginbox">Code It: </div>
            
            <div className="coder">
            <CodeMirror
                style={{"height": "800px"}}
                value={this.state.value}
                className="textarea"
                options={{
                    mode :  'clike',
                    theme: 'material',
                    lineNumbers: true,
                    indentUnit: 4
                }}
                
                onBeforeChange={(editor, data, value) => {
                    this.setState({value});
                }}
                onChange={(editor, value) => {
                }}
            />
            </div>
            <button className="butt" onClick={this.run}>Run</button>
            <button className="butt" onClick={this.compile}>{this.state.loading && <div><i className="fa fa-refresh fa-spin"></i> Compiling</div>}{!this.state.loading && <div>Compile</div>}</button>
            {this.state.output && 
            <div className="marginbox">Your Output: 
                <pre className="outputbox">{this.state.output}</pre>
                <div className="marginbox">Expected Output: 
                    <pre className="outputbox">{this.props.question["output-example"]}</pre>
                </div>
            </div>}
            {this.state.answer === 3 && <button className="butt" onClick={this.submit}>{this.state.loadingsub && <div><i className="fa fa-refresh fa-spin"></i> Submitting</div>}{!this.state.loadingsub && <div>Submit</div>}</button>}
            {this.state.subBox.length !== 0 && this.state.subBox}            
            {this.state.subBox.length !== 0 && <div>Your Scored: {this.state.currSum}</div>}            
            </div>
        )
    }
}
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

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
