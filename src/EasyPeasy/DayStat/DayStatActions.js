import {action} from "easy-peasy";
import {firebaseSaveDayStat} from "../../Firebase/FirebaseController";

export const updateDayStat = action((state, updatedDayStat) => {
    state.dayStat = updatedDayStat
});

export const saveDayStat = action((state) => {
    //copy the object for some reason;
    const dayStat = Object.assign({}, state.dayStat);
    firebaseSaveDayStat(dayStat);
});