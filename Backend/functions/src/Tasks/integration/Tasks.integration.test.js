const Tasks = require('../Tasks/Tasks');
const admin = require('firebase-admin');

const creds = admin.credential.cert(
	'C:/Users/User/Desktop/Apps/React/react-task-timer-list/Backend/functions/src/flocus-dev-admin-key.json'
);

admin.initializeApp({
	credential: creds,
	databaseURL: 'https://flocus-dev.firebaseio.com',
});

//todo swap with actual function
function test(userId) {
	return admin
		.firestore()
		.collection('tasks')
		.where('userId', '==', userId)
		.where('finished', '==', false)
		.limit(10)
		.get()
		.then(snapshot => {
			const tasks = snapshot.docs.map(doc => doc.data());
			return Tasks.sortTasks(tasks);
		});
}

describe('get sorted tasks', () => {
	it('gets tasks', () => {
		test('bi5D3kIatZgcddB17WyiRg54AFn2').then(val => {
			const numTasks = val.length;
            expect(numTasks).toBeGreaterThan(0);
		});
	});
});
