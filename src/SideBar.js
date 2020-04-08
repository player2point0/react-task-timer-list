import React from "react";
import Pomodoro from "./Pomodoro.js";
import {formatDayMonth, formatTime, getDateStr} from "./Ultility.js";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            showStats: true,
            showSettings: false,
            showPomodoro: true,
            pomodoro: {
                startedWork: false,
                startedBreak: false,
                workTimeRemaining: WORK_TIME,
                breakTimeRemaining: BREAK_TIME,
                stashBreak: false,
            },
        };

        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.toggleStats = this.toggleStats.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.togglePomodoro = this.togglePomodoro.bind(this);
        this.stashBreakTime = this.stashBreakTime.bind(this);

        this.interval = setInterval(() => this.pomodoroTick(), 1000);
    }

    toggleSideBar() {
        const currentState = this.state.showSideBar;

        this.setState(state => ({
            showSideBar: !currentState,
        }));
    }

    toggleStats() {
        const currentState = this.state.showStats;

        this.setState(state => ({
            showStats: !currentState,
        }));
    }

    toggleSettings() {
        const currentState = this.state.showSettings;

        this.setState(state => ({
            showSettings: !currentState,
        }));
    }

    togglePomodoro() {
        const currentState = this.state.showPomodoro;

        this.setState(state => ({
            showPomodoro: !currentState,
        }));
    }

    stashBreakTime(){
        const stashPomodoro = this.state.pomodoro;

        stashPomodoro.stashBreak = true;

        this.setState(state => ({
            pomodoro: stashPomodoro,
        }));
    }

    pomodoroTick() {
        let activeTask = false;
        const tempTasks = this.props.tasks;
		let updatedPomodoro = this.state.pomodoro;
		let currentState = this.state;

        //check for an active task
        for (let i = 0; i < tempTasks.length; i++) {
            //check for a running task
            if (
                tempTasks[i].started &&
                !tempTasks[i].paused &&
                tempTasks[i].remainingTime > 0
            ) {
                activeTask = true;
                break;
            }
        }

        //nothing to do - afk
        if (!activeTask) return;

        //if not started and have an active task
        //then start the work time or the break timer
        if (!this.state.pomodoro.startedWork) {
			updatedPomodoro.startedWork = true;
			updatedPomodoro.workTimeRemaining = WORK_TIME;
        }

        else if(this.state.pomodoro.stashBreak){
            updatedPomodoro.workTimeRemaining = WORK_TIME;
            updatedPomodoro.breakTimeRemaining += BREAK_TIME;
            updatedPomodoro.startedBreak = false;
            updatedPomodoro.startedWork = true;

            updatedPomodoro.stashBreak = false;

            //hide the side bar
            currentState.showSideBar = false;
        }

        //perform the ticks and other logic
        else {
            if (this.state.pomodoro.workTimeRemaining > 0) {
				updatedPomodoro.workTimeRemaining--;
            } else {
                //start break
                if (!this.state.pomodoro.startedBreak) {

                    //pause tasks
					updatedPomodoro.startedBreak = true;
                    //show the side bar
					currentState.showPomodoro = true;
                    currentState.showSideBar = true;

                    //call callback to show notification, with stashing of break time
                    let scope = this;

                    this.props.sendNotification(
                        "Break time started",
                        "click to stash break",
                        this.stashBreakTime
                    );

                } else if (this.state.pomodoro.breakTimeRemaining > 0) {
					updatedPomodoro.breakTimeRemaining--;
                }

                //break finished
                else {
                    //call other callback to show notification
                    this.props.sendNotification("Break time finished", "");

					updatedPomodoro.startedWork = false;
					updatedPomodoro.startedBreak = false;
					updatedPomodoro.breakTimeRemaining = BREAK_TIME;
					updatedPomodoro.workTimeRemaining = WORK_TIME;

                    //hide the side bar
                    currentState.showSideBar = false;
                }
            }
        }

        this.setState(state => ({
            pomodoro: updatedPomodoro,
            showPomodoro: currentState.showPomodoro,
            showSideBar: currentState.showSideBar,
        }));
    }

    stats() {
        const currentTasks = this.props.tasks;
        let totalTimeWorked = 0;
        let totalAdditionalTime = 0;

        for (let i = 0; i < currentTasks.length; i++) {
            totalTimeWorked += currentTasks[i].totalTime - currentTasks[i].remainingTime;
            totalAdditionalTime += currentTasks[i].stats.timeAdded;
        }

        return (
            <div>
                <h3>worked : {formatTime(totalTimeWorked)}</h3>
                <h3>additional : {formatTime(totalAdditionalTime)}</h3>
            </div>
        );
    }

    render() {
        if (!this.state.showSideBar) {
            return (
                <h1 className="showSideBar" onClick={this.toggleSideBar}>
                    s<br></br>i<br></br>d<br></br>e<br></br>b<br></br>a<br></br>r
                </h1>
            );
        }

        let statsHTML;
        let settingsHTML;
        let pomodoroHTML;

        if (this.state.showStats) {
            statsHTML = this.stats();
        }

        if (this.state.showSettings) {
            settingsHTML = "settings html";
        }

        if (this.state.showPomodoro) {
            pomodoroHTML = (
                <Pomodoro
                    workTimeRemaining={this.state.pomodoro.workTimeRemaining}
                    breakTimeRemaining={this.state.pomodoro.breakTimeRemaining}
                />
            );
        }

        return (
            <div className="sideBarContainer">
                <div className="sideBar">
                    <h1 className="hideSideBar" onClick={this.toggleSideBar}>
                        sidebar
                    </h1>
                    <h1 onClick={this.toggleStats}>stats</h1>
                    {statsHTML}
                    <h1 onClick={this.togglePomodoro}>pomodoro</h1>
                    {pomodoroHTML}
                </div>
                <div className="closeSideBar" onClick={this.toggleSideBar}>
                    <h1>
                        c<br></br>l<br></br>o<br></br>s<br></br>e<br></br>
                    </h1>
                </div>
            </div>
        );
    }
}
