import React from "react";
import Task from "../js/ReactTask.js";
import HoursOverlay from "../js/HoursOverlay.js";
import "../css/addTaskForm.css";
import {requestNotifications, sendNotification} from "./Ultility";
import TaskContainer from "./TaskContainer";

export default class TaskController extends React.Component {
    constructor(props) {
        super(props);
        //store the tasks
        this.state = {
            showTaskForm: false,
            scrollToForm: false,
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
            scrollToForm: true,
        }));
    }

    //methods for the new task input
    handleNewTaskNameChange(e) {
        this.setState({newTaskName: e.target.value.toLowerCase()});
    }

    handleNewTaskHoursChange(e) {
        this.setState({newTaskHours: e.target.value});
    }

    handleNewTaskMinsChange(e) {
        this.setState({newTaskMins: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const currentState = this.state;
        this.props.addTask(currentState);
        this.setState(state => ({
            newTaskName: "",
            newTaskHours: "0",
            newTaskMins: "0",
        }));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.scrollToForm) {
            const addTaskFrom = document.getElementById("addTaskForm");
            if (addTaskFrom) addTaskFrom.scrollIntoView(false);

            this.setState(state => ({
                scrollToForm: false,
            }));
        }
    }

    render() {
        let addTaskHtml;

        if (this.state.showTaskForm) {
            //display the inputs
            addTaskHtml = (
                <form
                    id="addTaskForm"
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
                    <HoursOverlay tasks={this.props.tasks}/>
                    <div className="tasksContainer">
                        {this.props.tasks.map(task => (
                            <Task
                                key={task.id}
                                id={task.id}
                                name={task.name}
                                totalTime={task.totalTime}
                                remainingTime={task.remainingTime}
                                started={task.started}
                                paused={task.paused}
                                isViewing={task.isViewing}
                                taskOnClick={this.props.taskOnClick}
                                startTask={this.props.startTask}
                                finishTask={this.props.finishTask}
                                addTime={this.props.addTime}
                                objectives={task.objectives}
                                completeObjective={this.props.completeObjective}
                                addObjective={this.props.addObjective}
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

//update all the tasks which are started
export function tick() {
    const updatedTasks = this.state.tasks.slice();
    const updatedDayStats = this.state.dayStats;
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString();
    const deltaTime = (currentDate - this.state.lastTickTime) / 1000.0;

    for (let i = 0; i < updatedTasks.length; i++) {
        if (updatedTasks[i].started && !updatedTasks[i].paused) {
            updatedTasks[i].remainingTime -= deltaTime;

            if (updatedTasks[i].remainingTime <= 0) {
                updatedTasks[i].remainingTime = 0;

                if (!updatedTasks[i].timeUp) {
                    updatedTasks[i].isViewing = true;
                    updatedTasks[i].timeUp = true;
                    sendNotification("Task time finished", updatedTasks[i].name);

                    this.setState({setSaveAllTasks: true});
                }
            } else {
                if (this.state.pomodoro.startedWork && !this.state.pomodoro.startedBreak) {
                    updatedDayStats.totalWorked += deltaTime;
                }

				else if (this.state.pomodoro.startedWork && this.state.pomodoro.startedBreak) {
					updatedDayStats.totalBreak += deltaTime;
				}
            }

            let taskInDayStats = false;

            //if a task is active update the stop time
            for (let j = 0; j < updatedDayStats.tasks.length; j++) {
                if (updatedDayStats.tasks[j].id === updatedTasks[i].id) {
                    let length = updatedDayStats.tasks[j].stop.length;
                    updatedDayStats.tasks[j].stop[length - 1] = currentDateString;

                    taskInDayStats = true;
                }
            }

            if (!taskInDayStats) {
                updatedDayStats.tasks.push({
                    id: updatedTasks[i].id,
                    name: updatedTasks[i].name,
                    start: [currentDateString],
                    stop: [currentDateString],
                });
            }
        }
    }

    this.setState(state => ({
        tasks: updatedTasks,
        lastTickTime: currentDate,
        dayStats: updatedDayStats
    }));
}

export function addTask(currentState) {
    requestNotifications();

    let name = currentState.newTaskName;
    let hours = currentState.newTaskHours;
    let mins = currentState.newTaskMins;

    //need a name and at least one time value
    if (!name || (!hours && !mins)) return;

    //if we have one and not the other then assume zero
    if (!hours) hours = 0;
    if (!mins) mins = 0;

    //needs to be above zero
    if (hours < 0 || mins < 0 || Number(hours + mins) === 0) return;

    let newTaskDuration = hours * 3600 + mins * 60;
    let currentDate = new Date();

    let newTask = new TaskContainer(
        name,
        newTaskDuration,
        currentDate
    );

    this.setState(state => ({
        tasks: state.tasks.concat(newTask),
        setSaveAllTasks: true,
    }));
}

export function updateTaskByIdFunc(tasks, id, func) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            func(tasks[i]);
            break;
        }
    }
}

//display the selected task
export function taskOnClick(id) {
    const updatedTasks = this.state.tasks.slice();

    this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
        updatedTask.view();
    });

    this.setState({
        tasks: updatedTasks,
    });
}

export function startTask(id) {
    const updatedTasks = this.state.tasks.slice();
    let updatedDayStats = this.state.dayStats;
    let taskActive = false;
    let currentDate = (new Date()).toISOString();

    //todo check if the task is from a previous day stat and so doesn't exist in the tasks

    this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
        if (updatedTask.started) {
            if (updatedTask.remainingTime >= 0) {
                if (updatedTask.paused) {
                    updatedTask.unPause();
                    taskActive = true;

                    let taskInDayStats = false;

                    //update the dayStat start and stop values
                    for (let j = 0; j < updatedDayStats.tasks.length; j++) {
                        if (updatedDayStats.tasks[j].id === updatedTask.id) {
                            updatedDayStats.tasks[j].start.push(currentDate);
                            updatedDayStats.tasks[j].stop.push(currentDate);

                            taskInDayStats = true;
                        }
                    }

                    if (!taskInDayStats) {
                        updatedDayStats.tasks.push({
                            id: updatedTask.id,
                            name: updatedTask.name,
                            start: [currentDate],
                            stop: [currentDate],
                        });
                    }

                } else {
                    updatedTask.pause();
                }
            }
        } else {
            updatedTask.start();
            taskActive = true;
            updatedDayStats.tasks.push({
                id: updatedTask.id,
                name: updatedTask.name,
                start: [currentDate],
                stop: [currentDate],
            });
        }
    });

    //pause any other active tasks
    if (taskActive) {
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id !== id && updatedTasks[i].started && !updatedTasks[i].paused) {
                updatedTasks[i].pause();
                updatedTasks[i].isViewing = false;
            }
        }
    }

    this.setState({
        tasks: updatedTasks,
        setSaveAllTasks: true,
        dayStats: updatedDayStats,
    });
}

