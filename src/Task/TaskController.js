import React, {useState, useEffect} from "react";
import Task from "./Task";
import HoursOverlay from "../HourCover/HoursOverlay";
import "../MainApp/addTaskForm.css";
import {sendNotification} from "../Utility/Utility";
import NewTaskForm from "./NewTaskForm";
import {useStoreActions, useStoreState} from 'easy-peasy';
import {getAuth, userAuthChanged} from "../Firebase/FirebaseController";

const SAVE_INTERVAL = 5 * 60 * 1000; //in milli for set interval

export default function TaskController() {

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [scrollToForm, setScrollToForm] = useState(false);
    const [lastTickTime, setLastTickTime] = useState(new Date());

    const updateTasks = useStoreActions(actions => actions.tasks.updateTasks);
    const updateDayStat = useStoreActions(actions => actions.dayStat.updateDayStat);
    const setReportFlow = useStoreActions(actions => actions.tasks.setReportFlow);
    const removeTask = useStoreActions(actions => actions.tasks.removeTask);

    const tasks = useStoreState(state => state.tasks.tasks);
    const dayStat = useStoreState(state => state.dayStat.dayStat);

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
    }, [scrollToForm]);

    useEffect(() => {
        const tickInterval = setInterval(() => {
            const currentDate = new Date();
            const deltaTime = (currentDate - lastTickTime) / 1000.0;
            setLastTickTime(currentDate);
            tick(tasks, dayStat, deltaTime, updateTasks, updateDayStat);
        }, 1000);
        const saveInterval = setInterval(() => {
            //todo call the firebase save
            //this.setState({setSaveAllTasks: true})
        }, SAVE_INTERVAL);

        return () => {
            clearInterval(tickInterval);
            clearInterval(saveInterval);
        };

    }, [lastTickTime, tasks, dayStat]);


    const taskBeingViewed = tasks.some(task => task.isViewing);

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        //todo probably shouldn't use closure here to keep things updated
        if (task.reportFlowFlag && (task.paused || task.finished)) {
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
                startTask={(id) => startTask(id, tasks, dayStat, updateTasks, updateDayStat)}
                reportFlow={(id, focus, productive) => reportFlow(id, focus, productive, tasks,
                    dayStat, removeTask, setReportFlow, updateDayStat)}
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
                    startTask={(id) => startTask(id, tasks, dayStat, updateTasks, updateDayStat)}
                    reportFlow={(id, focus, productive) => reportFlow(id, focus, productive, tasks,
                        dayStat, removeTask, setReportFlow, updateDayStat)}
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

function tick(tasks, dayStat, deltaTime, updateTasks, updateDayStat) {
    if (!dayStat) return;
    const taskActive = tasks.some(task => task.started && !task.paused);
    if (!taskActive) return;

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString();

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].started && !tasks[i].paused) {
            tasks[i].remainingTime -= deltaTime;

            if (tasks[i].remainingTime <= 0) {
                tasks[i].remainingTime = 0;

                if (!tasks[i].timeUp) {
                    tasks[i].isViewing = true;
                    tasks[i].timeUp = true;
                    sendNotification("Task time finished", tasks[i].name);

                    //todo save tasks
                }
            }

            let taskInDayStat = false;

            //if a task is active update the stop time
            for (let j = 0; j < dayStat.tasks.length; j++) {
                if (dayStat.tasks[j].id === tasks[i].id) {
                    let length = dayStat.tasks[j].stop.length;
                    dayStat.tasks[j].stop[length - 1] = currentDateString;

                    taskInDayStat = true;
                }
            }

            if (!taskInDayStat) {
                dayStat.tasks.push({
                    id: tasks[i].id,
                    name: tasks[i].name,
                    start: [currentDateString],
                    stop: [currentDateString],
                });
            }
        }
    }

    updateTasks(tasks);
    updateDayStat(dayStat);
}

//todo refactor this
function reportFlow(id, focus, productive, tasks, dayStat, removeTask, setReportFlow, updateDayStat) {
    const dayStatTaskIndex = dayStat.tasks.findIndex(task => task.id === id);
    const currentTask = tasks.find(task => task.id === id);

    const REPORT_DELAY = 500;

    //task hasn't been started
    if (!dayStat.tasks[dayStatTaskIndex] || !currentTask) {
        //todo save tasks
        removeTask(id);

        return;
    }

    if (dayStat.tasks[dayStatTaskIndex].hasOwnProperty("focus")) {
        dayStat.tasks[dayStatTaskIndex].focus.push(focus);
    } else dayStat.tasks[dayStatTaskIndex].focus = [focus];

    if (dayStat.tasks[dayStatTaskIndex].hasOwnProperty("productive")) {
        dayStat.tasks[dayStatTaskIndex].productive.push(productive);
    } else dayStat.tasks[dayStatTaskIndex].productive = [productive];

    //separate server and animation logic for speed
    //todo save
    updateDayStat(dayStat);
    setReportFlow({
        taskId: id,
        val: false
    });

    setTimeout(() => {
        if (currentTask.finished) {
            //todo save
            removeTask(id);
        }

    }, REPORT_DELAY);
}

//todo move this to firebase controller
export function saveAllTasks(tasks) {

    //grab the tasks that have changed
    let tasksToSave = [];

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].needsSaved) {
            tasksToSave.push(tasks[i]);
            tasks[i].needsSaved = false;
        }
    }
    //todo add an action to reset the save flag

    for (let i = 0; i < tasksToSave.length; i++) {
        this.firebaseSaveTask(tasksToSave[i]);
    }

    this.firebaseSaveDayStat();
}

function startTask(id, tasks, dayStat, updateTasks, updateDayStat) {
    let taskActive = false;
    let currentDate = (new Date()).toISOString();

    //todo check if the task is from a previous day stat and so doesn't exist in the tasks
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (tasks[taskIndex].started) {
        if (tasks[taskIndex].remainingTime >= 0) {
            if (tasks[taskIndex].paused) {
                tasks[taskIndex].unPause();
                taskActive = true;

                let taskInDayStat = false;

                //update the dayStat start and stop values
                for (let j = 0; j < dayStat.tasks.length; j++) {
                    if (dayStat.tasks[j].id === tasks[taskIndex].id) {
                        dayStat.tasks[j].start.push(currentDate);
                        dayStat.tasks[j].stop.push(currentDate);

                        taskInDayStat = true;
                    }
                }

                if (!taskInDayStat) {
                    dayStat.tasks.push({
                        id: tasks[taskIndex].id,
                        name: tasks[taskIndex].name,
                        start: [currentDate],
                        stop: [currentDate],
                    });
                }

            } else {
                tasks[taskIndex].pause();
            }
        }
    } else {
        tasks[taskIndex].start();
        taskActive = true;
        dayStat.tasks.push({
            id: tasks[taskIndex].id,
            name: tasks[taskIndex].name,
            start: [currentDate],
            stop: [currentDate],
        });
    }

    //pause any other active tasks
    if (taskActive) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id !== id && tasks[i].started && !tasks[i].paused) {
                tasks[i].pause();
                tasks[i].isViewing = false;
            }
        }
    }

    updateTasks(tasks);
    updateDayStat(dayStat);
}