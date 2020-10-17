import React, {useState, useEffect} from "react";
import "../index.css";
import "./auth.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TaskController from "../Task/TaskController";
import DayRecap from "../DayRecap/DayRecap";
import {useStoreActions} from 'easy-peasy';
import firebase from 'firebase';

import {
    uiConfig, getAuth, firebaseGetDayStat, firebaseGetWeekStats
} from "../Firebase/FirebaseController";
import TaskContainer from "../Task/TaskContainer";

require('firebase/auth');

export default function MainApp() {

    const [showAuthHtml, setShowAuthHtml] = useState(true);
    const [showRecap, setShowRecap] = useState(false);
    const updateDayStat = useStoreActions(actions => actions.dayStat.updateDayStat);
    const updateTasks = useStoreActions(actions => actions.tasks.updateTasks);
    const resetTask = useStoreActions(actions => actions.tasks.resetTasks);
    const resetDayStat = useStoreActions(actions => actions.dayStat.resetDayStat);

    const [loadingTasks, setLoadingTasks] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = getAuth().onAuthStateChanged((user) => {
            if (user) {
                const currentDate = new Date();

                const loadTasks = firebase.functions().httpsCallable('loadTasks');

                const time = new Date();
                console.log(time.toISOString() + " start");
                setLoadingTasks(true);

                loadTasks()
                    .then((result) => {
                        const time = new Date();
                        console.log(time.toISOString() + " server");
                        setLoadingTasks(false);

                        updateTasks(result.data.orderedTasks
                            .map(task => new TaskContainer(null, null, null, task)));
                    });

                firebaseGetDayStat(currentDate)
                    .then(dayStat => {
                        updateDayStat(dayStat);
                    });

                firebaseGetWeekStats(currentDate)
                    .then(weekStats => {
                        //console.log(weekStats);
                    });

                setShowAuthHtml(false);
            } else {
                setShowAuthHtml(true);
                //reset the tasks and daystats in case the user signs out
                resetTask();
                alert("reset day stats");
                resetDayStat();
            }
        });

        return () => {
            unregisterAuthObserver();
        };
    }, []);

    const toggleDayRecap = () => {
        setShowRecap(!showRecap);
    };

    //todo refactor this to a more advanced system of display content
    // one that could also be expanded to work with a a/b system
    // maybe using the state / redux state if it is added

    //todo change dayRecap, maybe move to taskController. breaks in innconitto
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
            {loadingTasks&& <div className={"loadingTasks"}>loading tasks</div>}
        </div>
    );
}