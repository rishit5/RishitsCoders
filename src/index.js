import React from "react";
import ReactDOM from "react-dom";
import App from './containers/App.js';
import './styles.css'
import * as firebase from 'firebase';
import { createStore } from 'redux';
import reducer from './store/reducer'
import { Provider } from 'react-redux';


const firebaseConfig = {
    apiKey: "AIzaSyDrkZVgPwGLLMYDXOZ4Mq00iWaDemDpSgw",
    authDomain: "codeforall-eaaa8.firebaseapp.com",
    databaseURL: "https://codeforall-eaaa8.firebaseio.com",
    projectId: "codeforall-eaaa8",
    storageBucket: "codeforall-eaaa8.appspot.com",
    messagingSenderId: "816028908160",
    appId: "1:816028908160:web:3eafb45e2332cddd"
};


const store = createStore(reducer);

firebase.initializeApp(firebaseConfig);
const rootElement = document.getElementById("root");
ReactDOM.render(<Provider store={store}> <App/> </Provider>, rootElement);
