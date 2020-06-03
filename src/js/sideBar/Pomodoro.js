import React from "react";
import { formatTime, sendNotification } from "../Ultility.js";

export const WORK_TIME = 25 * 60;
export const BREAK_TIME = 5 * 60;
const MAX_IDLE_TIME = 5 * 60;

export default class Pomodoro extends React.Component {
	render() {

		let stashHTML;

		if(this.props.onBreak){
			stashHTML = <div
				className={"sideBarElementButton"}
				onClick={this.props.stashBreakTime}
			>stash</div>
		}

		return (
			<React.Fragment>
				<div className={"sideBarElementText"}>work time: {formatTime(this.props.workTimeRemaining)}</div>
				<div className={"sideBarElementText"}>break time: {formatTime(this.props.breakTimeRemaining)}</div>
				{stashHTML}
				<div
				className={"sideBarElementButton"}
				onClick={this.props.resetPomodoro}
			>reset</div>
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

	//idle
	if (!activeTask){
		updatedPomodoro.idleTime += deltaTime;
		this.setState(state => ({
			pomodoro: updatedPomodoro,
		}));

		return;
	}

	else {
		//been idle for long enough to reset the timer
		if(this.state.pomodoro.idleTime >= MAX_IDLE_TIME){
			updatedPomodoro.startedWork = false;
			updatedPomodoro.startedBreak = false;
			updatedPomodoro.breakTimeRemaining = BREAK_TIME;
			updatedPomodoro.workTimeRemaining = WORK_TIME;
			updatedPomodoro.idleTime = 0;

			this.setState(state => ({
				pomodoro: updatedPomodoro,
			}));

			return;
		}

		//reset the idle when no longer idle
		updatedPomodoro.idleTime = 0;
	}

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
				sendNotification(
					"Break time started",
					"click to stash break",
					this.stashBreakTime
				);

			} else if (this.state.pomodoro.breakTimeRemaining > 0) {
				updatedPomodoro.breakTimeRemaining -= deltaTime;
				if(updatedPomodoro.breakTimeRemaining < 0) updatedPomodoro.breakTimeRemaining = 0;
			}

			//break finished
			else {
				//call other callback to show notification
				sendNotification("Break time finished", "");

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