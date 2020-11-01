import Admin = require('firebase-admin');
const moment = require('moment');

const MONDAY = 1;

//todo restructure this. Break down into separate methods

exports.calcFlowTimes = (adminApp: Admin.app.App) => {
	const weekAgo = moment().subtract(7, 'days');
	//get all dayStats from the past week
	const dayStatsPromise = adminApp
		.firestore()
		.collection('dayStats')
		.where('date', '>', weekAgo)
		.orderBy('userId')
		.get()
		.then((snapshot: {docs: any[]}) => snapshot.docs.map(doc => doc.data()));
	//group by userId
	const groupedDayStatsPromise = dayStatsPromise.then((dayStats: any[]) => {
		return dayStats.reduce((r, a) => {
			r[a.userId] = r[a.userId] || [];
			r[a.userId].push(a);
			return r;
		}, Object.create(null));
	});
	//get the userData for the dayStats
	const userDataAndGroupedDayStatPromise = groupedDayStatsPromise.then(
		(groupedDayStat: {userId: any}[]) => {
			//go through all the groups
			//get the user data or null
			const userId = groupedDayStat[0].userId;
			//todo add default here i think
			const userDataPromise = adminApp
				.firestore()
				.collection('userData')
				.doc(userId)
				.get()
				.then((snapshot: {data: () => any}) => snapshot.data());

			return {
				groupedDayStat,
				userDataPromise,
			};
		}
	);
	// //call flow.calcFlowTimes
	// const updateUserDataPromise = userDataAndGroupedDayStatPromise.then((group: [any, any]) => {
	// 	const [dayStat, userData] = group;
	// 	console.log(`Updating ${userData.userId} flow times`);
	// 	return performCalcFlowTimes(dayStat, userData);
	// });
	// //update the userData table if a result is returned

	// return updateUserDataPromise;
};

// const getDayOfWeek = date => {};

const performCalcFlowTimes = (dayStats: {array: any[]}, userData: any) => {
	dayStats.array.forEach(dayStat => {
		//find out what day the current dayStat belongs to
		const dayOfWeek = dayStat.date;
		//create the day if it doesn't exist
		//go through each task in dayStat

		//calculate for 3 hour periods
		//Mon 9-12, 12-15, 15-18, 18-21, 21-24
		//update average value
		//return updated userData
	});
};
