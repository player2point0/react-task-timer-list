import {
    addTask,
    updateTasks,
    viewTask,
    unViewTask,
    addObjective,
    completeObjective,
    addTime,
    finishTask, setReportFlow
} from "./TaskActions";
import TaskContainer from "../../Task/TaskContainer";

export const taskModel = {
    tasks: [new TaskContainer("test", 3600, new Date(), false)],
    addTask: addTask,
    updateTasks: updateTasks,
    viewTask: viewTask,
    unViewTask: unViewTask,
    addObjective: addObjective,
    completeObjective: completeObjective,
    addTime: addTime,
    finishTask: finishTask,
    setReportFlow: setReportFlow,
};
