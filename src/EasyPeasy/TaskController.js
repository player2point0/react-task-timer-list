import {action, useStoreActions} from "easy-peasy";
import {sendNotification} from "../Utility/Utility";

import { debug } from 'easy-peasy';

//todo check if the dayStat has changed
//todo add saving

//todo look into importing methods from dayStat and task actions
export const tick = action((state, deltaTime) => {
    if (!state.dayStat.dayStat || !state.tasks.tasks) return;
    if(state.tasks.tasks.length === 0) return;

    const currentDateString = (new Date()).toISOString();

    state.tasks.tasks.forEach(task => {
        if (task.started && !task.paused) {
            task.remainingTime -= deltaTime;

            if (task.remainingTime <= 0) {
                task.remainingTime = 0;

                if (!task.timeUp) {
                    task.isViewing = true;
                    task.timeUp = true;
                    sendNotification("Task time finished", task.name);
                    //todo save tasks
                }
            }

            let taskInDayStat = state.dayStat.dayStat.tasks.some(dayStatTask => {
                return dayStatTask.id === task.id;
            });

            if(taskInDayStat){
                //if a task is active update the stop time
                let length =  state.dayStat.dayStat.tasks.stop.length;
                state.dayStat.dayStat.tasks.stop[length - 1] = currentDateString;
            }
            else{
                state.dayStat.dayStat.tasks.push({
                    id: task.id,
                    name: task.name,
                    start: [currentDateString],
                    stop: [currentDateString],
                });
            }
        }
    });
});



//handle start, pause and unpause
export const startTask = action((state, payload) => {
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
    //todo refactor
    //todo add logic to report flow?
    // add logic to save any tasks
    if (taskActive) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id !== id && tasks[i].started && !tasks[i].paused) {
                tasks[i].pause();
            }
        }
    }
});


//todo refactor
export const reportFlow = action((state, payload) => {
    const dayStatTaskIndex = dayStat.tasks.findIndex(task => task.id === id);
    const currentTask = tasks.find(task => task.id === id);

    const REPORT_DELAY = 750;

    //task hasn't been started
    if (!dayStat.tasks[dayStatTaskIndex] || !currentTask) {
        //todo save tasks
        removeTask(id);

        return;
    }

    if(focus && productive){
        const flowObj = {
            focus: focus,
            productive: productive,
            time: new Date(),
        };

        dayStat.flow.push(flowObj);
        addFlowStat({
            taskId: id,
            flowObj: flowObj,
        });
    }

    //separate server and animation logic for speed
    updateDayStat(dayStat);
    saveDayStat();

    setTimeout(() => {
        setReportFlow({
            taskId: id,
            val: false
        });

        if (currentTask.finished) {
            removeTask(id);
        }

    }, REPORT_DELAY);
});