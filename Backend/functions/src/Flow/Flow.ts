import {DayStat, UserData, FlowTime} from '../Types';

import Admin = require('firebase-admin');
const moment = require('moment');

const WEEK_AGO = moment().subtract(7, 'days');
// const MONDAY = 1;

// todo add more types
// todo rename methods

exports.calcFlowTimes = (adminApp: Admin.app.App) => {
	const dayStatsPromise = getDayStats(adminApp);
	const groupedDayStatsPromise = dayStatsPromise.then((dayStats: Array<DayStat>) => {
		return groupDayStats(dayStats);
	});

	return groupedDayStatsPromise.then((groupedDayStats: Map<string, Array<DayStat>>) => {
		const performCalcPromises = [];

		for (let [userId, dayStats] of groupedDayStats) {
			const userDataPromise = getUserData(userId, adminApp);

			const promise = userDataPromise.then((userData: UserData) => {
				// const updatedUserData = performCalcFlowTimes(dayStats, userData || ({} as UserData));
				// if (updatedUserData) {
				// 	console.log(`Updating ${userId} flow times`);
				// 	return updateUserData(adminApp, updatedUserData, userId);
				// } else return Promise.resolve();
			});

			performCalcPromises.push(promise);
		}

		return performCalcPromises;
	});
};

const updateUserData = (adminApp: Admin.app.App, userData: UserData, userId: string) => {
	return adminApp.firestore().collection('userData').doc(userId).set(userData);
};

const getDayStats = (adminApp: Admin.app.App): Promise<Array<DayStat>> => {
	return adminApp
		.firestore()
		.collection('dayStats')
		.where('date', '>', WEEK_AGO)
		.orderBy('userId')
		.get()
		.then((snapshot: {docs: any[]}) => snapshot.docs.map(doc => doc.data()));
};

const groupDayStats = (dayStats: Array<DayStat>): Map<string, Array<DayStat>> => {
	const map: Map<string, Array<DayStat>> = new Map();

	dayStats.forEach(dayStat => {
		let arr: Array<DayStat> = map.get(dayStat.userId) || [];
		map.set(dayStat.userId, [...arr, dayStat]);
	});

	return map;
};

const getUserData = (userId: string, adminApp: Admin.app.App): Promise<UserData> => {
	return adminApp
		.firestore()
		.collection('userData')
		.doc(userId)
		.get()
		.then((snapshot: {data: any}) => snapshot.data());
};

const performCalcFlowTimes = (dayStats: Array<DayStat>, userData: UserData) => {
	const newUserData = {...userData};

	dayStats.forEach(dayStat => {
		const dayOfWeek = getDayOfWeek(dayStat.date);

		if (!userData.flowTimes.has(dayOfWeek)) {
			newUserData.flowTimes.set(dayOfWeek, new Map());
		}

		dayStat.flow.forEach(flow => {
			const timePeriod = getTimePeriod(flow.time);
			const newFlowTime: FlowTime =
				userData.flowTimes.get(dayOfWeek)?.get(timePeriod) || ({} as FlowTime);

			newFlowTime.totalAverage++;

			newFlowTime.averageFocused = calcNewAvg(
				newFlowTime.averageFocused,
				flow.focused,
				newFlowTime.totalAverage
			);
			newFlowTime.averageProductive = calcNewAvg(
				newFlowTime.averageProductive,
				flow.productive,
				newFlowTime.totalAverage
			);
		});
	});

	return newUserData;
};

const calcNewAvg = (oldAvg: number, newVal: number, newTotal: number) => {
	const oldSum = oldAvg * (newTotal - 1);
	const newSum = oldSum + newVal;
	return newSum / newTotal;
};

const getTimePeriod = (date: any) => {
	const hour = moment(date).hour();
	const interval = 3;
	const hourInterval = hour === 0 ? 0 : Math.floor(hour / interval);

	return String(hourInterval * interval) + '-' + String((hourInterval + 1) * interval);
};

const getDayOfWeek = (date: string) => {
	const dayIndex = moment(date, 'DD-MM-YYYY').day();
	const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return weekDays[dayIndex];
};

export {getTimePeriod, groupDayStats, getDayOfWeek, calcNewAvg, performCalcFlowTimes};
