const Tasks = require("./Tasks/Tasks");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//todo alternatively could add a user tabel that contains the tasks to load, could be updated hourly
exports.loadTasks = functions.https.onCall(async (data, context) => {
    return admin.firestore().collection('tasks')
        .where("userId", "==", context.auth.uid)
        .where("finished", "==", false)
        .limit(10)
        .get()
        .then(snapshot => {
            const tasks = snapshot.docs.map(doc => doc.data());
            return Tasks.sortTasks(tasks);
        });
});