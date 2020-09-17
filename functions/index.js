const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.loadTasks = functions.https.onCall(async (data, context) => {
    const tasks = await admin.firestore().collection('tasks')
        .where("userId", "==", context.auth.uid)
        .where("finished", "==", false)
        .limit(50)
        .get()
        .then(snapshot => {
            let savedTasks = [];

            snapshot.forEach(doc => {
                const parsedTask = doc.data();//new TaskContainer(null, null, null, doc.data());
                savedTasks.push(parsedTask);
            });

            return savedTasks;
        });
    const orderedTasks = tasks;

    return {
        tasks: tasks,
        orderedTasks: orderedTasks
    };
});