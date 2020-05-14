import React from "react";
import Pomodoro from "../js/Pomodoro.js";
import DayStats from "./DayStats";
import FeedbackForm from "./FeedbackForm";
import {formatTime, padNumWithZero} from "../js/Ultility.js";
import "../css/sideBar.css";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function DayOverview(props) {
    let finishTime = new Date();
    let finishHour;
    let finishMinute;
    let totalPlanned = 0;

    for (let i = 0; i < props.tasks.length; i++) {
        totalPlanned += props.tasks[i].remainingTime;
    }

    finishTime.setTime(finishTime.getTime() + totalPlanned * 1000);

    finishHour = padNumWithZero(finishTime.getHours());
    finishMinute = padNumWithZero(finishTime.getMinutes());

    return (
        <React.Fragment>
            <h2>total worked {formatTime(props.dayStats.totalWorked)}</h2>
            <h2>total planned {formatTime(totalPlanned)}</h2>
            <h2>finish time {finishHour + ":" + finishMinute}</h2>
        </React.Fragment>
    );
}

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            showDayStats: false,
            showWeekStats: false,
            showSettings: false,
            showPomodoro: true,
            showOverview: false,
            showFeedback: false,
            pomodoro: {
                startedWork: false,
                startedBreak: false,
                workTimeRemaining: WORK_TIME,
                breakTimeRemaining: BREAK_TIME,
                stashBreak: false,
            },
            dayStatDay: new Date(),
        };

        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.toggleDayStats = this.toggleDayStats.bind(this);
        this.toggleWeekStats = this.toggleWeekStats.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.togglePomodoro = this.togglePomodoro.bind(this);
        this.toggleOverview = this.toggleOverview.bind(this);
        this.toggleFeedback = this.toggleFeedback.bind(this);
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

    toggleDayStats() {
        this.setState(state => ({
            showDayStats: !state.showDayStats,
        }));
    }

    toggleWeekStats() {
        this.setState(state => ({
            showWeekStats: !state.showWeekStats,
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

    toggleFeedback() {
        this.setState(state => ({
            showFeedback: !state.showFeedback,
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
        }
        else if (this.state.pomodoro.stashBreak) {
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

        let dayStatsHTML;
        let weekStatsHTML;
        let dayOverviewHTML;
        let settingsHTML;
        let pomodoroHTML;
        let feedbackHTML;

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

        if (this.props.weekDayStats !== null) {
            if (this.state.showOverview) {
                dayOverviewHTML = (
                    <DayOverview
                        tasks={this.props.tasks}
                        dayStats={this.props.weekDayStats[0]}
                    />
                );
            }

            if (this.state.showDayStats) {
                dayStatsHTML = <DayStats
                    weekDayStats={this.props.weekDayStats}
                />;
            }

            if (this.state.showWeekStats) {
                weekStatsHTML = <h2>week stats</h2>;
            }
        }

        if (this.state.showFeedback) {
            feedbackHTML = <FeedbackForm
                firebaseSaveFeedback={this.props.firebaseSaveFeedback}
                toggleFeedback={this.toggleFeedback}
            />;
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
                    <h1 onClick={this.toggleDayStats}>day stats</h1>
                    {dayStatsHTML}
                    {/*<h1 onClick={this.toggleWeekStats}>week stats</h1>}
                    {weekStatsHTML*/}
                    <h1 onClick={this.togglePomodoro}>pomodoro</h1>
                    {pomodoroHTML}
                    <h1 onClick={this.props.syncAll}>sync all</h1>
                    <h1 onClick={this.toggleFeedback}>feedback</h1>
                    {feedbackHTML}
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
