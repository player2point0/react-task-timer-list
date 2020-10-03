import {action, debug} from "easy-peasy";
import {firebaseSaveDayStat} from "../../Firebase/FirebaseController";
import {createDayStat} from "../../MainApp/DayStat";

//todo add logic to check for a date change and create a new dayStat
//todo add saving middleware

export const updateDayStat = action((state, updatedDayStat) => {
    state.dayStat = updatedDayStat
});

export const saveDayStat = action((state) => {
    //copy the object for some reason;
    //todo check this cause I don't think it is needed. no need to deconstruct here
    const dayStat = {...state.dayStat};
    firebaseSaveDayStat(dayStat);
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