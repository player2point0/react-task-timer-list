import {action} from "easy-peasy";

/*
USE IMMUTABLE OBJECTS DO THAT THE RERENDER WORKS
 */

export const addTask = action((state, newTask) => {
    state.tasks.push(newTask)
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