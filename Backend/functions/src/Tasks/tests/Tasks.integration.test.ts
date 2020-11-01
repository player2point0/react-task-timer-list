import {testUserId, testTask} from './Tasks.integration.data';

const Tasks = require('../Tasks');
const Admin = require('firebase-admin');

const creds = Admin.credential.cert(
	'C:/Users/User/Desktop/Apps/React/react-task-timer-list/Backend/functions/src/flocus-dev-admin-key.json'
);

const adminApp = Admin.initializeApp(
	{
		credential: creds,
		databaseURL: 'https://flocus-dev.firebaseio.com',
	},
	'integrationTestsAdminApp'
);

describe('get sorted tasks', () => {
	beforeAll(async () => {
		await adminApp.firestore().collection('tasks').doc(testTask.id).set(testTask);
	});

	afterAll(async () => {
		await adminApp.firestore().collection('tasks').doc(testTask.id).delete();
	});

	it('gets tasks', async () => {
		await Tasks.getOrderedTasks(testUserId, adminApp).then((val: any[]) => {
			const numTasks = val.length;
			val.forEach(task => {
				console.log(task.name);
			});
			expect(numTasks).toBeGreaterThan(0);
		});
	});
});
