import {
    addTask,
    updateTasks,
    addObjective,
    completeObjective,
    addTime,
    finishTask, setReportFlow, removeTask, saveTask, resetTasks
} from "./TaskActions";

export const taskModel = {
    tasks: [],
    addTask: addTask,
    updateTasks: updateTasks,
    addObjective: addObjective,
    completeObjective: completeObjective,
    addTime: addTime,
    finishTask: finishTask,
    setReportFlow: setReportFlow,
    removeTask: removeTask,
    saveTask: saveTask,
    resetTasks: resetTasks,
};
