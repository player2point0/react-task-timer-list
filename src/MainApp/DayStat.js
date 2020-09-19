import uid from "uid";
import {formatDayMonth} from "../Utility/Utility";

export function createDayStat() {
    return {
        id: uid(32),
        date: formatDayMonth(new Date()),
        userId: null,
        tasks: [],
    };
}