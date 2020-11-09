import moment = require('moment');
import {DayStat, UserData, FlowTime} from '../../Types';

const userId1 = 'userId1';
const TODAY = new Date();
const TODAY_0 = moment(TODAY).hour(0);
const TODAY_1 = moment(TODAY).hour(1);
const YESTERDAY_YESTERDAY = moment(TODAY).subtract(2, 'days').hour(0);
const YESTERDAY_22 = moment(TODAY).subtract(1, 'days').hour(22);
const YESTERDAY_23 = moment(TODAY).subtract(1, 'days').hour(23);

const updatedFlowTimes: Map<string, FlowTime> = new Map();
updatedFlowTimes.set(formatDayMonth(TODAY_0), buildUserDataFlow(0.9, 0.35, 2));
updatedFlowTimes.set(formatDayMonth(YESTERDAY_YESTERDAY), buildUserDataFlow(0.1, 0.1, 1));
updatedFlowTimes.set(formatDayMonth(YESTERDAY_22), buildUserDataFlow(0.8, 0.2, 1));

const user1UserData: UserData = {
	flowTimes: new Map(),
	tags: [],
};

const dayStat1: DayStat = {
	id: '1234',
	userId: userId1,
	date: formatDayMonth(TODAY_0),
	flow: [buildDayStatFlow(1, 0.5, TODAY_0), buildDayStatFlow(0.8, 0.2, TODAY_1)],
	tasks: [],
};

const dayStat2: DayStat = {
	id: '1234',
	userId: userId1,
	date: formatDayMonth(YESTERDAY_YESTERDAY),
	flow: [buildDayStatFlow(0.1, 0.1, YESTERDAY_YESTERDAY)],
	tasks: [],
};

const dayStat3: DayStat = {
	id: '1234',
	userId: userId1,
	date: formatDayMonth(YESTERDAY_23),
	flow: [buildDayStatFlow(0.1, 0.1, YESTERDAY_22), buildDayStatFlow(0.5, 0.5, YESTERDAY_23)],
	tasks: [],
};

const user1DayStats: Array<DayStat> = [dayStat1, dayStat2, dayStat3];

export {user1DayStats, userId1, user1UserData, updatedFlowTimes};

// todo move to separate node module
function formatDayMonth(d: moment.Moment) {
	let date = d.date();
	let month = d.month() + 1; // Since getMonth() returns month from 0-11 not 1-12
	let year = d.year();

	return date + '/' + month + '/' + year;
}

function buildUserDataFlow(focus: number, productive: number, total: number): FlowTime {
	return {
		averageFocused: focus,
		averageProductive: productive,
		totalAverage: total,
	};
}

function buildDayStatFlow(focus: number, productive: number, time: moment.Moment) {
	return {
		focus: focus,
		productive: productive,
		time: time,
	};
}
