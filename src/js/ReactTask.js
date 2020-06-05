import React from "react";
import "../css/task.css";
import {formatTime} from "../js/Ultility.js";

const MIN_TASK_HEIGHT = 5;
const MIN_HOUR_TIME = 0.1;
const HOUR_HEIGHT = 30;
const MIN_TASK_VIEWING_HEIGHT = 100;
const HOUR_IN_SECONDS = 60 * 60;

function Objective(props) {

    let completeButton = <button
        onClick={function (e) {
            e.stopPropagation();
            props.completeObjective(props.taskId, props.id);
        }}
    >done</button>;

    let objectiveName = <div
        className={"taskObjectiveName"}
    >{props.name}</div>;

    if (props.finished) {
        objectiveName = <del>{objectiveName}</del>;
        completeButton = "";
    }

    return (
        <div
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

        if(!currentState.newObjectiveName) return;

        this.props.addObjective(this.props.id, currentState.newObjectiveName);

        this.setState(state => ({
            newObjectiveName: "",
        }));
    }

    render() {
        let taskHeightPer = (this.props.remainingTime / HOUR_IN_SECONDS) < MIN_HOUR_TIME
            ? MIN_HOUR_TIME : (this.props.remainingTime / HOUR_IN_SECONDS);
        let taskHeight = (taskHeightPer * HOUR_HEIGHT) < MIN_TASK_HEIGHT
            ? MIN_TASK_HEIGHT : (taskHeightPer * HOUR_HEIGHT);

        const taskContent = (<React.Fragment>
                <div className="taskSelectButton">
                    <div className="taskName">{this.props.name}</div>
                    <div className="taskTime">{formatTime(this.props.remainingTime)}</div>
                </div>
            </React.Fragment>);

        if(!this.props.isViewing){
            return (
                <div
                    id={this.props.id}
                    className="task"
                    onClick={e => {
                        this.props.taskOnClick(this.props.id, e);
                        const task = document.getElementById(this.props.id);
                        if (task) task.scrollIntoView(true);
                    }}
                    style={{
                        height: taskHeight + "vh",
                    }}
                >
                    <div className="taskBody">
                        {taskContent}
                    </div>
                </div>
            );
        }


        let THIS_SCOPE = this;
        const TASK_ID = this.props.id;

        let taskObjectives;
        let startButtonText = this.props.paused || this.props.remainingTime === 0
            ? "un pause" : "pause";
        if (!this.props.started) startButtonText = "start";

        if (this.props.objectives) {
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

        const taskViewing = (
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
                            className="addObjectiveInput"
                            autoFocus
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

        return (
            <div
                className="task"
                onClick={e => {
                    this.props.taskOnClick(this.props.id, e);
                }}
                style={{
                    minHeight: MIN_TASK_VIEWING_HEIGHT + "vh",
                    }}
            >
                <div className="taskBody">
                    {taskContent}
                </div>
                {taskViewing}
            </div>
        );
    }
}

export default Task;