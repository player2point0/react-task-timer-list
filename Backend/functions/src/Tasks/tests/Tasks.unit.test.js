const Tasks = require('../Tasks');
const data = require('./Tasks.unit.data');

describe('sort tasks into expected order', () => {
	it('returns correctly sorted tasks array', () => {
		const actualTasks = Tasks.orderTasks(data.serverTasks);
		expect(actualTasks).toEqual(data.sortedTasks);
	});
});
