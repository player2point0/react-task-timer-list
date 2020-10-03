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
    addTime: action((state, taskId) => addTime(state, taskId)),
    finishTask: finishTask,
    setReportFlow: action((state, {taskId, val}) => setReportFlow(state, taskId, val)),
    removeTask: action((state, taskId) => removeTask(state, taskId)),
    saveTask: saveTask,
    resetTasks: resetTasks,
    addFlowStat: action((state, {taskId, flowObj}) => addFlowStat(state, taskId, flowObj)),
};
