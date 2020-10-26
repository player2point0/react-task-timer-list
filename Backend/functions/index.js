const Tasks = require("./Tasks/Tasks");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp();

const CRON_EVERY_MON_AT_FIVE_AM = "'0 5 * * 1";

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

//runs every mone
exports.calcFlowTimes = functions.pubsub.schedule(CRON_EVERY_MON_AT_FIVE_AM)
    .timeZone('Europe/Dublin')
    .onRun((context) => {
        const weekAgo = moment().subtract(7, 'days');
        //get all dayStats from the past week
        const dayStatsPromise = admin.firestore().collection('dayStats')
            .where("date", ">", weekAgo)
            .orderBy("userId")
            .get()
            .then(snapshot => snapshot.docs.map(doc => doc.data()));
        //group by userId
        const groupedDayStatsPromise = dayStatsPromise.then(dayStats => {
            return dayStats.reduce((r, a) => {
                r[a.userId] = r[a.userId] || [];
                r[a.userId].push(a);
                return r;
            }, Object.create(null));
        })
        //get the userData for the dayStats
        const userDataAndGroupedDayStatPromise = groupedDayStatsPromise.then(groupedDayStat => {

            //go through all the groups
            //get the user data or null
            const userId = groupedDayStat[0].userId;
            //todo add default here i think
            const userDataPromise = admin.firestore().collection('userData')
                .doc(userId)
                .get()
                .then(snapshot => snapshot.data());

            return {
                dayStats,
                userDataPromise,
            };
        })
        //call flow.calcFlowTimes
        const val = userDataAndGroupedDayStatPromise.then(group => {
            const [dayStat, userData] = group;

            Flow.calcFlowTimes(dayStat, userData);

            return 1;
        })
        //update the userData table if a result is returned

        console.log('');
        return null;
    });