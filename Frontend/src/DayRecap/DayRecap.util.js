import {dateDiffInSeconds} from '../Utility/Utility';

const MAX_BREAK_TIME = 5 * 60;

function collectDayStats(tasks) {
	let recapTasksArr = [];

	for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
		const currentTask = tasks[taskIndex];
		let currentStartTime = currentTask.start[0];
		let currentStopTime = currentTask.stop[0];

		for (let timeIndex = 0; timeIndex < tasks[taskIndex].start.length - 1; timeIndex++) {
			let breakLength = dateDiffInSeconds(
				currentTask.stop[timeIndex],
				currentTask.start[timeIndex + 1]
			);

			if (breakLength > MAX_BREAK_TIME) {
				recapTasksArr.push({
					startTime: currentStartTime,
					stopTime: currentStopTime,
					name: currentTask.name,
				});
				currentStartTime = currentTask.start[timeIndex + 1];
			}
			currentStopTime = currentTask.stop[timeIndex + 1];
		}
		// last edge case
		recapTasksArr.push({
			startTime: currentStartTime,
			stopTime: currentStopTime,
			name: currentTask.name,
		});
	}

	return recapTasksArr;
}

function addBreaksBetweenTasks(dayStats) {
	//sort the tasks by time
	dayStats.sort((taskA, taskB) => dateDiffInSeconds(taskB.startTime, taskA.startTime));
	//go through and fill in any spaces
	let recapTasksAndBreaks = [];
	for (let i = 0; i < dayStats.length - 1; i++) {
		let breakLength = dateDiffInSeconds(dayStats[i].stopTime, dayStats[i + 1].startTime);
		let taskLength = dateDiffInSeconds(dayStats[i].stopTime, dayStats[i].startTime);

		if (breakLength > MAX_BREAK_TIME) {
			recapTasksAndBreaks.push({
				startTime: dayStats[i].stopTime,
				stopTime: dayStats[i + 1].startTime,
				name: '',
			});
		}

		recapTasksAndBreaks.push({
			startTime: dayStats[i].startTime,
			stopTime: dayStats[i].stopTime,
			name: dayStats[i].name,
		});
	}
	//last edge case
	const lastIndex = dayStats.length - 1;
    if (lastIndex < 0) return [];
    
	recapTasksAndBreaks.push({
		startTime: dayStats[lastIndex].startTime,
		stopTime: dayStats[lastIndex].stopTime,
		name: dayStats[lastIndex].name,
	});
	return recapTasksAndBreaks;
}

export function groupDayStatTasks(tasks) {
	//go through each task
	//in each task go through the start times
	//compare the gap between the start time and the end time
	//if more than 5 minutes create a new recap task
	//else extend the recap tasks end length
	const collectedTasks = collectDayStats(tasks);
	const filteredTasks = collectedTasks.filter(task => {
		const taskLength = dateDiffInSeconds(task.startTime, task.stopTime);
		const shortTask = taskLength > MAX_BREAK_TIME;
		console.log(shortTask);
		return shortTask;
	});
	const recapTasksAndBreaks = addBreaksBetweenTasks(filteredTasks);
	recapTasksAndBreaks.sort((taskA, taskB) => dateDiffInSeconds(taskB.startTime, taskA.startTime));

	return recapTasksAndBreaks;
}
