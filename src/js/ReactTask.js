import React from "react";
import "../css/task.css";
import {formatTime} from "../js/Ultility.js";

const MIN_TASK_HEIGHT = 5;
const MIN_HOUR_TIME = 0.1;
const HOUR_HEIGHT = 30;
const TASK_VIEWING_HEIGHT = 70;
const HOUR_IN_SECONDS = 60 * 60;
const HIDE_CONTENT_HEIGHT = 0;//10;
const OBJECTIVE_HEIGHT = 5;

function Objective(props) {

    let completeButton = <button
        onClick={function (e) {
            e.stopPropagation();
            props.completeObjective(props.taskId, props.id);
        }}
    >complete</button>;

    let objectiveName = <h1>{props.name}</h1>;

    if (props.finished) {
        objectiveName = <del>{objectiveName}</del>;
    }

    return (<div
        className="taskObjective"
        onClick={function (e) {
            e.stopPropagation();
        }}
    >
        {objectiveName}
        {completeButton}
    </div>);

}

//renders the task based on the passed properties
class Task extends React.Component {

    constructor(props) {
        super(props);
        //store the tasks
        this.state = {
            newObjectiveName: "",
        };

        this.handleNewObjectiveNameChange = this.handleNewObjectiveNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //methods for the new task input
    handleNewObjectiveNameChange(e) {
        this.setState({newObjectiveName: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const currentState = this.state;
        this.props.addObjective(this.props.id, currentState.newObjectiveName);

        this.setState(state => ({
            newObjectiveName: "",
        }));
    }

    render() {
    	//todo refactor this
        let THIS_SCOPE = this;
        let taskContent;
        const TASK_ID = this.props.id;

        let taskViewing;

        let taskHeightPer = this.props.remainingTime / HOUR_IN_SECONDS < MIN_HOUR_TIME
            ? MIN_HOUR_TIME
            : this.props.remainingTime / HOUR_IN_SECONDS;
        let taskHeight = taskHeightPer * HOUR_HEIGHT < MIN_TASK_HEIGHT
            ? MIN_TASK_HEIGHT
            : taskHeightPer * HOUR_HEIGHT;
        let coverHeight = 0;

		let startButtonText =
			this.props.paused || this.props.remainingTime === 0
				? "un pause"
				: "pause";

		if (!this.props.started) startButtonText = "start";

		if (taskHeight > HIDE_CONTENT_HEIGHT) {
            taskContent = (<React.Fragment>
                <div
                    className="taskViewingCover"
                    style={{height: coverHeight + "vh"}}
                />
                <div className="taskSelectButton">
                    <h1 className="taskName">{this.props.name}</h1>
                    <h1 className="taskTime">{formatTime(this.props.remainingTime)}</h1>
                </div>
            </React.Fragment>);
        }

        //display additional details when the task is selected
        if (this.props.isViewing) {
            taskHeight += TASK_VIEWING_HEIGHT; //expands the task by 50vh to display the buttons, could add a max/min height

            coverHeight =
                taskHeight *
                ((this.props.totalDuration - this.props.remainingTime) /
                    this.props.totalDuration);

            //todo add support for the sizing of multi line objectives
            let taskObjectives;
            taskHeight += this.props.objectives.length * OBJECTIVE_HEIGHT;

            if(this.props.objectives){
            	taskObjectives = this.props.objectives.map(objective => (
					<Objective
						key={objective.id}
						name={objective.name}
						id={objective.id}
						taskId={TASK_ID}
						finished={objective.finished}
						completeObjective={this.props.completeObjective}
					/>
				));
			}


            taskViewing = (
                <React.Fragment>
                    <div className="taskObjectives">
                        {taskObjectives}
                        <form
                            className="addObjectiveForm"
                            onSubmit={this.handleSubmit}
                            autoComplete="off"
                            onClick={function (e) {
                                e.stopPropagation();
                            }}
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
                    <div className="taskViewing">
                        <button
                            className="taskViewingButton"
                            onClick={function (e) {
                                e.stopPropagation();
                                THIS_SCOPE.props.startTask(THIS_SCOPE.props.id);
                            }}
                        >
                            {startButtonText}
                        </button>
                        <button
                            className="taskViewingButton"
                            onClick={function (e) {
                                e.stopPropagation();
                                THIS_SCOPE.props.finishTask(THIS_SCOPE.props.id);
                            }}
                        >
                            finish
                        </button>
                        <button
                            className="taskViewingButton"
                            onClick={function (e) {
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
                style={{height: taskHeight + "vh"}}
            >
                <div
                    className="taskBackground"
                    style={{height: taskHeight + "vh"}}
                />
                <div className="taskBody">
                    {taskContent}
                </div>
                {taskViewing}
            </div>
        );
    }
}

export default Task;