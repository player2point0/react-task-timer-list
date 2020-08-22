import {action} from "easy-peasy";

export const updateDayStat = action((state, updatedDayStat) => {
    state.dayStat = updatedDayStat
});