import {action} from "easy-peasy";

export const addTask = action((state, newTask) => {
    state.tasks.push(newTask)
});

export const updateTasks = action((state, updatedTasks) => {
    state.tasks = updatedTasks
});