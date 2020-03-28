import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import TaskController from "./TaskController.js";
import * as serviceWorker from "./serviceWorker.js";
import { formatDayMonth } from "./Ultility";
import TaskContainer from "./TaskContainer.js";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const firebaseui = require("firebaseui");

serviceWorker.register();

//firebase
const firebaseConfig = {
	apiKey: "AIzaSyAxGvolzw0mVmK5rjfLh9hT3OBgeihjv4o",
	authDomain: "react-task-app-d7d0a.firebaseapp.com",
	databaseURL: "https://react-task-app-d7d0a.firebaseio.com",
	projectId: "react-task-app-d7d0a",
	storageBucket: "react-task-app-d7d0a.appspot.com",
	messagingSenderId: "552127368915",
	appId: "1:552127368915:web:e2566ec7eca32b03bd8e26",
	measurementId: "G-470KV7252P",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

var ui = new firebaseui.auth.AuthUI(firebase.auth());

if (ui.isPendingRedirect()) {
	ui.start("#firebaseui-auth-container", {
		signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
		requireDisplayName: false,
	});
}

function firebaseGetAllTasks(callback) {
	const currentUser = firebase.auth().currentUser;

	if (!currentUser) {
		console.error("not logged in");
		return;
	}

	db.collection("tasks")
		.where("userId", "==", currentUser.uid)
		.where("finished", "==", false)
		.get()
		.then(function(querySnapshot) {
			let savedTasks = [];
			let tempTask;

			querySnapshot.forEach(function(doc) {
				tempTask = doc.data();

				console.log((tempTask));
				tempTask.dateCreated = doc.data().dateCreated.toDate();

				savedTasks.push(tempTask);
			});

			callback(savedTasks);
		})
		.catch(function(error) {
			console.log("Error getting documents: ", error);
		});
}

function firebaseSaveTask(task) {
	const currentUser = firebase.auth().currentUser;

	if (!currentUser) {
		console.error("not logged in");
		return;
	}

	console.log(task);

	db.collection("tasks")
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
			userId: currentUser.uid,
		})
        .then(value => console.log("saved task successfully"))
        .catch(reason => console.error("error saving task"+reason));
}

// login / signup / guest
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		//get saved tasks
		//display task controller
		firebaseGetAllTasks(savedTasks => {
			ReactDOM.render(
				<div>
					<TaskController
						firebaseSaveTask={firebaseSaveTask}
						firebaseGetAllTasks={firebaseGetAllTasks}
						savedTasks={parseSavedTasks(savedTasks)}
					/>
				</div>,
				document.getElementById("root")
			);
		});
	} else {
		//tasks from local storage
		ReactDOM.render(
			<TaskController
				firebaseSaveTask={firebaseSaveTask}
				firebaseGetAllTasks={firebaseGetAllTasks}
				savedTasks={loadLocalTasks()}
			/>,
			document.getElementById("root")
		);
	}
});

//load any saved tasks
function loadLocalTasks() {
	let localSavedTasks = JSON.parse(localStorage.getItem("tasks"));
	return parseSavedTasks(localSavedTasks);
}

function parseSavedTasks(savedTasks) {
	let outputSavedTasks = [];
	let newTask;

	if (savedTasks == null) savedTasks = [];

	for (let i = 0; i < savedTasks.length; i++) {
		newTask = new TaskContainer(null, null, null, savedTasks[i]);

		outputSavedTasks.push(newTask);
	}

	return outputSavedTasks;
}

ReactDOM.render(
	<TaskController
		firebaseSaveTask={firebaseSaveTask}
		firebaseGetAllTasks={firebaseGetAllTasks}
		savedTasks={loadLocalTasks()}
	/>,
	document.getElementById("root")
);
