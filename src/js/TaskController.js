import React from "react";
import Task from "../js/ReactTask.js";
import HoursOverlay from "../js/HoursOverlay.js";
import "../css/addTaskForm.css";

export default class TaskController extends React.Component {
	constructor(props) {
		super(props);
		//store the tasks
		this.state = {
			showTaskForm: false,
		};

		this.toggleTaskForm = this.toggleTaskForm.bind(this);
		this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
		this.handleNewTaskHoursChange = this.handleNewTaskHoursChange.bind(this);
		this.handleNewTaskMinsChange = this.handleNewTaskMinsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	//display the add task inputs
	toggleTaskForm() {
		this.setState(state => ({
			showTaskForm: !state.showTaskForm,
		}));
	}

	//methods for the new task input
	handleNewTaskNameChange(e) {
		this.setState({ newTaskName: e.target.value });
	}
	handleNewTaskHoursChange(e) {
		this.setState({ newTaskHours: e.target.value });
	}
	handleNewTaskMinsChange(e) {
		this.setState({ newTaskMins: e.target.value });
	}
	handleSubmit(e) {
		e.preventDefault();
		const currentState = this.state;
		this.props.addTask(currentState);
		this.setState(state =>({
			newTaskName: "",
			newTaskHours: "0",
			newTaskMins: "0",
		}));
	}

	render() {
		let addTaskHtml;

		if (this.state.showTaskForm) {
			//display the inputs
			addTaskHtml = (
				<form
					className="addTaskForm"
					onSubmit={this.handleSubmit}
					autoComplete="off"
				>
					<input
						id="task-name-input"
						type="text"
						onChange={this.handleNewTaskNameChange}
						value={this.state.newTaskName}
						placeholder="name"
					/>
					<input
						id="task-hours-input"
						type="number"
						min="0"
						max="99"
						onChange={this.handleNewTaskHoursChange}
						value={this.state.newTaskHours}
						placeholder="hours"
					/>
					<input
						id="task-mins-input"
						type="number"
						min="0"
						max="60"
						step="1"
						onChange={this.handleNewTaskMinsChange}
						value={this.state.newTaskMins}
						placeholder="minutes"
					/>
					<div className="taskInput">
						<button>add</button>
					</div>
				</form>
			);
		}

		return (
			<div className="app">
				<div className="mainBody">
					<HoursOverlay tasks={this.props.tasks} />
					<div className="tasksContainer">
						{this.props.tasks.map(task => (
							<Task
								key={task.id}
								id={task.id}
								name={task.name}
								totalDuration={task.totalDuration}
								remainingTime={task.remainingTime}
								started={task.started}
								paused={task.paused}
								isViewing={task.isViewing}
								taskOnClick={this.props.taskOnClick}
								taskUp={this.props.taskUp}
								taskDown={this.props.taskDown}
								startTask={this.props.startTask}
								finishTask={this.props.finishTask}
								addTime={this.props.addTime}
							/>
						))}
					</div>
					<div className="addTaskButton" onClick={this.toggleTaskForm}>
						<h1>add task</h1>
					</div>
					{addTaskHtml}
				</div>
			</div>
		);
	}
}
