import React from "react";
import Pomodoro from "../js/Pomodoro.js";
import Stats from "../js/Stats";
import {formatTime, padNumWithZero} from "../js/Ultility.js";
import "../css/sideBar.css";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function DayOverview(props) {
    let finishTime = new Date();
    let finishHour;
    let finishMinute;
    let totalPlanned = 0;

    for(let i = 0;i<props.tasks.length;i++){
        totalPlanned += props.tasks[i].remainingTime;
    }

    finishTime.setTime(finishTime.getTime() + totalPlanned * 1000);

    finishHour = padNumWithZero(finishTime.getHours());
    finishMinute = padNumWithZero(finishTime.getMinutes());

    return (
        <React.Fragment>
            <h2>total worked {formatTime(props.dayStats.totalWorked)}</h2>
            <h2>total planned {formatTime(totalPlanned)}</h2>
            <h2>finish time {finishHour+":"+finishMinute}</h2>
        </React.Fragment>
    );
}

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            showStats: false,
            showSettings: false,
            showPomodoro: true,
            showOverview: false,
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
        this.toggleOverview = this.toggleOverview.bind(this);
        this.stashBreakTime = this.stashBreakTime.bind(this);
        this.resetPomodoro = this.resetPomodoro.bind(this);

    }

    componentDidMount() {
        this.pomodoroTickInterval = setInterval(() => this.pomodoroTick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.pomodoroTickInterval);
    }

    toggleSideBar() {
        this.setState(state => ({
            showSideBar: !state.showSideBar,
        }));
    }

    toggleStats() {
        this.setState(state => ({
            showStats: !state.showStats,
        }));
    }

    toggleSettings() {
        this.setState(state => ({
            showSettings: !state.showSettings,
        }));
    }

    togglePomodoro() {
        this.setState(state => ({
            showPomodoro: !state.showPomodoro,
        }));
    }

    toggleOverview() {
        this.setState(state => ({
            showOverview: !state.showOverview,
        }));
    }

    stashBreakTime() {
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
        } else if (this.state.pomodoro.stashBreak) {
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

    resetPomodoro() {
        let newPomodoro = {
            startedWork: false,
            startedBreak: false,
            workTimeRemaining: WORK_TIME,
            breakTimeRemaining: BREAK_TIME,
            stashBreak: false,
        };

        this.setState(state => ({
            pomodoro: newPomodoro
        }));
    }

    render() {
        if (!this.state.showSideBar) {
            //for scroll bug
            document.body.style.overflow = '';

            return (
                <h1 className="showSideBar" onClick={this.toggleSideBar}>
                    s<br/>i<br/>d<br/>e<br/>b<br/>a<br/>r
                </h1>
            );
        }

        let statsHTML;
        let dayOverviewHTML;
        let settingsHTML;
        let pomodoroHTML;

        if (this.state.showStats) {
            statsHTML = <Stats
                dayStats={this.props.dayStats}/>;
        }

        if (this.state.showSettings) {
            settingsHTML = "settings html";
        }

        if (this.state.showPomodoro) {
            pomodoroHTML = (
                <Pomodoro
                    workTimeRemaining={this.state.pomodoro.workTimeRemaining}
                    breakTimeRemaining={this.state.pomodoro.breakTimeRemaining}
                    resetPomodoro={this.resetPomodoro}
                />
            );
        }

        if (this.props.dayStats !== null && this.state.showOverview) {
            dayOverviewHTML = (
                <DayOverview
                    tasks={this.props.tasks}
                    dayStats={this.props.dayStats}
                />
            );
        }
        //for scroll bug
        document.body.style.overflow = "hidden";

        return (
            <div className="sideBarContainer">
                <div className="sideBar">
                    <h1 className="hideSideBar" onClick={this.toggleSideBar}>
                        sidebar
                    </h1>
                    <h1 onClick={this.toggleOverview}>overview</h1>
                    {dayOverviewHTML}
                    <h1 onClick={this.toggleStats}>stats</h1>
                    {statsHTML}
                    {/*<h1 onClick={this.toggleWeekOverview}>week overview </h1>*/}
                    <h1 onClick={this.togglePomodoro}>pomodoro</h1>
                    {pomodoroHTML}
                </div>
                <div className="closeSideBar" onClick={this.toggleSideBar}>
                    <h1>
                        c<br/>l<br/>o<br/>s<br/>e<br/>
                    </h1>
                </div>
            </div>
        );
    }
}
