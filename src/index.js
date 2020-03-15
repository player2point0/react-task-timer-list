import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TaskController from './TaskController.js';
import * as serviceWorker from './serviceWorker.js';

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

var firebaseui = require('firebaseui');




// ========================================


serviceWorker.register();

//firebase
const firebaseConfig = {
    apiKey: "AIzaSyAxGvolzw0mVmK5rjfLh9hT3OBgeihjv4o",
    authDomain: "react-task-app-d7d0a.firebaseapp.com",
    databaseURL: "https://react-task-app-d7d0a.firebaseio.com",
    projectId: "react-task-app-d7d0a",
    storageBucket: "react-task-app-d7d0a.appspot.com",
    messagingSenderId: "552127368915",
    appId: "1:552127368915:web:e2566ec7eca32b03bd8e26",
    measurementId: "G-470KV7252P"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
});



ReactDOM.render(
    <TaskController />,
    document.getElementById('root')
);