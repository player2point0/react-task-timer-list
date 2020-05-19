import "../css/index.css";
import "../css/auth.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import TaskContainer from "../js/TaskContainer.js";
import {formatDayMonth} from "../js/Ultility.js";

//firebase
export const firebaseConfig = {
    apiKey: "AIzaSyAxGvolzw0mVmK5rjfLh9hT3OBgeihjv4o",
    authDomain: "react-task-app-d7d0a.firebaseapp.com",
    databaseURL: "https://react-task-app-d7d0a.firebaseio.com",
    projectId: "react-task-app-d7d0a",
    storageBucket: "react-task-app-d7d0a.appspot.com",
    messagingSenderId: "552127368915",
    appId: "1:552127368915:web:e2566ec7eca32b03bd8e26",
    measurementId: "G-470KV7252P",
};

// Configure FirebaseUI.
export const uiConfig = {
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // Whether the display name should be displayed in the Sign Up page.
            requireDisplayName: false
        }
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
    },
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

export function getCurrentUser(){
    return getAuth().currentUser;
}

export function getAuth() {
    return firebase.auth();
}

export function loadServerData() {
    let scope = this;

    //get saved tasks
    this.firebaseGetAllTasks(function (savedTasks) {
        scope.setState(state => ({
            tasks: scope.parseSavedTasks(savedTasks),
            showAuthHtml: false,
        }));
    });

    //get saved day stats
    this.firebaseGetDayStats(function (dayStats, date) {
        if (dayStats == null) {
            scope.createNewDayStats();
        } else {
            scope.setState(state => ({
                dayStats: dayStats,
            }));
        }
    }, new Date());

    //load a weeks worth of previous day stats
    let weekDate = new Date();
    let weekDayStats = [];

    for(let i = 0;i<7;i++){

        weekDate.setDate(weekDate.getDate()-1);

        this.firebaseGetDayStats(function (dayStats, date) {
            if(dayStats === null){
                dayStats = {
                    date: date,
                };
            }

            weekDayStats.push(dayStats);

            scope.setState(state => ({
                weekDayStats: weekDayStats,
            }));

        }, weekDate);
    }
}

// login / signup / guest
export function userAuthChanged(user) {
    if (user) {
        this.loadServerData();
    } else {
        this.setState(state => ({
            showAuthHtml: true,
        }));
    }
}

//todo optimise this to only change fields that have changed
export function firebaseSaveTask(task) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    firebase.firestore().collection("tasks")
        .doc(task.id)
        .set({
            id: task.id,
            name: task.name,
            dateCreated: task.dateCreated,
            totalTime: task.totalTime,
            remainingTime: task.remainingTime,
            addTimeAmt: task.addTimeAmt,
            timeUp: task.timeUp,
            started: task.started,
            finished: task.finished,
            paused: task.paused,
            isViewing: task.isViewing,
            stats: {
                timeAdded: task.stats.timeAdded,
                dateStarted: task.stats.dateStarted,
                dateFinished: task.stats.dateFinished,
                pauseDates: task.stats.pauseDates,
                unpauseDates: task.stats.unpauseDates,
            },
            objectives: task.objectives,
            userId: currentUser.uid,
        })
        .then(value => console.log("saved task successfully"))
        .catch(reason => console.error("error saving task" + reason));
}

export function firebaseSaveDayStats() {
    const currentUser = firebase.auth().currentUser;
    let currentDayStats = this.state.dayStats;
    let scope = this;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    if (!this.state.dayStats.id) {
        currentDayStats.userId = currentUser.uid;

        firebase.firestore().collection("dayStats")
            .add(this.state.dayStats)
            .then(function (val) {
                //add the id from firebase to the local dayStats
                let updatedDayStats = scope.state.dayStats;
                updatedDayStats.id = val.id;

                scope.setState(state => ({
                    dayStats: updatedDayStats,
                }));

                console.log("saved day stats successfully");
            })
            .catch(reason => console.error("error saving day stats" + reason));
    } else {
        firebase.firestore().collection("dayStats")
            .doc(this.state.dayStats.id)
            .set(this.state.dayStats)
            .then(value => console.log("saved day stats successfully"))
            .catch(reason => console.error("error saving day stats" + reason));
    }
}

export function firebaseSaveFeedback(feedback) {
    const currentUser = firebase.auth().currentUser;
    let userId = "null";

    if(currentUser){
        userId = currentUser.uid;
    }

    firebase.firestore().collection("userFeedback")
        .add({
            feedbackText: feedback,
            userId: userId,
        })
        .then(value => console.log("saved feedback successfully"))
        .catch(reason => console.error("error saving feedback" + reason));
}

//todo possibly change to use a promise
export function firebaseGetAllTasks(callback) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    firebase.firestore().collection("tasks")
        .where("userId", "==", currentUser.uid)
        .where("finished", "==", false)
        .get()
        .then(function (querySnapshot) {
            let savedTasks = [];
            let tempTask;

            querySnapshot.forEach(function (doc) {
                tempTask = doc.data();
                tempTask.dateCreated = doc.data().dateCreated.toDate();
                savedTasks.push(tempTask);
            });

            callback(savedTasks);
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

export function firebaseGetDayStats(callback, day) {
    const currentUser = firebase.auth().currentUser;
    const currentDate = formatDayMonth(day);

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    firebase.firestore().collection("dayStats")
        .where("userId", "==", currentUser.uid)
        .where("date", "==", currentDate)
        .limit(1)
        .get()
        .then(function (querySnapshot) {
            if (querySnapshot.empty) {
                callback(null, currentDate);
            } else {
                querySnapshot.forEach(function (doc) {
                    let dayStats = doc.data();
                    dayStats.id = doc.id;

                    callback(dayStats, currentDate);
                });
            }
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

export function parseSavedTasks(savedTasks) {
    let outputSavedTasks = [];
    let newTask;

    if (savedTasks == null) savedTasks = [];

    for (let i = 0; i < savedTasks.length; i++) {
        newTask = new TaskContainer(null, null, null, savedTasks[i]);

        outputSavedTasks.push(newTask);
    }

    return outputSavedTasks;
}