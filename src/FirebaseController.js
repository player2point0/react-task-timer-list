import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import TaskController from "./TaskController.js";
import TaskContainer from "./TaskContainer.js";
import {formatDayMonth, requestNotifications, sendNotification} from "./Ultility";
import Task from "./ReactTask";

const SAVE_INTERVAL = 5*60;

//firebase
const firebaseConfig = {
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
const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        },
    };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

export default class FirebaseController extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: [],//this.loadLocalTasks(),
            showAuthHtml: firebase.auth().currentUser == null,
            time: 0,
            removeTaskId: "",
            setSaveAllTasks: false,

        }

        this.saveAllTasks = this.saveAllTasks.bind(this);
        this.addTask = this.addTask.bind(this);
        this.taskOnClick = this.taskOnClick.bind(this);
        this.taskUp = this.taskUp.bind(this);
        this.taskDown = this.taskDown.bind(this);
        this.startTask = this.startTask.bind(this);
        this.finishTask = this.finishTask.bind(this);
        this.addTime = this.addTime.bind(this);
        this.removeTaskWithId = this.removeTaskWithId.bind(this);
        this.setLoadedTasks = this.setLoadedTasks.bind(this);
        this.firebaseSaveTask = this.firebaseSaveTask.bind(this);
        this.firebaseGetAllTasks = this.firebaseGetAllTasks.bind(this);
        this.loadLocalTasks = this.loadLocalTasks.bind(this);
        this.parseSavedTasks = this.parseSavedTasks.bind(this);

        this.db = firebase.firestore();
    }

    //update all the tasks which are started
    tick() {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].started && !updatedTasks[i].paused) {
                updatedTasks[i].remainingTime--;
                if (updatedTasks[i].remainingTime <= 0) {
                    updatedTasks[i].remainingTime = 0;

                    if (!updatedTasks[i].timeUp) {
                        sendNotification("task out of time", "");
                        updatedTasks[i].isViewing = true;
                        updatedTasks[i].timeUp = true;
                        sendNotification("Task time finished", updatedTasks[i].name);
                        this.saveAllTasks();
                    }
                }
            }
        }

        this.setState(state => ({
            tasks: updatedTasks,
            time: state.time + 1,
        }));

        //save all tasks every n ticks
        if (this.state.time % SAVE_INTERVAL === 0) {
            this.setState({ setSaveAllTasks: true });
        }
    }

    addTask(currentState) {
        requestNotifications();

        //todo improve this
        if (
            !currentState.newTaskName ||
            !currentState.newTaskHours ||
            !currentState.newTaskHours
        )
            return;
        if (isNaN(currentState.newTaskHours) || isNaN(currentState.newTaskMins)) return;
        if (currentState.newTaskHours < 0 || currentState.newTaskMins < 0) return;

        let newTaskDuration = currentState.newTaskHours * 3600 + currentState.newTaskMins * 60;
        let currentDate = new Date(); //todo change so works with multi days

        let newTask = new TaskContainer(
            currentState.newTaskName,
            newTaskDuration,
            currentDate
        );

        this.setState(state => ({
            tasks: state.tasks.concat(newTask),
            setSaveAllTasks: true,
        }));
    }

    //display the selected task
    taskOnClick(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                updatedTasks[i].isViewing = !updatedTasks[i].isViewing;
                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
        });
    }

    //move the selected task up in the UI and nearer to the front in the list
    taskUp(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                if (i - 1 < 0) return; //already in first place

                //swap
                let tempTask = updatedTasks[i];
                updatedTasks[i] = updatedTasks[i - 1];
                updatedTasks[i - 1] = tempTask;

                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    //move the selected task down in the UI and nearer to the end in the list
    taskDown(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                if (i + 1 >= updatedTasks.length) return; //already in last place

                //swap
                let tempTask = updatedTasks[i];
                updatedTasks[i] = updatedTasks[i + 1];
                updatedTasks[i + 1] = tempTask;

                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    startTask(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = updatedTasks.length - 1; i >= 0; i--) {
            if (updatedTasks[i].id === id) {

                if (updatedTasks[i].started) {
                    if (updatedTasks[i].remainingTime >= 0) {
                        if (updatedTasks[i].paused) updatedTasks[i].unPause();
                        else updatedTasks[i].pause();
                    }
                }

                else{
                    updatedTasks[i].start();
                }

                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    finishTask(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = updatedTasks.length - 1; i >= 0; i--) {
            if (updatedTasks[i].id === id) {
                updatedTasks[i].finish();

                this.setState({
                    tasks: updatedTasks,
                    setSaveAllTasks: true,
                    removeTaskId: updatedTasks[i].id
                });

                return;
            }
        }
    }

    removeTaskWithId(id){
        const updatedTasks = this.state.tasks.slice();
        for (let i = updatedTasks.length - 1; i >= 0; i--) {
            if (updatedTasks[i].id === id) {
                updatedTasks.splice(i, 1);

                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    addTime(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                updatedTasks[i].addTime();
                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    //save all tasks
    saveAllTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.state.tasks));

        //todo change this to only saved tasks that have changed
        this.state.tasks.forEach(task => {
            this.firebaseSaveTask(task);
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if(this.state.removeTaskId){
            this.removeTaskWithId(this.state.removeTaskId);
            this.setState({removeTaskId: ""});
        }

        if (this.state.setSaveAllTasks) {
            this.saveAllTasks();
            this.setState({ setSaveAllTasks: false });
        }
    }

    // Listen to the Firebase Auth state and set the local state.
    //interval for the tick method, called when changes are made to the props
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(this.setLoadedTasks);
        this.interval = setInterval(() => this.tick(), 1000);
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
        this.interval();
    }

    // login / signup / guest
    setLoadedTasks(user) {
        let newState = {};
        let scope = this;

        if (user) {
            //get saved tasks
            //display task controller
            this.firebaseGetAllTasks(function (savedTasks) {
                scope.setState(state => ({
                    tasks: scope.parseSavedTasks(savedTasks),
                    showAuthHtml: false,
                }));
            });
        } else {
            //tasks from local storage
            this.setState(state => ({
                tasks: this.loadLocalTasks(),
                showAuthHtml: true,
            }));
        }
    }

    //todo optimise this to only change fields that have changed
    firebaseSaveTask(task) {
        const currentUser = firebase.auth().currentUser;

        if (!currentUser) {
            console.error("not logged in");
            return;
        }

        this.db.collection("tasks")
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
                userId: currentUser.uid,
            })
            .then(value => console.log("saved task successfully"))
            .catch(reason => console.error("error saving task" + reason));
    }

    firebaseGetAllTasks(callback) {
        const currentUser = firebase.auth().currentUser;

        if (!currentUser) {
            console.error("not logged in");
            return;
        }

        this.db.collection("tasks")
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

    //load any saved tasks
    loadLocalTasks() {
        let localSavedTasks = JSON.parse(localStorage.getItem("tasks"));
        return this.parseSavedTasks(localSavedTasks);
    }

    parseSavedTasks(savedTasks) {
        let outputSavedTasks = [];
        let newTask;

        if (savedTasks == null) savedTasks = [];

        for (let i = 0; i < savedTasks.length; i++) {
            newTask = new TaskContainer(null, null, null, savedTasks[i]);

            outputSavedTasks.push(newTask);
        }

        return outputSavedTasks;
    }

    render() {
        let authHtml;

        if(this.state.showAuthHtml) authHtml = <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>;

        return (
            <div>
                {authHtml}
                <TaskController
                    firebaseSaveTask={this.firebaseSaveTask}
                    firebaseGetAllTasks={this.firebaseGetAllTasks}
                    tasks={this.state.tasks}
                    addTask={this.addTask}
                    taskOnClick={this.taskOnClick}
                    taskUp={this.taskUp}
                    taskDown={this.taskDown}
                    startTask={this.startTask}
                    finishTask={this.finishTask}
                    addTime={this.addTime}
                />
            </div>
        );
    }

}