import {saveDayStat, updateDayStat, resetDayStat} from "./DayStatActions";
import {createDayStat} from "../../MainApp/DayStat";

export const dayStatModel = {
    dayStat: createDayStat(),
    updateDayStat: updateDayStat,
    saveDayStat: saveDayStat,
    resetDayStat: resetDayStat,
};