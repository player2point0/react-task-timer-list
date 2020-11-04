import {DayStat} from '../Types';

import Admin = require('firebase-admin');
const moment = require('moment');

const WEEK_AGO = moment().subtract(7, 'days'); //is that literally all I use moment for
// const MONDAY = 1;

// todo add more types

exports.calcFlowTimes = (adminApp: Admin.app.App) => {
	//get all dayStats from the past week
	const dayStatsPromise = getDayStats(adminApp);
	//group by userId
	const groupedDayStatsPromise = dayStatsPromise.then((dayStats: Array<DayStat>) => {
		return groupDayStats(dayStats);
	});
	//get the userData for the dayStats
	const userDataAndGroupedDayStatPromise = groupedDayStatsPromise.then(
		(groupedDayStat: Array<DayStat>) => {
			//go through all the groups
			//get the user data or null
			const userId = groupedDayStat[0].userId;
			//todo add default here i think
			const userDataPromise = getUserData(userId, adminApp);

			return userDataPromise.then(userData => {
				return performCalcFlowTimes(groupedDayStat, userData);
			});
		}
	);
	//call flow.calcFlowTimes
	const updateUserDataPromise = userDataAndGroupedDayStatPromise.then(updatedUserData => {
		// console.log(`Updating ${userData.userId} flow times`);
		//update the userData table if a result is returned
	});

	return updateUserDataPromise;

	// todo return or await at the end?
};

// const getDayOfWeek = date => {};

const getDayStats = (adminApp: Admin.app.App): Promise<Array<DayStat>> => {
	return adminApp
		.firestore()
		.collection('dayStats')
		.where('date', '>', WEEK_AGO)
		.orderBy('userId')
		.get()
		.then((snapshot: {docs: any[]}) => snapshot.docs.map(doc => doc.data()));
};

// returns an object where the userId is the key
const groupDayStats = (dayStats: Array<DayStat>): Array<DayStat> => {
	return dayStats.reduce((r, a) => {
		r[a.userId] = r[a.userId] || [];
		r[a.userId].push(a);
		return r;
	}, Object.create(null));
};

const getUserData = (userId: string, adminApp: Admin.app.App) => {
	return adminApp
		.firestore()
		.collection('userData')
		.doc(userId)
		.get()
		.then((snapshot: {data: () => any}) => snapshot.data());
};

const performCalcFlowTimes = (dayStats: Array<DayStat>, userData: any) => {
	dayStats.forEach(dayStat => {
		//find out what day the current dayStat belongs to
		// const dayOfWeek = dayStat.date;
		//create the day if it doesn't exist
		//go through each task in dayStat
		//calculate for 3 hour periods
		//Mon 9-12, 12-15, 15-18, 18-21, 21-24
		//update average value
		//return updated userData
	});
};

exports.groupDayStats = groupDayStats;
