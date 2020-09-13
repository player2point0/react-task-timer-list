import {action} from "easy-peasy";
import {firebaseSaveDayStat} from "../../Firebase/FirebaseController";
import {createDayStat} from "../../MainApp/DayStat";

export const updateDayStat = action((state, updatedDayStat) => {
    state.dayStat = updatedDayStat
});

export const saveDayStat = action((state) => {
    //copy the object for some reason;
    const dayStat = Object.assign({}, state.dayStat);
    firebaseSaveDayStat(dayStat);
});

export const resetDayStat = action((state) => {
    state.dayStat = createDayStat();
});