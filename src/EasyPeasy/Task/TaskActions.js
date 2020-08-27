import {action} from "easy-peasy";
import {firebaseSaveTask} from "../../Firebase/FirebaseController";

/*
USE IMMUTABLE OBJECTS SO THAT THE RERENDER WORKS
 */

//todo refactor this

export const addTask = action((state, newTask) => {
    state.tasks.push(newTask)
    firebaseSaveTask(newTask);
});

export const updateTasks = action((state, updatedTasks) => {
    state.tasks = updatedTasks
});

export const viewTask = action((state, taskId) => {
    const tempTasks = [...state.tasks];

    tempTasks.forEach(task => task.isViewing = false);
    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].view();

    state.tasks = tempTasks
});

export const unViewTask = action((state, taskId) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].view();

    state.tasks = tempTasks
});

export const addObjective = action((state, {taskId, objectiveName}) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);

    tempTasks[taskIndex].addObjective(objectiveName);

    state.tasks = tempTasks;

    firebaseSaveTask(state.tasks[taskIndex]);
});

export const completeObjective = action((state, {taskId, objectiveId}) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].completeObjective(objectiveId);

    state.tasks = tempTasks;

    firebaseSaveTask(state.tasks[taskIndex]);
});

export const addTime = action((state, taskId) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].addTime();

    state.tasks = tempTasks;

    firebaseSaveTask(state.tasks[taskIndex]);
});

export const finishTask = action((state, taskId) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].finish();

    state.tasks = tempTasks
});


export const setReportFlow = action((state, {taskId, val}) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);

    console.log(taskId);

    tempTasks[taskIndex].setReportFlow(val);

    state.tasks = tempTasks
});

export const removeTask = action((state, taskId) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks.splice(taskIndex, 1);

    state.tasks = tempTasks
});

export const resetAllTasksNeedSaved = action(state => {
    const tempTasks = [...state.tasks];

    tempTasks.forEach(task => task.needsSaved = false);

    state.tasks = tempTasks
});