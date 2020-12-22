import {groupDayStatTasks} from './DayRecap.util';

describe('group day stats into day recap task', () => {
	it('returns non empty task array', () => {
		const data = [
			{
				name: 'test',
				start: ['2020-07-13T11:25:04.102Z'],
				stop: ['2020-07-13T12:25:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);

		expect(tasks.length).toBeGreaterThan(0);
		assertValidRecapTask(tasks[0]);
	});

	it('groups short breaks into one recap task', () => {
		const data = [
			{
				name: 'test',
				start: ['2020-07-13T11:25:04.102Z', '2020-07-13T11:27:04.102Z', '2020-07-13T11:30:04.102Z'],
				stop: ['2020-07-13T11:26:04.102Z', '2020-07-13T11:29:04.102Z', '2020-07-13T11:46:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);

		expect(tasks.length).toEqual(1);
		assertValidRecapTask(tasks[0]);
	});

	it('hides single short tasks', () => {
		const data = [
			{
				name: 'test',
				start: ['2020-07-13T11:25:04.102Z'],
				stop: ['2020-07-13T11:26:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);

		expect(tasks.length).toEqual(0);
	});

	it('places a break recap task between two tasks', () => {
		const data = [
			{
				name: 'test',
				start: ['2020-07-13T11:15:04.102Z'],
				stop: ['2020-07-13T11:36:04.102Z'],
			},
			{
				name: 'test',
				start: ['2020-07-13T15:35:04.102Z'],
				stop: ['2020-07-13T16:56:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);

		expect(tasks.length).toEqual(3);
		assertValidRecapTask(tasks[0]);
		expect(tasks[1].name).toEqual('');
		assertValidRecapTask(tasks[2]);
	});

	it('sorts the tasks by time', () => {
		const data = [
			{
				name: '2',
				start: ['2020-07-13T12:15:04.102Z'],
				stop: ['2020-07-13T12:26:04.102Z'],
			},
			{
				name: '1',
				start: ['2020-07-13T11:15:04.102Z'],
				stop: ['2020-07-13T11:26:04.102Z'],
			},
			{
				name: '3',
				start: ['2020-07-13T13:15:04.102Z'],
				stop: ['2020-07-13T13:26:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);
		const expectedNames = ['1', '', '2', '', '3'];

		expect(tasks.length).toEqual(5);

		for (let i = 0; i < expectedNames.length; i++) {
			assertValidRecapTask(tasks[i]);
			expect(tasks[i].name).toBe(expectedNames[i]);
		}
	});

	it('should not place a break between two different tasks when the difference is less than 5 mins', () => {
		const data = [
			{
				name: 'test',
				start: ['2020-07-13T11:05:04.102Z'],
				stop: ['2020-07-13T11:26:04.102Z'],
			},
			{
				name: 'test',
				start: ['2020-07-13T11:27:04.102Z'],
				stop: ['2020-07-13T11:46:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);

		expect(tasks.length).toEqual(2);
		assertValidRecapTask(tasks[0]);
		assertValidRecapTask(tasks[1]);
	});

	it('should place a break between two different tasks when the difference is more than 5 mins', () => {
		const data = [
			{
				name: 'test',
				start: ['2020-07-13T11:05:04.102Z'],
				stop: ['2020-07-13T11:26:04.102Z'],
			},
			{
				name: 'test',
				start: ['2020-07-13T11:32:04.102Z'],
				stop: ['2020-07-13T11:46:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);

		expect(tasks.length).toEqual(3);
		assertValidRecapTask(tasks[0]);
		expect(tasks[1].name).toEqual('');
		assertValidRecapTask(tasks[2]);
	});

	it('should handle a multi day task well', () => {
		const data = [
			{
				name: 'test',
				start: ['2020-07-13T11:05:04.102Z', '2020-07-14T11:25:04.102Z', '2020-07-15T11:25:04.102Z'],
				stop: ['2020-07-13T11:26:04.102Z', '2020-07-14T12:25:04.102Z', '2020-07-15T18:25:04.102Z'],
			},
		];

		const tasks = groupDayStatTasks(data);

		expect(tasks.length).toEqual(5);
	});
});

function assertValidRecapTask(recapTask) {
	expect(recapTask).toHaveProperty('name');
	expect(recapTask).toHaveProperty('startTime');
	expect(recapTask).toHaveProperty('stopTime');
}
