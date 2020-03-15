import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TaskController from './TaskController.js';
import * as serviceWorker from './serviceWorker.js';
import TaskContainer from './TaskContainer';
import { getDateStr } from './Ultility';

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const firebaseui = require('firebaseui');

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

if (ui.isPendingRedirect()) {
    ui.start('#firebaseui-auth-container', {
        signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        requireDisplayName: false,
    });
}


let tempTask = new TaskContainer("test", 4321, getDateStr(), null);

setTimeout(function() { saveTask(tempTask); }, 1000);


function saveTask(task){
    console.log(firebase.auth().currentUser);
    db.collection("tasks").doc(task.id).set({
        additionalTime: task.additionalTime,
        isViewing: task.isViewing,
        name: task.name,
        paused: task.paused,
        remainingTime: task.remainingTime,
        started: task.started,
        stats:{
            timeAdded: task.stats.timeAdded,
            timesPaused: task.stats.timesPaused
        },
        timeUp: task.timeUp,
        totalDuration: task.totalDuration,
        userId: firebase.auth().currentUser.uid
    });
}


ReactDOM.render(
    <TaskController />,
    document.getElementById('root')
);