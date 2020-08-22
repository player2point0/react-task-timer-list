import {action} from "easy-peasy";

export const addTask =  action((state, payload) => {
    state.tasks.push(payload)
});