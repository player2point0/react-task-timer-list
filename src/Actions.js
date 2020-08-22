import { action } from 'easy-peasy';

//todo separate this into relevant files

export const loadTasks = action((state, payload) => {
   state.tasks = payload
});

//todo could also add firebase saving here
export const addTask =  action((state, payload) => {
   state.tasks.push(payload)
});