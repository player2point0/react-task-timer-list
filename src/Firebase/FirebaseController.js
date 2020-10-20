import "../index.css";
import "../MainApp/auth.css";
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import {formatDayMonth} from "../Utility/Utility";
import {createDayStat} from "../MainApp/DayStat";

//firebase
const getFirebaseConfig = () => {
    if (process.env.NODE_ENV === "production") {
        return {
            apiKey: "AIzaSyAxGvolzw0mVmK5rjfLh9hT3OBgeihjv4o",
            authDomain: "react-task-app-d7d0a.firebaseapp.com",
            databaseURL: "https://react-task-app-d7d0a.firebaseio.com",
            projectId: "react-task-app-d7d0a",
            storageBucket: "react-task-app-d7d0a.appspot.com",
            appId: "1:552127368915:web:e2566ec7eca32b03bd8e26",
            measurementId: "G-470KV7252P",
        };
    } else {
        console.log("dev");

        return {
            apiKey: "AIzaSyCc_lxQuL-V8l1rAzlq59u_1rgKjev8mj8",
            authDomain: "flocus-dev.firebaseapp.com",
            databaseURL: "https://flocus-dev.firebaseio.com",
            projectId: "flocus-dev",
            storageBucket: "flocus-dev.appspot.com",
            messagingSenderId: "821315418566",
            appId: "1:821315418566:web:8133f46a27d71f29c11ac7"
        };
    }
}
export const firebaseConfig = getFirebaseConfig();

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

export function firebaseSaveTask(task) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    let taskObj = task.toObject();
    taskObj.userId = currentUser.uid;

    firebase.firestore().collection("tasks")
        .doc(task.id)
        .set(taskObj)
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

export function firebaseSaveUserData(userData) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    firebase.firestore().collection("userData")
        .doc(currentUser.uid)
        .set(userData)
        .then(() => console.log("saved user data successfully"))
        .catch(reason => console.error("error saving user data" + reason));
}

export async function firebaseGetUserData() {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    return firebase.firestore().collection("userData")
        .doc(currentUser.uid)
        .get()
        .then(function (doc) {
            return doc.data();
        })
        .catch(function (error) {
                console.log("Error getting user data: ", error);
            }
        );
}

export async function firebaseGetDayStat(currentDate) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
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