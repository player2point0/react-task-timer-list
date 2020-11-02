import {testUserId, testTask} from './Tasks.integration.data';
const Tasks = require('../Tasks');
const intUtil = require('../../IntegrationTestUtil');

describe('get sorted tasks', () => {
	beforeAll(async () => {
		await intUtil.createTask(testTask);
	});

	afterAll(async () => {
		await intUtil.deleteTask(testTask);
	});

	it('gets tasks', async () => {
		await Tasks.getOrderedTasks(testUserId, intUtil.adminApp).then((val: any[]) => {
			const numTasks = val.length;
			val.forEach(task => {
				console.log(task.name);
			});
			expect(numTasks).toBeGreaterThan(0);
		});
	});
});
