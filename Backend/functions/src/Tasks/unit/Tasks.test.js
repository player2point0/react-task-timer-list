const Tasks = require('../Tasks');
const data = require('./TasksTestData');

describe('sort tasks into expected order', () => {
	it('returns correctly sorted tasks array', () => {
		const actualTasks = Tasks.sortTasks(data.serverTasks);
		expect(actualTasks).toEqual(data.sortedTasks);
	});
});
