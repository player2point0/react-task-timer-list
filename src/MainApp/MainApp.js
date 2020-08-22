import React, {useState, useEffect} from "react";
import "../index.css";
import "./auth.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TaskController from "../Task/TaskController";
import DayRecap from "../DayRecap/DayRecap";
import {useStoreState} from 'easy-peasy';

import {
    uiConfig, userAuthChanged, getAuth
} from "../Firebase/FirebaseController";

import {formatDayMonth} from "../Utility/Utility";

export default function MainApp() {

    const showAuthHtml = useStoreState(state => state.showAuthHtml);
    const [showRecap, setShowRecap] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = getAuth().onAuthStateChanged(userAuthChanged);


        //todo create a update dayStat function that checks for date changes
        /*
                if (this.state.dayStat === null) {
                    this.createNewDayStat();
                }

                if (this.state.weekDayStats === null) {
                    this.setState(state => ({
                        weekDayStats: [state.dayStat]
                    }))
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
        */

        return () => {
            unregisterAuthObserver();
        };
    });

    const createNewDayStat = () => {
        return {
            date: formatDayMonth(new Date()),
            totalWorked: 0,
            totalBreak: 0,
            userId: null,
            tasks: [],
        };
    };

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