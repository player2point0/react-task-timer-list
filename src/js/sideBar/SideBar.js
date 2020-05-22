import React from "react";
import Pomodoro from "./Pomodoro.js";
import DayStats from "./DayStats";
import FeedbackForm from "./FeedbackForm";
import DayOverview from "./DayOverview";
import "../../css/sideBar.css";

function SideBarElement(props){
    return (
        <div className={"sideBarElement"}>
            <div
                className={"sideBarElementTitle"}
                onClick={props.onClick}
            >{props.name}</div>
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
                <div
                    className="showSideBar"
                    onClick={this.props.toggleSideBar}
                >sidebar</div>
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
                    onBreak={this.props.pomodoro.startedWork && this.props.pomodoro.startedBreak}
                    stashBreakTime={this.props.stashBreakTime}
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
                weekStatsHTML = <div>week stats</div>;
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
                    <div
                        className="hideSideBar"
                        onClick={this.props.toggleSideBar}
                    >sidebar</div>
                    <SideBarElement
                        onClick={this.toggleOverview}
                        name={"overview"}
                        contentHTML={dayOverviewHTML}
                    />
                    <div className={"sideBarHideMobile"}>
                        <SideBarElement
                            onClick={this.toggleDayStats}
                            name={"day stats"}
                            contentHTML={dayStatsHTML}
                        />
                    </div>
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
                <div
                    className="closeSideBar"
                    onClick={this.props.toggleSideBar}
                >
                    <div>close</div>
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