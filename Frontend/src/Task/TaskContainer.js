import uid from "uid";

//todo tempted to change this to a static class and change the data to just an object
export default class TaskContainer {
    constructor(name, tag, duration, date, savedTask) {
        if (savedTask) {
            this.id = savedTask.id;
            this.name = savedTask.name;
            //todo refactor with a get or else
            this.tag = savedTask.hasOwnProperty("tag")? savedTask.tag:"";
            if (savedTask.dateCreated.hasOwnProperty("seconds")) {
                this.dateCreated = savedTask.dateCreated.toDate();
            } else {
                //fix for when dateCreated returns a different object bug
                this.dateCreated = new Date(savedTask.dateCreated._seconds * 1000);
            }
            this.totalTime = savedTask.totalTime;
            this.remainingTime = savedTask.remainingTime;
            this.timeUp = savedTask.timeUp;
            this.started = savedTask.started;
            this.finished = savedTask.finished;
            this.reportFlowFlag = false;
            //load tasks as paused to prevent daystat problems and for ux
            this.paused = savedTask.started;
            this.stats = savedTask.stats;
            if(!savedTask.stats.hasOwnProperty("flow")){
                this.stats.flow = [];
            }
            this.objectives = savedTask.objectives;
        } else {
            this.id = uid(32);
            this.name = name;
            this.tag = tag;
            this.dateCreated = date;
            //time in seconds
            this.totalTime = duration;
            this.remainingTime = duration;
            this.timeUp = false;
            this.started = false;
            this.finished = false;
            this.reportFlowFlag = false;
            this.paused = false;
            this.stats = {
                timeAdded: 0,
                dateStarted: "",
                dateFinished: "",
                pauseDates: [],
                unpauseDates: [],
                flow: [],
            };
            this.objectives = [];
        }
    }

    completeObjective(objectiveId) {
        for (let i = 0; i < this.objectives.length; i++) {
            if (this.objectives[i].id === objectiveId) {
                this.objectives[i].finished = true;
            }
        }
    }

    addObjective(name) {
        let newObjective = {};
        newObjective.name = name;
        newObjective.id = uid(32);
        newObjective.finished = false;

        this.objectives.push(newObjective);
    }

    pause() {
        this.paused = true;
        this.stats.pauseDates.push(new Date());
    }

    unPause() {
        this.paused = false;
        this.stats.unpauseDates.push(new Date());
    }

    start() {
        this.started = true;
        this.stats.dateStarted = new Date();
    }

    finish() {
        this.stats.dateFinished = new Date();
        this.finished = true;
    }

    setReportFlow(val) {
        this.reportFlowFlag = val;
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            tag: this.tag,
            dateCreated: this.dateCreated,
            totalTime: this.totalTime,
            remainingTime: this.remainingTime,
            timeUp: this.timeUp,
            started: this.started,
            finished: this.finished,
            paused: this.paused,
            stats: {
                timeAdded: this.stats.timeAdded,
                dateStarted: this.stats.dateStarted,
                dateFinished: this.stats.dateFinished,
                pauseDates: this.stats.pauseDates,
                unpauseDates: this.stats.unpauseDates,
                flow: this.stats.flow,
            },
            objectives: this.objectives,
        }
    }
}