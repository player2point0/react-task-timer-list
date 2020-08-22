import React, {useState, useEffect} from "react";
import Task from "./Task";
import HoursOverlay from "../HourCover/HoursOverlay";
import "../MainApp/addTaskForm.css";
import {requestNotifications, sendNotification} from "../Utility/Utility";
import TaskContainer from "./TaskContainer";
import NewTaskForm from "./NewTaskForm";
import {useStoreActions, useStoreState} from 'easy-peasy';

export default function TaskController() {

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [scrollToForm, setScrollToForm] = useState(false);
    const tasks = useStoreState(state => state.tasks);

    //display the add task inputs
    const toggleTaskForm = () => {
        setShowTaskForm(!showTaskForm);
        setScrollToForm(true);
    };

    useEffect(() => {
        if (scrollToForm) {
            const addTaskFrom = document.getElementById("addTaskForm");
            if (addTaskFrom) addTaskFrom.scrollIntoView(false);

            setScrollToForm(false);
        }
    },[scrollToForm]);

    const taskBeingViewed = tasks.some(task => task.isViewing);

    for(let i = 0;i<tasks.length;i++){
        const task = tasks[i];

        if(task.reportFlowFlag && (task.paused || task.finished)){
            return <Task
                key={task.id}
                id={task.id}
                name={task.name}
                totalTime={task.totalTime}
                remainingTime={task.remainingTime}
                started={task.started}
                paused={task.paused}
                isViewing={task.isViewing}
                finished={task.finished}
                reportFlowFlag={task.reportFlowFlag}
                objectives={task.objectives}
             />
        }
    }

    return (
        <div>
            {!taskBeingViewed && <HoursOverlay
                startTime={new Date()}
                numHours={12}
            />}
            {tasks.map(task => (
                <Task
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    totalTime={task.totalTime}
                    remainingTime={task.remainingTime}
                    started={task.started}
                    paused={task.paused}
                    isViewing={task.isViewing}
                    finished={task.finished}
                    reportFlowFlag={task.reportFlowFlag}
                    objectives={task.objectives}
                />
            ))}
            <div className="addTaskButton" onClick={toggleTaskForm}>
                <div>add task</div>
            </div>
            {showTaskForm &&
            <NewTaskForm/>}
        </div>
    );
}

//update all the tasks which are started
export function tick() {
    const updatedTasks = this.state.tasks.slice();
    const updatedDayStat = this.state.dayStat;
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
            }

            let taskInDayStat = false;

            //if a task is active update the stop time
            for (let j = 0; j < updatedDayStat.tasks.length; j++) {
                if (updatedDayStat.tasks[j].id === updatedTasks[i].id) {
                    let length = updatedDayStat.tasks[j].stop.length;
                    updatedDayStat.tasks[j].stop[length - 1] = currentDateString;

                    taskInDayStat = true;
                }
            }

            if (!taskInDayStat) {
                updatedDayStat.tasks.push({
                    id: updatedTasks[i].id,
                    name: updatedTasks[i].name,
                    start: [currentDateString],
                    stop: [currentDateString],
                });
            }
        }
    }

    this.setState({
        tasks: updatedTasks,
        lastTickTime: currentDate,
        dayStat: updatedDayStat
    });
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

    const selectedTask = updatedTasks.find(task => task.id === id);

    selectedTask.view();

    if (selectedTask.isViewing) {
        updatedTasks.forEach(task => {
            if (task.id !== id && task.isViewing) {
                task.view();
            }
        });
    }

    this.setState({
        tasks: updatedTasks,
    });
}

export function startTask(id) {
    const updatedTasks = this.state.tasks.slice();
    let updatedDayStat = this.state.dayStat;
    let taskActive = false;
    let currentDate = (new Date()).toISOString();

    //todo check if the task is from a previous day stat and so doesn't exist in the tasks

    this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
        if (updatedTask.started) {
            if (updatedTask.remainingTime >= 0) {
                if (updatedTask.paused) {
                    updatedTask.unPause();
                    taskActive = true;

                    let taskInDayStat = false;

                    //update the dayStat start and stop values
                    for (let j = 0; j < updatedDayStat.tasks.length; j++) {
                        if (updatedDayStat.tasks[j].id === updatedTask.id) {
                            updatedDayStat.tasks[j].start.push(currentDate);
                            updatedDayStat.tasks[j].stop.push(currentDate);

                            taskInDayStat = true;
                        }
                    }

                    if (!taskInDayStat) {
                        updatedDayStat.tasks.push({
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
            updatedDayStat.tasks.push({
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
        dayStat: updatedDayStat,
    });
}

export function setReportFlow(id, val) {

    const updatedTasks = this.state.tasks.slice();

    this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
        updatedTask.setReportFlow(val);
    });

    this.setState({
        tasks: updatedTasks,
    });
}

export function reportFlow(id, focus, productive) {
    const updatedDayStat = this.state.dayStat;
    const currentDayStatTask = updatedDayStat.tasks.find(task => task.id === id);

    //todo check this
    const updatedTasks = this.state.tasks;
    const currentTask = updatedTasks.find(task => task.id === id);

    const REPORT_DELAY = 500;

    //task hasn't been started
    if (!currentDayStatTask || !currentTask) {
        this.setState({
            setSaveAllTasks: true,
            removeTaskId: id
        });

        return;
    }

    if (currentDayStatTask.hasOwnProperty("focus")) {
        currentDayStatTask.focus.push(focus);
    } else currentDayStatTask.focus = [focus];

    if (currentDayStatTask.hasOwnProperty("productive")) {
        currentDayStatTask.productive.push(productive);
    } else currentDayStatTask.productive = [productive];

    //separate server and animation logic for speed
    this.setState({
        dayStat: updatedDayStat,
        setSaveAllTasks: true,
    });

    setTimeout(() => {
        if (currentTask.finished) {
            this.setState({
                dayStat: updatedDayStat,
                setSaveAllTasks: true,
                removeTaskId: id
            });
        }

        this.setReportFlow(id, false);
    }, REPORT_DELAY);
}

export function finishTask(id,) {
    const updatedTasks = this.state.tasks.slice();

    this.updateTaskByIdFunc(updatedTasks, id, function (updatedTask) {
        updatedTask.finish();
    });

    this.setState({
        tasks: updatedTasks,
        setSaveAllTasks: true,
        //removeTaskId: id
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

    this.firebaseSaveDayStat();
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