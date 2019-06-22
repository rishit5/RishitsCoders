import React, { Component } from 'react';
import './Login.css';
import * as firebase from 'firebase';
import {connect} from 'react-redux';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(event, value) {
        if(value === 'email') {
            this.setState({
                email: event.target.value
            })
        }else if(value === 'password') {
            this.setState({
                password: event.target.value
            })
        }
    }
    handleClick() {
        this.setState({
            invalidetails: false
        })
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
                // this.props.onLogin();
                this.setState({
                    invalidetails: true,
                    errormessage: error.message
                })
            })
            .then((res) => {
                if(res) {
                    // this.props.onLogin();
                }
            })
    }   
    render() {   
        return (
            <div className="homebox">
                <div>Login</div>
                <input className="homelogin" type="email" placeholder="Email Address" onChange={(event, value) => this.handleChange(event, 'email')}></input><br></br>
                <input className="homelogin" type="password" placeholder="Password" onChange={(event, value) => this.handleChange(event, 'password')}></input><br></br>
                {this.state.invalidetails && <div className="errorclass">{this.state.errormessage}</div>}
                <button className="loginbutton" onClick={this.handleClick}>Submit</button>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        // onLogin: () => dispatch({type: "ONLOGIN"})
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);