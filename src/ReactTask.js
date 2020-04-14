import React from "react";
import { formatTime } from "./Ultility.js";

const MIN_TASK_HEIGHT = 20;
const HOUR_HEIGHT = 30;
const TASK_VIEWING_HEIGHT = 50;

//renders the task based on the passed properties
class Task extends React.Component {

	constructor(props) {
		super(props);
		//store the tasks
		this.state = {

		};

		this.handleNewObjectiveNameChange = this.handleNewObjectiveNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	//methods for the new task input
	handleNewObjectiveNameChange(e) {
		this.setState({ newObjectiveName: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		const currentState = this.state;
		this.props.addTask(currentState);
		this.setState(state =>({
			newObjectiveName: "",
		}));
	}

	render() {
		let THIS_SCOPE = this;

		//could resize the task body to fit the task viewing div and not mess up the hours overlay
		let taskViewing;
		const HOUR_IN_SECONDS = 60 * 60;
		let taskHeightPer =
			this.props.remainingTime / HOUR_IN_SECONDS < 0.5
				? 0.5
				: this.props.remainingTime / HOUR_IN_SECONDS;
		let taskHeight =
			taskHeightPer * HOUR_HEIGHT < MIN_TASK_HEIGHT
				? MIN_TASK_HEIGHT
				: taskHeightPer * HOUR_HEIGHT;
		let coverHeight = 0;

		let startButtonText =
			this.props.paused || this.props.remainingTime === 0
				? "un pause"
				: "pause";

		if (!this.props.started) startButtonText = "start";

		//display additional details when the task is selected
		if (this.props.isViewing) {
			taskHeight += TASK_VIEWING_HEIGHT; //expands the task by 50vh to display the buttons, could add a max/min height

			coverHeight =
				taskHeight *
				((this.props.totalDuration - this.props.remainingTime) /
					this.props.totalDuration);

			let objectivesHtml = (
				<div className="taskObjective">
					<h2>objective</h2>
					<button>complete</button>
				</div>
			);

			taskViewing = (
				<React.Fragment>
					{/*}
					<div className="taskObjectives">
						{objectivesHtml}
						<form
							className="addObjectiveForm"
							onSubmit={this.handleSubmit}
							autoComplete="off"
						>
							<input
								id="objective-name-input"
								type="text"
								onChange={this.handleNewObjectiveNameChange}
								value={this.state.newObjectiveName}
								placeholder="objective"
							/>
							<button>add</button>
						</form>
					</div>
					{*/}
					<div className="taskViewing">
						<button
							className="taskViewingButton"
							onClick={function(e) {
								e.stopPropagation();
								THIS_SCOPE.props.startTask(THIS_SCOPE.props.id);
							}}
						>
							{startButtonText}
						</button>
						<button
							className="taskViewingButton"
							onClick={function(e) {
								e.stopPropagation();
								THIS_SCOPE.props.finishTask(THIS_SCOPE.props.id);
							}}
						>
							finish
						</button>
						<button
							className="taskViewingButton"
							onClick={function(e) {
								e.stopPropagation();
								THIS_SCOPE.props.addTime(THIS_SCOPE.props.id);
							}}
						>
							add time
						</button>
					</div>
				</React.Fragment>
			);
		}

		return (
			<div
				className="task"
				onClick={e => {
					this.props.taskOnClick(this.props.id, e);
				}}
				style={{ height: taskHeight + "vh" }}
			>
				<div
					className="taskBackground"
					style={{ height: taskHeight + "vh" }}
				></div>
				<div className="taskBody">
					<div
						className="taskViewingCover"
						style={{ height: coverHeight + "vh" }}
					></div>
					<div className="taskUpDownButtons">
						<button
							className="taskUpButton"
							onClick={function(e) {
								e.stopPropagation();
								THIS_SCOPE.props.taskUp(THIS_SCOPE.props.id);
							}}
						>
							up
						</button>
						<button
							className="taskDownButton"
							onClick={function(e) {
								e.stopPropagation();
								THIS_SCOPE.props.taskDown(THIS_SCOPE.props.id);
							}}
						>
							down
						</button>
					</div>
					<div className="taskSelectButton">
						<h1 className="taskName">{this.props.name}</h1>
						<h1 className="taskTime">{formatTime(this.props.remainingTime)}</h1>
					</div>
				</div>
				{taskViewing}
			</div>
		);
	}
}

export default Task;
