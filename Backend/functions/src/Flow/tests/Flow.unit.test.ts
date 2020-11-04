export {};

const Flow = require('../Flow');
const data = require('./Flow.unit.data');

describe('calculates flow times for a user', () => {
	it('returns updated userData when dayStats provided', () => {});

	it('calculates the average properly', () => {});
});

describe('groups dayStats by userId', () => {
	it('group dayStats with the same userId into one array', () => {
		const result = Flow.groupDayStats(data.user1DayStats);
		const user1DayStats = result[data.userId1];

		expect(user1DayStats).not.toBe(undefined);
		expect(user1DayStats.length).toEqual(3);
	});
});
