import {
    addTask,
    updateTasks,
    viewTask,
    unViewTask,
    addObjective,
    completeObjective,
    addTime,
    finishTask, setReportFlow, removeTask, saveTask, resetTasks
} from "./TaskActions";
import TaskContainer from "../../Task/TaskContainer";

export const taskModel = {
    tasks: [],
    addTask: addTask,
    updateTasks: updateTasks,
    viewTask: viewTask,
    unViewTask: unViewTask,
    addObjective: addObjective,
    completeObjective: completeObjective,
    addTime: addTime,
    finishTask: finishTask,
    setReportFlow: setReportFlow,
    removeTask: removeTask,
    saveTask: saveTask,
    resetTasks: resetTasks,
};
