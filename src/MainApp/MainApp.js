import React, {useState, useEffect} from "react";
import "../index.css";
import "./auth.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TaskController from "../Task/TaskController";
import DayRecap from "../DayRecap/DayRecap";
import {useStoreActions, useStoreState} from 'easy-peasy';

import {
    uiConfig, userAuthChanged, getAuth, firebaseGetAllTasks, firebaseGetDayStat
} from "../Firebase/FirebaseController";

import {formatDayMonth} from "../Utility/Utility";

export default function MainApp() {

    const [showAuthHtml, setShowAuthHtml] = useState(true);
    const [showRecap, setShowRecap] = useState(false);
    const updateDayStat = useStoreActions(actions => actions.dayStat.updateDayStat);
    const updateTasks = useStoreActions(actions => actions.tasks.updateTasks);
    const resetTask = useStoreActions(actions => actions.tasks.resetTasks);
    const resetDayStat = useStoreActions(actions => actions.dayStat.resetDayStat);

    useEffect(() => {
        //todo add logic to create a new dayStat when the day rolls over

        const unregisterAuthObserver = getAuth().onAuthStateChanged((user) => {
            if (user) {
                firebaseGetAllTasks()
                    .then(tasks => {
                        updateTasks(tasks);
                    });

                firebaseGetDayStat(formatDayMonth(new Date()))
                    .then(dayStat => {
                        updateDayStat(dayStat);
                    });

                setShowAuthHtml(false);
            } else {
                setShowAuthHtml(true);
                //reset the tasks and daystats in case the user signs out
                resetTask();
                resetDayStat();
            }
        });

        //todo add weekStats func
        /*
                                if (this.state.weekDayStats === null) {
                                    this.setState(state => ({
                                        weekDayStats: [state.dayStat]
                                    }))
                                }

                let currentDate = formatDayMonth(new Date());
                if (dayStat !== null) {
                    if (dayStat.date !== currentDate) {

                                                //update the week stats by one day
                                                let newWeekDayStats = this.state.weekDayStats.slice();
                                                //remove the oldest date from the end
                                                newWeekDayStats.pop();
                                                //add the latest day stat to the front
                                                newWeekDayStats.unshift(this.state.dayStat);

                                                this.setState({
                                                    weekDayStats: newWeekDayStats,
                                                });

                        createNewDayStat(updateDayStat);
                    }
                }
        */
        return () => {
            unregisterAuthObserver();
        };
    });

    const toggleDayRecap = () => {
        setShowRecap(!showRecap);
    };

    //todo refactor this to a more advanced system of display content
    // one that could also be expanded to work with a a/b system
    // maybe using the state / redux state if it is added

    return (
        <div>
            <div
                className={"dayRecapButton"}
                onClick={toggleDayRecap}
            >
                recap
            </div>
            {showRecap && <DayRecap/>}
            {showAuthHtml &&
            <div className={"authContainer"}>
                <div className={"authTitle"}>sign in / up</div>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()}/>
            </div>}
            {!showRecap && <TaskController/>}
        </div>
    );
}