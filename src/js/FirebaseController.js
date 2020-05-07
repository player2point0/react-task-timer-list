import React from "react";
import "../css/index.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import TaskController from "../js/TaskController.js";
import TaskContainer from "../js/TaskContainer.js";
import {formatDayMonth, requestNotifications, sendNotification} from "../js/Ultility.js";
import SideBar from "../js/SideBar.js";

const SAVE_INTERVAL = 60 * 1000; //in milli for set interval

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
            tasks: [],//todo load from local this.loadLocalTasks(),
            showAuthHtml: (firebase.auth().currentUser === null),
            time: 0,
            removeTaskId: "",
            setSaveAllTasks: false,
            dayStats: null, // todo load from local
        };

        this.saveAllTasks = this.saveAllTasks.bind(this);
        this.addTask = this.addTask.bind(this);
        this.taskOnClick = this.taskOnClick.bind(this);
        this.startTask = this.startTask.bind(this);
        this.finishTask = this.finishTask.bind(this);
        this.addTime = this.addTime.bind(this);
        this.completeObjective = this.completeObjective.bind(this);
        this.addObjective = this.addObjective.bind(this);
        this.removeTaskWithId = this.removeTaskWithId.bind(this);
        this.createNewDayStats = this.createNewDayStats.bind(this);
        this.userAuthChanged = this.userAuthChanged.bind(this);
        this.firebaseSaveTask = this.firebaseSaveTask.bind(this);
        this.firebaseSaveDayStats = this.firebaseSaveDayStats.bind(this);
        this.firebaseGetAllTasks = this.firebaseGetAllTasks.bind(this);
        this.firebaseGetDayStats = this.firebaseGetDayStats.bind(this);
        this.loadLocalTasks = this.loadLocalTasks.bind(this);
        this.parseSavedTasks = this.parseSavedTasks.bind(this);

        this.db = firebase.firestore();
    }

    //update all the tasks which are started
    tick() {
        const updatedTasks = this.state.tasks.slice();
        const updatedDayStats = this.state.dayStats;
        let currentDate = (new Date()).toISOString();

        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].started && !updatedTasks[i].paused) {
                updatedTasks[i].remainingTime--;

                if (updatedTasks[i].remainingTime <= 0) {
                    updatedTasks[i].remainingTime = 0;

                    if (!updatedTasks[i].timeUp) {
                        updatedTasks[i].isViewing = true;
                        updatedTasks[i].timeUp = true;
                        sendNotification("Task time finished", updatedTasks[i].name);

                        this.setState({setSaveAllTasks: true});
                    }
                } else {
                    updatedDayStats.totalWorked += 1;
                }

                let taskInDayStats = false;

                //if a task is active update the stop time
                for (let j = 0; j < updatedDayStats.tasks.length; j++) {
                    if (updatedDayStats.tasks[j].id === updatedTasks[i].id) {
                        let length = updatedDayStats.tasks[j].stop.length;
                        updatedDayStats.tasks[j].stop[length-1] = currentDate;

                        taskInDayStats = true;
                    }
                }

                if(!taskInDayStats){
                    updatedDayStats.tasks.push({
                        id: updatedTasks[i].id,
                        name: updatedTasks[i].name,
                        start: [currentDate],
                        stop: [currentDate],
                    });
                }
                
            }
        }

        this.setState(state => ({
            tasks: updatedTasks,
            time: state.time + 1,
            dayStats: updatedDayStats
        }));

        const milliseconds = (new Date()).getMilliseconds();
        const newTimeout = 1000 - milliseconds;
        this.tickInterval = setTimeout(() => this.tick(), newTimeout);
    }

    addTask(currentState) {
        requestNotifications();

        let name = currentState.newTaskName;
        let hours = currentState.newTaskHours;
        let mins = currentState.newTaskMins;

        //need a name and at least one time value
        if (!name || (!hours && !mins)) return;

        //if we have one and not the other then assume zero
        if (!hours) hours = 0;
        if (!mins) mins = 0;

        //needs to be above zero
        if (hours < 0 || mins < 0 || Number(hours + mins) === 0) return;

        let newTaskDuration = hours * 3600 + mins * 60;
        let currentDate = new Date();

        let newTask = new TaskContainer(
            name,
            newTaskDuration,
            currentDate
        );

        this.setState(state => ({
            tasks: state.tasks.concat(newTask),
            setSaveAllTasks: true,
        }));
    }

    updateTaskByIdFunc(tasks, id, func) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                func(tasks[i]);
                break;
            }
        }
    }

    //display the selected task
    taskOnClick(id) {
        const updatedTasks = this.state.tasks.slice();

        this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
            updatedTask.view();
        });

        this.setState({
            tasks: updatedTasks,
        });
    }

    startTask(id) {
        const updatedTasks = this.state.tasks.slice();
        let updatedDayStats = this.state.dayStats;
        let taskActive = false;
        let currentDate = (new Date()).toISOString();

        //todo check if the task is from a previous day stat and so doesn't exist in the tasks

        this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
            if (updatedTask.started) {
                if (updatedTask.remainingTime >= 0) {
                    if (updatedTask.paused) {
                        updatedTask.unPause();
                        taskActive = true;

                        let taskInDayStats = false;

                        //update the dayStat start and stop values
                        for (let j = 0; j < updatedDayStats.tasks.length; j++) {
                            if (updatedDayStats.tasks[j].id === updatedTask.id) {
                                updatedDayStats.tasks[j].start.push(currentDate);
                                updatedDayStats.tasks[j].stop.push(currentDate);

                                taskInDayStats = true;
                            }
                        }

                        if(!taskInDayStats){
                            updatedDayStats.tasks.push({
                                id: updatedTask.id,
                                name: updatedTask.name,
                                start: [currentDate],
                                stop: [currentDate],
                            });
                        }

                    } else {
                        updatedTask.pause();
                    }
                }
            } else {
                updatedTask.start();
                taskActive = true;
                updatedDayStats.tasks.push({
                    id: updatedTask.id,
                    name: updatedTask.name,
                    start: [currentDate],
                    stop: [currentDate],
                });
            }
        });

        //pause any other active tasks
        if (taskActive) {
            for (let i = 0; i < updatedTasks.length; i++) {
                if (updatedTasks[i].id !== id && updatedTasks[i].started && !updatedTasks[i].paused) {
                    updatedTasks[i].pause();
                    updatedTasks[i].isViewing = false;
                }
            }
        }

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
            dayStats: updatedDayStats,
        });
    }

    finishTask(id) {
        const updatedTasks = this.state.tasks.slice();

        this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
            updatedTask.finish();
        });

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
            removeTaskId: id
        });
    }

    removeTaskWithId(id) {
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

        this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
            updatedTask.addTime();
        });

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    //save all tasks
    saveAllTasks(tasksToSave) {
        localStorage.setItem("tasks", JSON.stringify(tasksToSave));
        let date = formatDayMonth(new Date());
        localStorage.setItem(date, JSON.stringify(this.state.dayStats));

        for (let i = 0; i < tasksToSave.length; i++) {
            this.firebaseSaveTask(tasksToSave[i]);
        }

        this.firebaseSaveDayStats();
    }

    completeObjective(taskId, objectiveId) {
        const updatedTasks = this.state.tasks.slice();

        this.updateTaskByIdFunc(updatedTasks, taskId, function (updatedTask) {
            updatedTask.completeObjective(objectiveId);
        });

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    addObjective(taskId, objectiveName) {
        const updatedTasks = this.state.tasks.slice();

        this.updateTaskByIdFunc(updatedTasks, taskId, function (updatedTask) {
            updatedTask.addObjective(objectiveName);
        });

        this.setState({
            tasks: updatedTasks,
            setSaveAllTasks: true,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.state.removeTaskId) {
            this.removeTaskWithId(this.state.removeTaskId);
            this.setState({removeTaskId: ""});
        }

        if (this.state.setSaveAllTasks) {

            //grab the tasks that have changed
            let taskToSave = [];
            let currentTasks = this.state.tasks.slice();

            for (let i = 0; i < currentTasks.length; i++) {
                if (currentTasks[i].needsSaved) {
                    taskToSave.push(currentTasks[i]);
                    currentTasks[i].needsSaved = false;
                }
            }

            this.saveAllTasks(taskToSave);

            this.setState(state => ({
                setSaveAllTasks: false,
                task: currentTasks
            }));

            //check if the day has changed
            let currentDate = formatDayMonth(new Date());
            if (this.state.dayStats !== null) {
                if (this.state.dayStats.date !== currentDate) {
                    this.createNewDayStats();
                }
            }
        }
    }

    // Listen to the Firebase Auth state and set the local state.
    //interval for the tick method, called when changes are made to the props
    componentDidMount() {

        //todo add offline loading
        if (this.state.tasks === []) {

        }

        if (this.state.dayStats === null) {
            //todo load from local storage
            this.createNewDayStats();
        }

        this.setState(state => ({
            tasks: [],//todo load from local this.loadLocalTasks(),
            dayStats: null, // todo load from local
        }));

        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(this.userAuthChanged);
        this.tickInterval = setTimeout(() => this.tick(), 1000);
        this.saveInterval = setInterval(() => this.setState({setSaveAllTasks: true}), SAVE_INTERVAL);
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
        clearInterval(this.tickInterval);
        clearInterval(this.saveInterval);
    }

    createNewDayStats() {
        let newDayStats = {
            date: formatDayMonth(new Date()),
            totalWorked: 0,
            userId: null,
            tasks: [],
        };

        this.setState(state => ({
            dayStats: newDayStats,
            setSaveAllTasks: true,
        }));
    }

    // login / signup / guest
    userAuthChanged(user) {
        let scope = this;

        if (user) {
            //get saved tasks
            this.firebaseGetAllTasks(function (savedTasks) {
                scope.setState(state => ({
                    tasks: scope.parseSavedTasks(savedTasks),
                    showAuthHtml: false,
                }));
            });

            //get saved day stats
            this.firebaseGetDayStats(function (dayStats) {
                if (dayStats == null) {
                    scope.createNewDayStats();
                } else {
                    scope.setState(state => ({
                        dayStats: dayStats
                    }));
                }
            });
        } else {
            //tasks from local storage
            this.setState(state => ({
                tasks: this.loadLocalTasks(),
                showAuthHtml: true,
            }));

            //day stats from local storage
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
                objectives: task.objectives,
                userId: currentUser.uid,
            })
            .then(value => console.log("saved task successfully"))
            .catch(reason => console.error("error saving task" + reason));
    }

    firebaseSaveDayStats() {
        const currentUser = firebase.auth().currentUser;
        let currentDayStats = this.state.dayStats;
        let scope = this;

        if (!currentUser) {
            console.error("not logged in");
            return;
        }

        if (!this.state.dayStats.id) {
            currentDayStats.userId = currentUser.uid;

            this.db.collection("dayStats")
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
            this.db.collection("dayStats")
                .doc(this.state.dayStats.id)
                .set(this.state.dayStats)
                .then(value => console.log("saved day stats successfully"))
                .catch(reason => console.error("error saving day stats" + reason));
        }
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

    firebaseGetDayStats(callback) {
        const currentUser = firebase.auth().currentUser;
        const currentDate = formatDayMonth(new Date());

        if (!currentUser) {
            console.error("not logged in");
            return;
        }

        this.db.collection("dayStats")
            .where("userId", "==", currentUser.uid)
            .where("date", "==", currentDate)
            .limit(1)
            .get()
            .then(function (querySnapshot) {
                if (querySnapshot.empty) {
                    callback(null);
                } else {
                    querySnapshot.forEach(function (doc) {
                        let dayStats = doc.data();
                        dayStats.id = doc.id;

                        callback(dayStats);
                    });
                }
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

    loadLocalDayStats() {
        let date = formatDayMonth(new Date())
        return JSON.parse(localStorage.getItem(date));
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

        if (this.state.showAuthHtml) authHtml =
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>;

        return (
            <React.Fragment>
                {authHtml}
                <SideBar
                    tasks={this.state.tasks}
                    dayStats={this.state.dayStats}
                    sendNotification={sendNotification}
                />
                <TaskController
                    firebaseSaveTask={this.firebaseSaveTask}
                    firebaseGetAllTasks={this.firebaseGetAllTasks}
                    tasks={this.state.tasks}
                    addTask={this.addTask}
                    taskOnClick={this.taskOnClick}
                    startTask={this.startTask}
                    finishTask={this.finishTask}
                    addTime={this.addTime}
                    completeObjective={this.completeObjective}
                    addObjective={this.addObjective}
                />
            </React.Fragment>
        );
    }
}