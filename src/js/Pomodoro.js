import React from "react";
import { formatTime } from "../js/Ultility.js";

export const WORK_TIME = 25 * 60;
export const BREAK_TIME = 5 * 60;

export default class Pomodoro extends React.Component {
	render() {
		return (
			<React.Fragment>
				<h3>work time {formatTime(this.props.workTimeRemaining)}</h3>
				<h3>break time {formatTime(this.props.breakTimeRemaining)}</h3>
				<h2
					className={"sideBarElementButtonHover"}
					onClick={this.props.resetPomodoro}
				>reset</h2>
			</React.Fragment>
		);
	}
}

export function stashBreakTime() {
	const stashPomodoro = this.state.pomodoro;

	stashPomodoro.stashBreak = true;

	this.setState(state => ({
		pomodoro: stashPomodoro,
	}));
}

export function pomodoroTick() {
	let activeTask = false;
	const tempTasks = this.state.tasks;
	let updatedPomodoro = this.state.pomodoro;
	let currentState = this.state;
	const currentDate = new Date();
	const deltaTime = (currentDate - this.state.lastTickTime) / 1000.0;

	//check for an active task
	for (let i = 0; i < tempTasks.length; i++) {
		//check for a running task
		if (
			tempTasks[i].started &&
			!tempTasks[i].paused &&
			tempTasks[i].remainingTime > 0
		) {
			activeTask = true;
			break;
		}
	}

	//nothing to do - afk
	if (!activeTask) return;

	//if not started and have an active task
	//then start the work time or the break timer
	if (!this.state.pomodoro.startedWork) {
		updatedPomodoro.startedWork = true;
		updatedPomodoro.workTimeRemaining = WORK_TIME;
	}
	else if (this.state.pomodoro.stashBreak) {
		updatedPomodoro.workTimeRemaining = WORK_TIME;
		updatedPomodoro.breakTimeRemaining += BREAK_TIME;
		updatedPomodoro.startedBreak = false;
		updatedPomodoro.startedWork = true;

		updatedPomodoro.stashBreak = false;

		//hide the side bar
		currentState.showSideBar = false;
	}

	//perform the ticks and other logic
	else {
		if (this.state.pomodoro.workTimeRemaining > 0) {
			updatedPomodoro.workTimeRemaining -= deltaTime;
			if(updatedPomodoro.workTimeRemaining < 0) updatedPomodoro.workTimeRemaining = 0;
		} else {
			//start break
			if (!this.state.pomodoro.startedBreak) {

				//pause tasks
				updatedPomodoro.startedBreak = true;
				//show the side bar
				currentState.showPomodoro = true;
				currentState.showSideBar = true;

				//call callback to show notification, with stashing of break time
				this.props.sendNotification(
					"Break time started",
					"click to stash break",
					this.stashBreakTime
				);

			} else if (this.state.pomodoro.breakTimeRemaining > 0) {
				updatedPomodoro.breakTimeRemaining -= deltaTime;
				if(updatedPomodoro.workTimeRemaining < 0) updatedPomodoro.workTimeRemaining = 0;
			}

			//break finished
			else {
				//call other callback to show notification
				this.props.sendNotification("Break time finished", "");

				updatedPomodoro.startedWork = false;
				updatedPomodoro.startedBreak = false;
				updatedPomodoro.breakTimeRemaining = BREAK_TIME;
				updatedPomodoro.workTimeRemaining = WORK_TIME;

				//hide the side bar
				currentState.showSideBar = false;
			}
		}
	}

	this.setState(state => ({
		pomodoro: updatedPomodoro,
		showPomodoro: currentState.showPomodoro,
		showSideBar: currentState.showSideBar,
		lastPomodoroTickTime: currentDate,
	}));
}

export function resetPomodoro() {
	let newPomodoro = {
		startedWork: false,
		startedBreak: false,
		workTimeRemaining: WORK_TIME,
		breakTimeRemaining: BREAK_TIME,
		stashBreak: false,
	};

	this.setState(state => ({
		pomodoro: newPomodoro
	}));
}