export function finishTask(id) {
    const updatedTasks = this.state.tasks.slice();

    this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
        updatedTask.finish();
    });

    this.setState({
        tasks: updatedTasks,
        setSaveAllTasks: true,
        removeTaskId: id
    });
}

export function removeTaskWithId(id) {
    const updatedTasks = this.state.tasks.slice();

    for (let i = updatedTasks.length - 1; i >= 0; i--) {
        if (updatedTasks[i].id === id) {
            updatedTasks.splice(i, 1);

            break;
        }
    }

    this.setState({
        tasks: updatedTasks,
        setSaveAllTasks: true,
    });
}

export function addTime(id) {
    const updatedTasks = this.state.tasks.slice();

    this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
        updatedTask.addTime();
    });

    this.setState({
        tasks: updatedTasks,
        setSaveAllTasks: true,
    });
}

//save all tasks
export function saveAllTasks(tasksToSave) {
    for (let i = 0; i < tasksToSave.length; i++) {
        this.firebaseSaveTask(tasksToSave[i]);
    }

    this.firebaseSaveDayStats();
}

export function completeObjective(taskId, objectiveId) {
    const updatedTasks = this.state.tasks.slice();

    this.updateTaskByIdFunc(updatedTasks, taskId, function (updatedTask) {
        updatedTask.completeObjective(objectiveId);
    });

    this.setState({
        tasks: updatedTasks,
        setSaveAllTasks: true,
    });
}

export function addObjective(taskId, objectiveName) {
    const updatedTasks = this.state.tasks.slice();

    this.updateTaskByIdFunc(updatedTasks, taskId, function (updatedTask) {
        updatedTask.addObjective(objectiveName);
    });

    this.setState({
        tasks: updatedTasks,
        setSaveAllTasks: true,
    });
}