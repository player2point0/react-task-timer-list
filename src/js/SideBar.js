import React from "react";
import Pomodoro from "../js/Pomodoro.js";
import DayStats from "./DayStats";
import FeedbackForm from "./FeedbackForm";
import {formatTime, padNumWithZero} from "../js/Ultility.js";
import "../css/sideBar.css";

function DayOverview(props) {
    let finishTime = new Date();
    let finishHour;
    let finishMinute;
    let totalPlanned = 0;
    let totalWorked = 0;

    for (let i = 0; i < props.tasks.length; i++) {
        totalPlanned += props.tasks[i].remainingTime;
    }

    finishTime.setTime(finishTime.getTime() + totalPlanned * 1000);

    finishHour = padNumWithZero(finishTime.getHours());
    finishMinute = padNumWithZero(finishTime.getMinutes());

    if(props.dayStats.totalWorked){
        totalWorked = props.dayStats.totalWorked;
    }

    return (
        <React.Fragment>
            <h2>total worked {formatTime(totalWorked)}</h2>
            <h2>total planned {formatTime(totalPlanned)}</h2>
            <h2>finish time {finishHour + ":" + finishMinute}</h2>
        </React.Fragment>
    );
}

function SideBarElement(props){
    return (
        <div className={"sideBarElement"}>
            <h1
                className={"sideBarElementTitle"}
                onClick={props.onClick}
            >{props.name}</h1>
            {!props.contentHTML || <div className={"sideBarElementContent"}>
                {props.contentHTML}
            </div>}
        </div>
    );
}

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDayStats: false,
            showWeekStats: false,
            showSettings: false,
            showOverview: false,
            showFeedback: false,
            dayStatDay: new Date(),
        };

        this.toggleDayStats = this.toggleDayStats.bind(this);
        this.toggleWeekStats = this.toggleWeekStats.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.toggleOverview = this.toggleOverview.bind(this);
        this.toggleFeedback = this.toggleFeedback.bind(this);
    }

    componentDidMount() {
        this.pomodoroTickInterval = setInterval(() => this.props.pomodoroTick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.pomodoroTickInterval);
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

    render() {
        if (!this.props.sideBarToggles.showSideBar) {
            //for scroll bug
            document.body.style.overflow = '';

            return (
                <h1 className="showSideBar" onClick={this.props.toggleSideBar}>
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

        if (this.props.sideBarToggles.showPomodoro) {
            pomodoroHTML = (
                <Pomodoro
                    workTimeRemaining={this.props.pomodoro.workTimeRemaining}
                    breakTimeRemaining={this.props.pomodoro.breakTimeRemaining}
                    resetPomodoro={this.props.resetPomodoro}
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
                    <h1
                        className="hideSideBar"
                        onClick={this.props.toggleSideBar}
                    >sidebar</h1>
                    <SideBarElement
                        onClick={this.toggleOverview}
                        name={"overview"}
                        contentHTML={dayOverviewHTML}
                    />
                    <SideBarElement
                        onClick={this.toggleDayStats}
                        name={"day stats"}
                        contentHTML={dayStatsHTML}
                    />
                    <SideBarElement
                        onClick={this.props.togglePomodoro}
                        name={"pomodoro"}
                        contentHTML={pomodoroHTML}
                    />
                    {/*<h1 onClick={this.toggleWeekStats}>week stats</h1>}
                    {weekStatsHTML*/}
                    {/*<SideBarElement
                        onClick={this.props.syncAll}
                        name={"sync all"}
                    />*/}
                    <SideBarElement
                        onClick={this.toggleFeedback}
                        name={"feedback"}
                        contentHTML={feedbackHTML}
                    />
                </div>
                <div className="closeSideBar" onClick={this.props.toggleSideBar}>
                    <h1>
                        c<br/>l<br/>o<br/>s<br/>e<br/>
                    </h1>
                </div>
            </div>
        );
    }
}

export function toggleSideBar() {
    //uses spread operator, which only creates a shallow copy of sideBarToggles

    this.setState(state => ({
        sideBarToggles: {
            ...state.sideBarToggles,
            showSideBar: !state.sideBarToggles.showSideBar
        },
    }));
}

export function togglePomodoro() {
    //uses spread operator, which only creates a shallow copy of sideBarToggles

    this.setState(state => ({
        sideBarToggles: {
            ...state.sideBarToggles,
            showPomodoro: !state.sideBarToggles.showPomodoro,
        }
    }));
}