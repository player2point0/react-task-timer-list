import React from "react";
import "../css/index.css";
import "../css/auth.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TaskController from "./Task/TaskController.js";
import DayRecap from "./DayRecap";

import {
    tick, addTask, updateTaskByIdFunc, taskOnClick, startTask, finishTask,
    reportFlow,removeTaskWithId, addTime, saveAllTasks, completeObjective,
    addObjective, setReportFlow,
} from "./Task/TaskController";

import {
    uiConfig, loadServerData, userAuthChanged,
    firebaseSaveTask, firebaseSaveDayStat, firebaseSaveFeedback,
    firebaseGetAllTasks, firebaseGetDayStat, getWeekStats,
    parseSavedTasks, getCurrentUser, getAuth
} from "./FirebaseController";

import {formatDayMonth} from "../js/Ultility.js";

const SAVE_INTERVAL = 5 * 60 * 1000; //in milli for set interval

export default class MainApp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            showAuthHtml: (getCurrentUser() === null),
            lastTickTime: new Date(),
            removeTaskId: "",
            setSaveAllTasks: false,
            dayStat: null,
            weekDayStats: null,
            showRecap: false,
        };

        this.toggleDayRecap = this.toggleDayRecap.bind(this);
        this.tick = tick.bind(this);
        this.saveAllTasks = saveAllTasks.bind(this);
        this.addTask = addTask.bind(this);
        this.taskOnClick = taskOnClick.bind(this);
        this.startTask = startTask.bind(this);
        this.finishTask = finishTask.bind(this);
        this.addTime = addTime.bind(this);
        this.reportFlow = reportFlow.bind(this);
        this.setReportFlow = setReportFlow.bind(this);
        this.completeObjective = completeObjective.bind(this);
        this.addObjective = addObjective.bind(this);
        this.removeTaskWithId = removeTaskWithId.bind(this);
        this.updateTaskByIdFunc = updateTaskByIdFunc.bind(this);
        this.createNewDayStat = this.createNewDayStat.bind(this);
        this.userAuthChanged = userAuthChanged.bind(this);
        this.firebaseSaveTask = firebaseSaveTask.bind(this);
        this.firebaseSaveDayStat = firebaseSaveDayStat.bind(this);
        this.firebaseSaveFeedback = firebaseSaveFeedback.bind(this);
        this.firebaseGetAllTasks = firebaseGetAllTasks.bind(this);
        this.firebaseGetDayStat = firebaseGetDayStat.bind(this);
        this.getWeekStats = getWeekStats.bind(this);
        this.parseSavedTasks = parseSavedTasks.bind(this);
        this.loadServerData = loadServerData.bind(this);
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

            this.setState({
                setSaveAllTasks: false,
                task: currentTasks
            });
        }

        //check if the day has changed
        let currentDate = formatDayMonth(new Date());
        if (this.state.dayStat !== null) {
            if (this.state.dayStat.date !== currentDate) {
                //update the week stats by one day
                let newWeekDayStats = this.state.weekDayStats.slice();
                //remove the oldest date from the end
                newWeekDayStats.pop();
                //add the latest day stat to the front
                newWeekDayStats.unshift(this.state.dayStat);

                this.setState({
                    weekDayStats: newWeekDayStats,
                });

                this.createNewDayStat();
            }
        }
    }

    // Listen to the Firebase Auth state and set the local state.
    //interval for the tick method, called when changes are made to the props
    componentDidMount() {

        if (this.state.dayStat === null) {
            this.createNewDayStat();
        }

        if (this.state.weekDayStats === null) {
            this.setState(state => ({
                weekDayStats: [state.dayStat]
            }))
        }

        this.unregisterAuthObserver = getAuth().onAuthStateChanged(this.userAuthChanged);
        this.tickInterval = setInterval(() => this.tick(), 1000);
        this.saveInterval = setInterval(() => this.setState({setSaveAllTasks: true}), SAVE_INTERVAL);
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
        clearInterval(this.tickInterval);
        clearInterval(this.saveInterval);
    }

    createNewDayStat() {
        let newDayStat = {
            date: formatDayMonth(new Date()),
            totalWorked: 0,
            totalBreak: 0,
            userId: null,
            tasks: [],
        };

        this.setState({
            dayStat: newDayStat,
            setSaveAllTasks: true,
        });
    }

    toggleDayRecap() {
        this.setState(state => ({
            showRecap: !state.showRecap,
        }));
    }

    render() {
        //todo refactor this to a more advanced system of display content
        // one that could also be expanded to work with a a/b system
        // maybe using the state / redux state if it is added
        let authHtml;
        let weekDayStats = this.state.weekDayStats;

        if (weekDayStats) {
            weekDayStats = weekDayStats.slice();
            //swap day stat loaded from the server with the current one
            weekDayStats.shift();
            weekDayStats.unshift(this.state.dayStat);
        }

        if (this.state.showAuthHtml) {
            authHtml = <div className={"authContainer"}>
                <div className={"authTitle"}>sign in / up</div>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()}/>
            </div>;
        }

        return (
            <div>
                    <div
                        className={"dayRecapButton"}
                        onClick={this.toggleDayRecap}
                    >
                        recap
                    </div>
                {this.state.showRecap? <DayRecap
                    dayStat={this.state.dayStat}
                />:""}
                {authHtml}
                {!this.state.showRecap?<TaskController
                    firebaseSaveTask={this.firebaseSaveTask}
                    firebaseGetAllTasks={this.firebaseGetAllTasks}
                    tasks={this.state.tasks}
                    addTask={this.addTask}
                    taskOnClick={this.taskOnClick}
                    startTask={this.startTask}
                    finishTask={this.finishTask}
                    setReportFlow={this.setReportFlow}
                    reportFlow={this.reportFlow}
                    addTime={this.addTime}
                    completeObjective={this.completeObjective}
                    addObjective={this.addObjective}
                />:""}
            </div>
        );
    }
}