const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.loadTasks = functions.https.onCall(async (data, context) => {

    const tasks = await admin.firestore().collection('tasks')
        .where("userId", "==", context.auth.uid)
        .where("finished", "==", false)
        .get();
    const orderedTasks = tasks.splice();

    return {
        tasks: tasks,
        orderedTasks: orderedTasks
    };
});