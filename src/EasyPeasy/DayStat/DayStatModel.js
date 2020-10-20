import {saveDayStat, loadDayStat, resetDayStat} from "./DayStatActions";
import {createDayStat} from "../../MainApp/DayStat";

export const dayStatModel = {
    dayStat: createDayStat(),
    loadDayStat: loadDayStat,
    saveDayStat: saveDayStat,
    resetDayStat: resetDayStat,
};