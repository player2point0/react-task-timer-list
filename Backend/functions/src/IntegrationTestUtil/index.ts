import {Task, DayStat} from '../Types';

const Admin = require('firebase-admin');

const creds = Admin.credential.cert(
	'C:/Users/User/Desktop/Apps/React/react-task-timer-list/Backend/functions/src/flocus-dev-admin-key.json'
);

const adminApp = Admin.initializeApp(
	{
		credential: creds,
		databaseURL: 'https://flocus-dev.firebaseio.com',
	},
	'integrationTestsAdminApp'
);

exports.createDayStat = (dayStat: DayStat) => {
	adminApp.firestore().collection('dayStats').doc(dayStat.id).set(dayStat);
};
exports.deleteDayStat = (dayStat: DayStat) =>
	adminApp.firestore().collection('dayStats').doc(dayStat.id).delete();

exports.createTask = (task: Task) => {
	adminApp.firestore().collection('tasks').doc(task.id).set(task);
};
exports.deleteTask = (task: Task) => adminApp.firestore().collection('tasks').doc(task.id).delete();

exports.adminApp = adminApp;
