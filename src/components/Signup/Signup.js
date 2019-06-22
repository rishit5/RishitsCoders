import React from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import './Signup.css'

class Signup extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            invalidEmail: false,
            notmatchingPassword: false,
            name: "",
            error: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(event, value) {
        this.setState({
            error: false
        })
        if(value === "name") {
            this.setState({
                name: event.target.value
            })
        }
        if(value === "email") {
            this.setState({
                email: event.target.value
            })
            if(this.state.email.length < 4) {
                this.setState({
                invalidEmail: true
                })
            }else {
                this.setState({
                    invalidEmail: false
                })
            }
        }else if(value === "password") {
            this.setState({
                password: event.target.value
            })
        }else if(value === "confirmPassword") {
            this.setState({
                confirmPassword: event.target.value
            }, () => {
                if(this.state.password !== this.state.confirmPassword) {
                    this.setState({
                        notmatchingPassword: true
                    })
                }else {
                    this.setState({
                        notmatchingPassword: false
                    })
                }
            })
            
        }
    }
    handleClick() {
        this.setState({
            error: false
        })
        if(this.state.email.length < 4) {
            
        }else if(this.state.password !== this.state.confirmPassword) {

        }else {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .catch((error) => {
                    console.log(error.code);
                    console.log(error.message);
                    this.setState({
                        errormessage: error.message,
                        error: true
                    })
                })
                .then(() => {
                    var data = {
                        name: this.state.name,
                        score1: 0,
                        score2: 0,
                        score3: 0,
                        score4: 0
                    }
                    var db = firebase.firestore();
                    db.collection('score').doc(firebase.auth().currentUser.uid).set(data);
                    console.log('User has been created!', firebase.auth().currentUser.uid);
                    this.setState({
                        email: "",
                        password: "",
                        confirmPassword: "",
                    })
                })
        }    
    }
    render() {
        return (<div className="homebox">
                <div>Sign Up</div>
                <input className="homelogin" type="name" placeholder="Name" onChange={(event, value) => this.handleChange(event, 'name')}></input><br></br>
                <input className="homelogin" type="email" placeholder="Email Address" onChange={(event, value) => this.handleChange(event, 'email')}></input><br></br>
                {this.state.invalidEmail && <div className="errorclass">Email too short</div>}
                <input className="homelogin" type="password" placeholder="Password" onChange={(event, value) => this.handleChange(event, 'password')}></input><br></br>
                <input className="homelogin" type="password" placeholder="Comfirm Password" onChange={(event, value) => this.handleChange(event, 'confirmPassword')}></input><br></br>
                {this.state.notmatchingPassword && <div className="errorclass">Password Don't Match</div>}
                {this.state.error && <div className="errorclass">{this.state.errormessage}</div>}
                <button className="loginbutton" onClick={this.handleClick}>Submit & Login</button>
            </div>)
    }
}
const mapStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        // onLogout: () => dispatch({type: "ONLOGOUT"})
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup);