import {DayStat, UserData} from '../../Types';

export {};

const Flow = require('../Flow');
const data = require('./Flow.unit.data');

describe('calculates flow times for a user', () => {
	it('calculates the average properly', () => {
		const newUserData: UserData = Flow.performCalcFlowTimes(data.user1DayStats, data.user1UserData);

		expect(newUserData).not.toBeNull();

		data.user1DayStats.forEach((dayStat: DayStat) => {
			const dayOfWeek = Flow.getDayOfWeek(dayStat.date);
			newUserData.flowTimes.get(dayOfWeek);
			const timePeriod = Flow.getTimePeriod(dayStat.flow[0].time);

			const newFlowTimes = newUserData.flowTimes.get(dayOfWeek)?.get(timePeriod);
			const expectedFlowTimes = data.updatedFlowTimes.get(dayOfWeek);

			expect(newFlowTimes).toEqual(expectedFlowTimes);
		});
	});
});

describe('groups dayStats by userId', () => {
	it('group dayStats with the same userId into one array', () => {
		const result: Map<string, Array<DayStat>> = Flow.groupDayStats(data.user1DayStats);
		const numUser1DayStats = result.get(data.userId1)?.length;

		expect(numUser1DayStats).not.toBe(undefined);
		expect(numUser1DayStats).toEqual(3);
	});
});

describe('gets day of week', () => {
	it('returns Tuesday on a Tuesday', () => {
		const dayOfWeek = Flow.getDayOfWeek('03/11/2020');

		expect(dayOfWeek).toEqual('Tuesday');
	});
});

describe('gets the time period', () => {
	it('returns 0-3', () => {
		const date = new Date('December 17, 1995 00:24:00');
		const timePeriod = Flow.getTimePeriod(date);
		expect(timePeriod).toEqual('0-3');
	});

	it('returns 15-18', () => {
		const date = new Date('December 17, 1995 15:24:00');
		const timePeriod = Flow.getTimePeriod(date);
		expect(timePeriod).toEqual('15-18');
	});

	it('returns 21-24', () => {
		const date = new Date('December 17, 1995 21:24:00');
		const timePeriod = Flow.getTimePeriod(date);
		expect(timePeriod).toEqual('21-24');
	});
});

describe('calcs new average', () => {
	it('returns new average', () => {
		/*
		1+2+3 = 6
		6 / 3 = 2

		1+2+3+10 = 16
		16 / 4 = 4
		*/
		const newAvg = Flow.calcNewAvg(2, 10, 4);
		expect(newAvg).toEqual(4);
	});
});
