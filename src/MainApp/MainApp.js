import React, {useState, useEffect} from "react";
import "../index.css";
import "./auth.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TaskController from "../Task/TaskController";
import DayRecap from "../DayRecap/DayRecap";
import {useStoreState} from 'easy-peasy';

import {
    tick, removeTaskWithId,
} from "../Task/TaskController";

import {
    uiConfig, userAuthChanged, getAuth
} from "../Firebase/FirebaseController";

import {formatDayMonth} from "../Utility/Utility";

const SAVE_INTERVAL = 5 * 60 * 1000; //in milli for set interval

export default function MainApp() {

    const showAuthHtml = useStoreState(state => state.showAuthHtml);
    const [showRecap, setShowRecap] = useState(false);
    /*
        this.toggleDayRecap = this.toggleDayRecap.bind(this);
        this.tick = tick.bind(this);
        this.removeTaskWithId = removeTaskWithId.bind(this);
        this.createNewDayStat = this.createNewDayStat.bind(this);
        this.userAuthChanged = userAuthChanged.bind(this);
    */
    /*
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
    */
    const toggleDayRecap = () => {
        setShowRecap(!showRecap);
    };

    //todo refactor this to a more advanced system of display content
    // one that could also be expanded to work with a a/b system
    // maybe using the state / redux state if it is added
    let authHtml;

    if (showAuthHtml) {
        authHtml = <div className={"authContainer"}>
            <div className={"authTitle"}>sign in / up</div>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()}/>
        </div>;
    }

    return (
        <div>
            <div
                className={"dayRecapButton"}
                onClick={toggleDayRecap}
            >
                recap
            </div>
            {showRecap && <DayRecap/>}
            {authHtml}
            {!showRecap && <TaskController/>}
        </div>
    );
}