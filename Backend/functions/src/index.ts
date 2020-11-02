import * as functions from 'firebase-functions';
import {CallableContext} from 'firebase-functions/lib/providers/https';

const Admin = require('firebase-admin');
const adminApp = Admin.initializeApp();

const Tasks = require('./Tasks/Tasks');
const Flow = require('./Flow/Flow');

const CRON_EVERY_MON_AT_FIVE_AM = '0 5 * * 1';

//todo fix the types

//todo alternatively could add a user table that contains the tasks to load, could be updated hourly
exports.loadTasks = functions.https.onCall(async (_data, context: CallableContext) => {
	const userId = context.auth?.uid as String;

	// todo check if there is a better way to return a response
	// todo check how this works when signed out
	if (!userId) return;

	return Tasks.getOrderedTasks(userId, adminApp);
});

//runs every monday
exports.calcFlowTimes = functions.pubsub
	.schedule(CRON_EVERY_MON_AT_FIVE_AM)
	.timeZone('Europe/Dublin')
	.onRun(() => {
		Flow.calcFlowTimes();
	});

// todo create an hourly function to send notifications about high flow periods
