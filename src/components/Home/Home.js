import React from 'react';
import './Home.css';
import Login  from '../Login/Login';
import { Route, Link } from 'react-router-dom';
import Signup from '../Signup/Signup';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            data: null
        }
        this.logout = this.logout.bind(this);    
    }
    logout(){
        firebase.auth().signOut()
        .then(() => {
        })
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
    }
    render() {
        return (
        <div className="fullbox">
            <header className="headerbar">
                <Link to="/"><nav>Home</nav></Link>
                {!this.props.loggedIn && <Link to="/signup"><nav>Sign Up</nav></Link>}
                {this.props.loggedIn && <Link to="/"><nav onClick={this.logout}>Logout</nav></Link>}
                {this.props.loggedIn && <div className="scorebox">Score: {this.props.score} /400</div>}
                {this.props.loggedIn && <div className="scorebox">Welcome {this.props.name}</div>}
            </header>
            {!this.props.loggedIn && <Route path="/" exact component={Login}/>}
            {!this.props.loggedIn && <Route path="/signup" exact component={Signup} />}
            <div id="background1">
                Rishi 
            </div>
            <br></br>
            <div id="background2">
                oders 
            </div>
            <div id="background3">
                t's/&gt;  
            </div>
            <div id="background4">
                &lt;C
            </div>
        </div>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);