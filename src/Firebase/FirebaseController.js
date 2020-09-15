import "../index.css";
import "../MainApp/auth.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import TaskContainer from "../Task/TaskContainer";
import {formatDayMonth} from "../Utility/Utility";
import {createDayStat} from "../MainApp/DayStat";

//firebase
export const firebaseConfig = {
    apiKey: "AIzaSyAxGvolzw0mVmK5rjfLh9hT3OBgeihjv4o",
    authDomain: "react-task-app-d7d0a.firebaseapp.com",
    databaseURL: "https://react-task-app-d7d0a.firebaseio.com",
    projectId: "react-task-app-d7d0a",
    storageBucket: "react-task-app-d7d0a.appspot.com",
    appId: "1:552127368915:web:e2566ec7eca32b03bd8e26",
    measurementId: "G-470KV7252P",
};

// Configure FirebaseUI.
export const uiConfig = {
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // Whether the display name should be displayed in the Sign Up page.
            requireDisplayName: false
        }
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
    },
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//firebase.analytics();

export function getAuth() {
    return firebase.auth();
}

export function firebaseGetWeekStats(weekDate) {
    let weekDayStatPromises = [];

    for (let i = 0; i < 7; i++) {
        weekDayStatPromises.push(
            firebaseGetDayStat(weekDate)
        );

        weekDate.setDate(weekDate.getDate() - 1);
    }

    return Promise.all(weekDayStatPromises);
}

export function saveAllTasks(tasks) {
    const saveTaskPromises = tasks
        .map(task => firebaseSaveTask(task));
    Promise.all(saveTaskPromises)
        .then();
}

//todo optimise this to only change fields that have changed
export function firebaseSaveTask(task) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    firebase.firestore().collection("tasks")
        .doc(task.id)
        .set({
            id: task.id,
            name: task.name,
            dateCreated: task.dateCreated,
            totalTime: task.totalTime,
            remainingTime: task.remainingTime,
            addTimeAmt: task.addTimeAmt,
            timeUp: task.timeUp,
            started: task.started,
            finished: task.finished,
            paused: task.paused,
            stats: {
                timeAdded: task.stats.timeAdded,
                dateStarted: task.stats.dateStarted,
                dateFinished: task.stats.dateFinished,
                pauseDates: task.stats.pauseDates,
                unpauseDates: task.stats.unpauseDates,
            },
            objectives: task.objectives,
            userId: currentUser.uid,
        })
        .then(() => console.log("saved task successfully"))
        .catch(reason => console.error("error saving task" + reason));
}

export function firebaseSaveDayStat(currentDayStat) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    currentDayStat.userId = currentUser.uid;

    firebase.firestore().collection("dayStats")
        .doc(currentDayStat.id)
        .set(currentDayStat)
        .then(() => console.log("saved day stats successfully"))
        .catch(reason => console.error("error saving day stats" + reason));
}

export function firebaseSaveFeedback(feedback) {
    const currentUser = firebase.auth().currentUser;
    let userId = "null";

    if (currentUser) {
        userId = currentUser.uid;
    }

    firebase.firestore().collection("userFeedback")
        .add({
            feedbackText: feedback,
            userId: userId,
        })
        .then(console.log("saved feedback successfully"))
        .catch(reason => console.error("error saving feedback" + reason));
}

export function firebaseGetAllTasks() {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    return firebase.firestore().collection("tasks")
        .where("userId", "==", currentUser.uid)
        .where("finished", "==", false)
        .get()
        .then(function (querySnapshot) {
            let savedTasks = [];

            querySnapshot.forEach(function (doc) {
                const parsedTask = new TaskContainer(null, null, null, doc.data());
                savedTasks.push(parsedTask);
            });

            return savedTasks;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

export async function firebaseGetDayStat(currentDate) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        //todo test and change this so it doesn't break the promises
        return;
    }

    return firebase.firestore().collection("dayStats")
        .where("userId", "==", currentUser.uid)
        .where("date", "==", formatDayMonth(currentDate))
        .limit(1)
        .get()
        .then(function (querySnapshot) {
            if (querySnapshot.empty) {
                return createDayStat();
            }
            return querySnapshot.docs.pop().data();
        })
        .catch(function (error) {
                console.log("Error getting documents: ", error);
            }
        );
}