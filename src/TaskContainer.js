import uid from "uid";

class TaskContainer {
	constructor(name, duration, date, savedTask) {
		if (savedTask) {
			this.id = savedTask.id;
			this.name = savedTask.name;
			this.dateCreated = savedTask.dateCreated;
			//time in seconds
			this.totalTime = savedTask.totalTime;
			this.remainingTime = savedTask.remainingTime;
			this.addTimeAmt = savedTask.addTimeAmt;
			this.timeUp = savedTask.timeUp;
			this.started = savedTask.started;
			this.finished = savedTask.finished;
			this.paused = savedTask.paused;
			this.isViewing = savedTask.isViewing;
			this.stats = savedTask.stats;
		} else {
			this.id = uid(32);
			this.name = name;
			this.dateCreated = date;
			//time in seconds
			this.totalTime = duration;
			this.remainingTime = duration;
			this.addTimeAmt = Number(duration / 2);
			this.timeUp = false;
			this.started = false;
			this.finished = false;
			this.paused = false;
			this.isViewing = false;
			this.stats = {
				timeAdded: 0,
				dateStarted: "",
				dateFinished: "",
				pauseDates: [],
				unpauseDates: [],
			};
		}
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
}

export default TaskContainer;
