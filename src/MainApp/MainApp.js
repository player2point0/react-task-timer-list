import React, {useState, useEffect} from "react";
import "../index.css";
import "./auth.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import TaskController from "../Task/TaskController";
import DayRecap from "../DayRecap/DayRecap";
import {useStoreActions} from 'easy-peasy';
import firebase from 'firebase';

import {
    uiConfig, getAuth, firebaseGetDayStat, firebaseGetWeekStats, firebaseGetUserData
} from "../Firebase/FirebaseController";
import TaskContainer from "../Task/TaskContainer";
import {dateDiffInSeconds} from "../Utility/Utility";

require('firebase/auth');

export default function MainApp() {

    const [showAuthHtml, setShowAuthHtml] = useState(true);
    const [showRecap, setShowRecap] = useState(false);
    const loadDayStat = useStoreActions(actions => actions.dayStat.loadDayStat);
    const loadTasks = useStoreActions(actions => actions.tasks.loadTasks);
    const loadUserData = useStoreActions(actions => actions.userData.loadUserData);
    const [loadingTasks, setLoadingTasks] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = getAuth().onAuthStateChanged((user) => {
            if (user) {
                const currentDate = new Date();

                const loadServerTasks = firebase.functions().httpsCallable('loadTasks');

                const startTime = new Date();
                setLoadingTasks(true);

                loadServerTasks()
                    .then((result) => {
                        console.log(dateDiffInSeconds(startTime, new Date()) + " server");
                        setLoadingTasks(false);

                        loadTasks(result.data.orderedTasks
                            .map(task => new TaskContainer(null, null,null, null, task)));
                    });

                firebaseGetDayStat(currentDate)
                    .then(dayStat => {
                        loadDayStat(dayStat);
                    });

                //todo implement weekStat logic
                firebaseGetWeekStats(currentDate)
                    .then(weekStats => {
                        //console.log(weekStats);
                    });

                firebaseGetUserData()
                    .then(userData => {
                        loadUserData(userData);
                    });

                setShowAuthHtml(false);
            } else {
                setShowAuthHtml(true);
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