import {
    addTask,
    loadTasks,
    addObjective,
    completeObjective,
    finishTask, setReportFlow, removeTask, saveTask, resetTasks, addFlowStat
} from "./TaskActions";
import {action} from "easy-peasy";

export const taskModel = {
    tasks: [],
    addTask: addTask,
    loadTasks: loadTasks,
    addObjective: addObjective,
    completeObjective: completeObjective,
    finishTask: finishTask,
    setReportFlow: action((state, {taskId, val}) => setReportFlow(state, taskId, val)),
    removeTask: action((state, taskId) => removeTask(state, taskId)),
    saveTask: saveTask,
    resetTasks: resetTasks,
    addFlowStat: action((state, {taskId, flowObj}) => addFlowStat(state, taskId, flowObj)),
};
