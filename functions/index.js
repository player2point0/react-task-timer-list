const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//todo optimise this, maybe return the promise instead of awaiting
// alternatively couls add a user tabel that contains the tasks to load, could be updated hourly
exports.loadTasks = functions.https.onCall(async (data, context) => {
    return admin.firestore().collection('tasks')
        .where("userId", "==", context.auth.uid)
        .where("finished", "==", false)
        .limit(50)
        .get()
        .then(snapshot => {
            const tasks = snapshot.docs.map(doc => doc.data());

            const orderedTasks = tasks.sort((taskA, taskB) => {
                const age = taskA.dateCreated < taskB.dateCreated? 1:0;
                const timeRemaining = taskA.remainingTime < taskB.remainingTime? 0:1;

                const started = taskA.started && !taskB.started? 1:0;

                const mostRecent = 1;//todo compare dateStarted for most recent

                return age + timeRemaining + started;
            });

            return {
                tasks: tasks,
                orderedTasks: orderedTasks
            };
        });

    /*
    create a score for each task
    -tasks that have been started and have high flow values,
    would need to expand task to contain average flow and last active

    could also change the task ordering based on time and periods of flow
     */


});