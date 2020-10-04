import {action, thunk} from "easy-peasy";
import {formatDayMonth, sendNotification} from "../Utility/Utility";

import { debug } from 'easy-peasy';
import {createDayStat} from "../MainApp/DayStat";
import {firebaseSaveDayStat, firebaseSaveTask} from "../Firebase/FirebaseController";
import {decrementTime, removeTask, setReportFlow, addFlowStat} from "./Task/TaskActions";
import {addDayStatTask} from "./DayStat/DayStatActions";


//todo add tests with mocked data and maybe mocked saving

const checkIfNewDayStat = (state) => {
    if(state.dayStat.dayStat.date !== formatDayMonth(new Date())){
        state.dayStat.dayStat = createDayStat();
    }
};

export const tick = action((state, deltaTime) => {
    if (!state.dayStat.dayStat || !state.tasks.tasks) return;
    if(state.tasks.tasks.length === 0) return;

    const currentDateString = (new Date()).toISOString();

    checkIfNewDayStat(state);

    state.tasks.tasks.forEach(task => {
        if (task.started && !task.paused) {
            decrementTime(state.tasks, task.id, deltaTime);

            if (task.remainingTime === 0 && !task.timeUp) {
                task.isViewing = true;
                task.timeUp = true;
                sendNotification("Task time finished", task.name);
                firebaseSaveTask(task);
            }

            const dayStatTask = state.dayStat.dayStat.tasks.find(dayStatTask => {
                return dayStatTask.id === task.id;
            });

            if(dayStatTask){
                //if a task is active update the stop time
                let length = dayStatTask.stop.length;
                dayStatTask.stop[length - 1] = currentDateString;
            }
            else{
                addDayStatTask(state.dayStat, task, currentDateString);
            }

            const seconds  = (new Date()).getSeconds();

            //todo refactor interval saving, maybe some clever chaining or a cache in firebase controller
            if(seconds % 30 === 0) firebaseSaveDayStat(state.dayStat.dayStat);
        }
    });
});


//handle start, pause and unpause
export const startTask = action((state, id) => {
    let taskActive = false;
    let currentDate = (new Date()).toISOString();

    checkIfNewDayStat(state);

    const task = state.tasks.tasks.find(task => task.id === id);

    if (task.started) {
        if (task.remainingTime >= 0) {
            if (task.paused) {
                task.unPause();
                taskActive = true;

                const dayStatTask = state.dayStat.dayStat.tasks.find(dayStatTask => {
                    return dayStatTask.id === task.id;
                });

                if(dayStatTask){
                    //update times
                    dayStatTask.start.push(currentDate);
                    dayStatTask.stop.push(currentDate);
                }
                else{
                    addDayStatTask(state.dayStat, task, currentDate);
                }
            } else {
                task.pause();
            }
        }
    } else {
        task.start();
        taskActive = true;
        addDayStatTask(state.dayStat, task, currentDate);
    }

    firebaseSaveTask(task);
    firebaseSaveDayStat(state.dayStat.dayStat);

    //pause any other active tasks
    if (taskActive) {
        state.tasks.tasks.forEach(task => {
            if (task.id !== id && task.started && !task.paused) {
                task.pause();
                firebaseSaveTask(task);
            }
        })
    }
});

export const reportFlow = thunk((actions, {id, productive, focus}) => {
    const REPORT_DELAY = 750;

    actions.updateFlow({
        id: id,
        productive: productive,
        focus: focus
    });

    setTimeout(() => {
        actions.hideReportFlow(id);
    }, REPORT_DELAY);
}) ;

export const updateFlow = action((state, {id, productive, focus}) => {
    const dayStatTask = state.dayStat.dayStat.tasks.find(task => task.id === id);
    const task = state.tasks.tasks.find(task => task.id === id);

    //task hasn't been started
    if (!dayStatTask || !task) {
        removeTask(state.tasks, id);

        return;
    }

    if(focus && productive){
        const flowObj = {
            focus: focus,
            productive: productive,
            time: new Date(),
        };

        state.dayStat.dayStat.flow.push(flowObj);
        addFlowStat( state.tasks, id, flowObj);

        firebaseSaveTask(task);
        firebaseSaveDayStat(state.dayStat.dayStat);
    }
});

export const hideReportFlow = action((state, id) => {
    const task = state.tasks.tasks.find(task => task.id === id);

    setReportFlow(state.tasks, id, false);

    if (task.finished) {
        removeTask(state.tasks, id);
    }
});