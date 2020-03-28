import uid from "uid";

class TaskContainer {
	constructor(name, duration, date, savedTask) {
		if (savedTask) {
			this.id = savedTask.id;
			this.name = savedTask.name;
			this.date = savedTask.date;
			//time in seconds
			this.totalDuration = savedTask.totalDuration;
			this.remainingTime = savedTask.remainingTime;
			this.additionalTime = savedTask.additionalTime;
			this.timeUp = savedTask.timeUp;
			this.started = savedTask.started;
			this.paused = savedTask.paused;
			this.isViewing = savedTask.isViewing;
			this.stats = savedTask.stats;
		} else {
			this.id = uid(32);
			this.name = name;
			this.date = date;
			//time in seconds
			this.totalDuration = duration;
			this.remainingTime = duration;
			this.additionalTime = Number(duration / 2);
			this.timeUp = false;
			this.started = false;
			this.paused = false;
			this.isViewing = false;
			this.stats = {
				timeAdded: 0,
				timesPaused: 0,
				dateStarted: "",
				dateEnded: "",
				pauseDates: [],
				unpauseDates: [],
			};
		}
	}

	addTime() {
		let extraTime = Number(this.remainingTime) + this.additionalTime;
		this.totalDuration += extraTime;
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
		this.stats.dateStarted =new Date();
	}

	finish() {
		this.stats.dateEnded = new Date();
	}
}

export default TaskContainer;
