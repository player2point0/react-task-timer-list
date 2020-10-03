import {
    addTask,
    updateTasks,
    addObjective,
    completeObjective,
    addTime,
    finishTask, setReportFlow, removeTask, saveTask, resetTasks, addFlowStat
} from "./TaskActions";
import {action} from "easy-peasy";

export const taskModel = {
    tasks: [],
    addTask: addTask,
    updateTasks: updateTasks,
    addObjective: addObjective,
    completeObjective: completeObjective,
    addTime: addTime,
    finishTask: finishTask,
    setReportFlow: setReportFlow,
    removeTask: action((state, taskId) => removeTask(state, taskId)),
    saveTask: saveTask,
    resetTasks: resetTasks,
    addFlowStat: addFlowStat,
};
