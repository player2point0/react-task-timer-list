import React from "react";
import "../css/index.css";
import "../css/auth.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TaskController from "../js/TaskController.js";

import {tick, addTask, updateTaskByIdFunc, taskOnClick, startTask, finishTask,
    removeTaskWithId, addTime, saveAllTasks, completeObjective, addObjective} from "../js/TaskController";

import {uiConfig, loadServerData, userAuthChanged,
    firebaseSaveTask, firebaseSaveDayStats, firebaseSaveFeedback,
    firebaseGetAllTasks, firebaseGetDayStats, parseSavedTasks,
    getCurrentUser, getAuth} from "./FirebaseController";

import {formatDayMonth, sendNotification} from "../js/Ultility.js";
import SideBar from "../js/SideBar.js";

import {BREAK_TIME, WORK_TIME, pomodoroTick,
    resetPomodoro, stashBreakTime} from "../js/Pomodoro"

import {togglePomodoro, toggleSideBar} from "../js/SideBar";

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
            dayStats: null,
            weekDayStats: null,
            pomodoro: {
                startedWork: false,
                startedBreak: false,
                workTimeRemaining: WORK_TIME,
                breakTimeRemaining: BREAK_TIME,
                stashBreak: false,
                hidePomodoro: false,
                updatedPomodoro: false,
                hideSideBar: true,
                updatedSideBar: true,
            },
            sideBarToggles: {
                showPomodoro: true,
                showSideBar: false,
            },
            lastPomodoroTickTime: new Date(),
        };

        this.tick = tick.bind(this);
        this.saveAllTasks = saveAllTasks.bind(this);
        this.addTask = addTask.bind(this);
        this.taskOnClick = taskOnClick.bind(this);
        this.startTask = startTask.bind(this);
        this.finishTask = finishTask.bind(this);
        this.addTime = addTime.bind(this);
        this.completeObjective = completeObjective.bind(this);
        this.addObjective = addObjective.bind(this);
        this.removeTaskWithId = removeTaskWithId.bind(this);
        this.updateTaskByIdFunc = updateTaskByIdFunc.bind(this);
        this.createNewDayStats = this.createNewDayStats.bind(this);
        this.userAuthChanged = userAuthChanged.bind(this);
        this.firebaseSaveTask = firebaseSaveTask.bind(this);
        this.firebaseSaveDayStats = firebaseSaveDayStats.bind(this);
        this.firebaseSaveFeedback = firebaseSaveFeedback.bind(this);
        this.firebaseGetAllTasks = firebaseGetAllTasks.bind(this);
        this.firebaseGetDayStats = firebaseGetDayStats.bind(this);
        this.parseSavedTasks = parseSavedTasks.bind(this);
        this.loadServerData = loadServerData.bind(this);

        this.pomodoroTick = pomodoroTick.bind(this);
        this.stashBreakTime = stashBreakTime.bind(this);
        this.resetPomodoro = resetPomodoro.bind(this);
        this.toggleSideBar = toggleSideBar.bind(this);
        this.togglePomodoro = togglePomodoro.bind(this);
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

        if (this.state.dayStats === null) {
            this.createNewDayStats();
        }

        if(this.state.weekDayStats === null){
            this.setState(state => ({
                weekDayStats: [state.dayStats]
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

    createNewDayStats() {
        let newDayStats = {
            date: formatDayMonth(new Date()),
            totalWorked: 0,
            totalBreak: 0,
            userId: null,
            tasks: [],
        };

        this.setState(state => ({
            dayStats: newDayStats,
            setSaveAllTasks: true,
        }));
    }

    render() {
        let authHtml;
        let weekDayStats = this.state.weekDayStats;

        if(weekDayStats){
            weekDayStats = weekDayStats.slice();
            weekDayStats.unshift(this.state.dayStats);
        }

        if (this.state.showAuthHtml){
            authHtml =<div className={"authContainer"}>
                <h1 className={"authTitle"}>sign in / up</h1>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()}/>
            </div>;
        }

        return (
            <React.Fragment>
                {authHtml}
                <SideBar
                    tasks={this.state.tasks}
                    weekDayStats={weekDayStats}
                    sendNotification={sendNotification}
                    syncAll={this.loadServerData}
                    firebaseSaveFeedback={this.firebaseSaveFeedback}
                    pomodoro={this.state.pomodoro}
                    pomodoroTick={this.pomodoroTick}
                    resetPomodoro={this.resetPomodoro}
                    sideBarToggles={this.state.sideBarToggles}
                    toggleSideBar={this.toggleSideBar}
                    togglePomodoro={this.togglePomodoro}
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