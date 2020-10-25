import {action, debug} from "easy-peasy";
import {firebaseSaveDayStat} from "../../Firebase/FirebaseController";
import {createDayStat} from "../../MainApp/DayStat";

//todo add saving middleware

//todo kinda an anti pattern, probably should refactor
export const loadDayStat = action((state, dayStat) => {
    state.dayStat = dayStat
});
//
export const saveDayStat = action((state) => {
    firebaseSaveDayStat(state.dayStat);
});

export const resetDayStat = action((state) => {
    state.dayStat = createDayStat();
});

export const addDayStatTask = (state, task, currentDateString) => {
    state.dayStat.tasks.push({
        id: task.id,
        name: task.name,
        start: [currentDateString],
        stop: [currentDateString],
    });
};