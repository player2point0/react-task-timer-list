import { action } from 'easy-peasy';

//todo separate this into relevant files

export const loadTasks = action((state, payload) => {
   state.tasks = payload
});
