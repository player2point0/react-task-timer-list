import * as functions from 'firebase-functions';
import {CallableContext} from 'firebase-functions/lib/providers/https';

const Admin = require('firebase-admin');
const adminApp = Admin.initializeApp();

const Tasks = require('./Tasks/Tasks');
// const moment = require('moment');
// const Flow = require('./Flow/Flow');

// const CRON_EVERY_MON_AT_FIVE_AM = '0 5 * * 1';

//todo fix the types

//todo alternatively could add a user table that contains the tasks to load, could be updated hourly
exports.loadTasks = functions.https.onCall(async (_data, context: CallableContext) => {
	const userId = context.auth?.uid as String;

	// todo check if there is a better way to return a response
	// todo check how this works when signed out
	if (!userId) return;

	return Tasks.getOrderedTasks(userId, adminApp);
});

// //runs every monday
// exports.calcFlowTimes = functions.pubsub
// 	.schedule(CRON_EVERY_MON_AT_FIVE_AM)
// 	.timeZone('Europe/Dublin')
// 	.onRun(context => {
// 		const weekAgo = moment().subtract(7, 'days');
// 		//get all dayStats from the past week
// 		const dayStatsPromise = admin
// 			.firestore()
// 			.collection('dayStats')
// 			.where('date', '>', weekAgo)
// 			.orderBy('userId')
// 			.get()
// 			.then((snapshot: {docs: any[]}) => snapshot.docs.map(doc => doc.data()));
// 		//group by userId
// 		const groupedDayStatsPromise = dayStatsPromise.then((dayStats: any[]) => {
// 			return dayStats.reduce((r, a) => {
// 				r[a.userId] = r[a.userId] || [];
// 				r[a.userId].push(a);
// 				return r;
// 			}, Object.create(null));
// 		});
// 		//get the userData for the dayStats
// 		const userDataAndGroupedDayStatPromise = groupedDayStatsPromise.then(
// 			(groupedDayStat: {userId: any}[]) => {
// 				//go through all the groups
// 				//get the user data or null
// 				const userId = groupedDayStat[0].userId;
// 				//todo add default here i think
// 				const userDataPromise = admin
// 					.firestore()
// 					.collection('userData')
// 					.doc(userId)
// 					.get()
// 					.then((snapshot: {data: () => any}) => snapshot.data());

// 				return {
// 					groupedDayStat,
// 					userDataPromise,
// 				};
// 			}
// 		);
// 		//call flow.calcFlowTimes
// 		const updateUserDataPromise = userDataAndGroupedDayStatPromise.then((group: [any, any]) => {
// 			const [dayStat, userData] = group;
// 			console.log(`Updating ${userData.userId} flow times`);
// 			return Flow.calcFlowTimes(dayStat, userData);
// 		});
// 		//update the userData table if a result is returned

// 		return updateUserDataPromise;
// 	});
