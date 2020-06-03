import "../css/index.css";
import "../css/auth.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import TaskContainer from "../js/TaskContainer.js";
import {formatDayMonth} from "../js/Ultility.js";

//firebase
export const firebaseConfig = {
    apiKey: "AIzaSyAxGvolzw0mVmK5rjfLh9hT3OBgeihjv4o",
    authDomain: "react-task-app-d7d0a.firebaseapp.com",
    databaseURL: "https://react-task-app-d7d0a.firebaseio.com",
    projectId: "react-task-app-d7d0a",
    storageBucket: "react-task-app-d7d0a.appspot.com",
    messagingSenderId: "552127368915",
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

export function getCurrentUser(){
    return getAuth().currentUser;
}

export function getAuth() {
    return firebase.auth();
}

export async function loadServerData() {
    let scope = this;
    const currentDate = new Date();

    //get saved tasks
    this.firebaseGetAllTasks(function (savedTasks) {
        scope.setState(state => ({
            tasks: scope.parseSavedTasks(savedTasks),
            showAuthHtml: false,
        }));
    });

    //get saved day stats
    this.firebaseGetDayStats(currentDate)
        .then(function (dayStats) {
            if (dayStats.hasOwnProperty("id")) {
                scope.setState(state => ({
                    dayStats: dayStats,
                }));
            } else {
                scope.createNewDayStats();
            }
        });

    //load a weeks worth of previous day stats
    let weekDayStats = await this.getWeekStats(currentDate);

    this.setState(state => ({
        weekDayStats: weekDayStats,
    }));
}

export async function getWeekStats(weekDate){
    let weekDayStatPromises = [];

    for(let i = 0;i<7;i++){
        weekDayStatPromises.push(
            this.firebaseGetDayStats(weekDate)
        );

        weekDate.setDate(weekDate.getDate()-1);
    }

    return await Promise.all(weekDayStatPromises);
}

// login / signup / guest
export function userAuthChanged(user) {
    if (user) {
        this.loadServerData();
    } else {
        this.setState(state => ({
            showAuthHtml: true,
        }));
    }
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
            isViewing: task.isViewing,
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
        .then(value => console.log("saved task successfully"))
        .catch(reason => console.error("error saving task" + reason));
}

export function firebaseSaveDayStats() {
    const currentUser = firebase.auth().currentUser;
    let currentDayStats = this.state.dayStats;
    let scope = this;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    if (!this.state.dayStats.id) {
        currentDayStats.userId = currentUser.uid;

        firebase.firestore().collection("dayStats")
            .add(this.state.dayStats)
            .then(function (val) {
                //add the id from firebase to the local dayStats
                let updatedDayStats = scope.state.dayStats;
                updatedDayStats.id = val.id;

                scope.setState(state => ({
                    dayStats: updatedDayStats,
                }));

                console.log("saved day stats successfully");
            })
            .catch(reason => console.error("error saving day stats" + reason));
    } else {
        firebase.firestore().collection("dayStats")
            .doc(this.state.dayStats.id)
            .set(this.state.dayStats)
            .then(value => console.log("saved day stats successfully"))
            .catch(reason => console.error("error saving day stats" + reason));
    }
}

export function firebaseSaveFeedback(feedback) {
    const currentUser = firebase.auth().currentUser;
    let userId = "null";

    if(currentUser){
        userId = currentUser.uid;
    }

    firebase.firestore().collection("userFeedback")
        .add({
            feedbackText: feedback,
            userId: userId,
        })
        .then(value => console.log("saved feedback successfully"))
        .catch(reason => console.error("error saving feedback" + reason));
}

//todo change to use a promise
export function firebaseGetAllTasks(callback) {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.error("not logged in");
        return;
    }

    firebase.firestore().collection("tasks")
        .where("userId", "==", currentUser.uid)
        .where("finished", "==", false)
        .get()
        .then(function (querySnapshot) {
            let savedTasks = [];
            let tempTask;

            querySnapshot.forEach(function (doc) {
                tempTask = doc.data();
                tempTask.dateCreated = doc.data().dateCreated.toDate();
                savedTasks.push(tempTask);
            });

            callback(savedTasks);
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

export async function firebaseGetDayStats(date) {
    const currentUser = firebase.auth().currentUser;
    const currentDate = formatDayMonth(date);

    if (!currentUser) {
        console.error("not logged in");
        //todo test and change this so it doesn't break the promises
        return;
    }

    return new Promise(async function(resolve, reject){
        await firebase.firestore().collection("dayStats")
            .where("userId", "==", currentUser.uid)
            .where("date", "==", currentDate)
            .limit(1)
            .get()
            .then(function (querySnapshot) {
                if(querySnapshot.empty){
                    resolve({date: currentDate});
                }
                //returns a single dayStat object
                querySnapshot.forEach(function (doc) {
                    let dayStats = doc.data();
                    dayStats.id = doc.id;

                    resolve(dayStats);
                });
            })
            .catch(function (error) {
                    console.log("Error getting documents: ", error);
                }
            );
    });

    /*
    module.exports.getSavedSongs = async (access_token, axios) =>{

  //get limit
  const limitOptions = {
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { 'Authorization': 'Bearer ' + access_token },
    params: {
      limit: 1,
      offset: 0
    },
    json: true
  };

  const limitResult = await axios(limitOptions);
  const limit = limitResult.data.total;

  //generate enough promises
  let offset = 0;
  let songPromises = [];

  while(offset <= limit)
  {
    songPromises.push(getSongAtOffset(access_token, axios, offset));
    offset += 50;
  }

  let songsArr = await Promise.all(songPromises);  //returns an array of response

  let songIds = [];

  for(let i = 0;i<songsArr.length;i++)
  {
    let songsResponse = songsArr[i].data.items;

    for(let j = 0;j<songsResponse.length;j++)
    {
      let songId = songsResponse[j].track.id;
      songIds.push(songId);
    }
  }

  return songIds;
};

function getSongAtOffset(access_token, axios, offset)
{
  const options = {
    method:'get',
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { 'Authorization': 'Bearer ' + access_token },
    params : {
      limit: 50,
      offset: offset
    },
    json: true
  };

  return new Promise((resolve, reject) => {

    const result = axios(options);

    resolve(result);
  });
}
     */


}

export function parseSavedTasks(savedTasks) {
    let outputSavedTasks = [];
    let newTask;

    if (savedTasks == null) savedTasks = [];

    for (let i = 0; i < savedTasks.length; i++) {
        newTask = new TaskContainer(null, null, null, savedTasks[i]);

        outputSavedTasks.push(newTask);
    }

    return outputSavedTasks;
}