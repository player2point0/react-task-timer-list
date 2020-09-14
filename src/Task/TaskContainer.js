import uid from "uid";

const TEN_MINS = 10*60;

export default class TaskContainer {
	constructor(name, duration, date, savedTask) {
		if (savedTask) {
			this.id = savedTask.id;
			this.name = savedTask.name;
			this.dateCreated = savedTask.dateCreated.toDate();
			//time in seconds
			this.totalTime = savedTask.totalTime;
			this.remainingTime = savedTask.remainingTime;
			this.addTimeAmt = savedTask.addTimeAmt;
			this.timeUp = savedTask.timeUp;
			this.started = savedTask.started;
			this.finished = savedTask.finished;
			this.reportFlowFlag = false;
			//load tasks as paused to prevent daystat problems and for ux
			//todo fix this
			this.paused = savedTask.started;
			this.stats = savedTask.stats;
			this.objectives = savedTask.objectives;
		} else {
			this.id = uid(32);
			this.name = name;
			this.dateCreated = date;
			//time in seconds
			this.totalTime = duration;
			this.remainingTime = duration;
			this.addTimeAmt = TEN_MINS;
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
			};
			this.objectives = [];
		}
	}

	completeObjective(objectiveId){
		for(let i = 0;i<this.objectives.length;i++){
			if(this.objectives[i].id === objectiveId){
				this.objectives[i].finished = true;
			}
		}
	}

	addObjective(name){
		let newObjective = {};
		newObjective.name = name;
		newObjective.id = uid(32);
		newObjective.finished = false;

		this.objectives.push(newObjective);
	}

	addTime() {
		let extraTime = Number(this.remainingTime) + this.addTimeAmt;
		this.totalTime += extraTime;
		this.remainingTime = extraTime;
		this.timeUp = false;

		this.stats.timeAdded += extraTime;
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

	//todo could probably change to a toggle
	setReportFlow(val){
		this.reportFlowFlag = val;
	}
}