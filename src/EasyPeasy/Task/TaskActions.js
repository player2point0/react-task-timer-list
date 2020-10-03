import {action} from "easy-peasy";
import {firebaseSaveTask} from "../../Firebase/FirebaseController";

/*
USE IMMUTABLE OBJECTS SO THAT THE RERENDER WORKS
 */

//todo add saving middleware
//todo refactor the rest to define the action in the store
// also check if each one is needed
export const addTask = action((state, newTask) => {
    state.tasks.push(newTask);
    firebaseSaveTask(newTask);
});

export const updateTasks = action((state, updatedTasks) => {
    state.tasks = updatedTasks
});

export const addObjective = action((state, {taskId, objectiveName}) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].addObjective(objectiveName);

    state.tasks = tempTasks;
    firebaseSaveTask(state.tasks[taskIndex]);
});

export const completeObjective = action((state, {taskId, objectiveId}) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].completeObjective(objectiveId);

    state.tasks = tempTasks;
    firebaseSaveTask(state.tasks[taskIndex]);
});

export const addTime = (state, taskId) =>  {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].addTime();

    state.tasks = tempTasks;
    firebaseSaveTask(state.tasks[taskIndex]);
};

export const finishTask = action((state, taskId) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].finish();

    state.tasks = tempTasks;
    firebaseSaveTask(state.tasks[taskIndex]);
});

export const setReportFlow =  (state, taskId, val)=> {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    tempTasks[taskIndex].setReportFlow(val);

    state.tasks = tempTasks;
};

export const removeTask = (state, taskId) => {
    const tempTasks = [...state.tasks];

    const taskIndex = tempTasks.findIndex(task => task.id === taskId);
    const removedTask = tempTasks[taskIndex];
    tempTasks.splice(taskIndex, 1);

    state.tasks = tempTasks;
    firebaseSaveTask(removedTask);
};

export const saveTask = action((state, taskId) => {
    firebaseSaveTask(state.tasks.find(task => task.id === taskId));
});

export const resetTasks = action((state) => {
    state.tasks = [];
});

export const addFlowStat = (state, taskId, flowObj) => {
    const tempTasks = [...state.tasks];
    const taskIndex = tempTasks.findIndex(task => task.id === taskId);

    tempTasks[taskIndex].stats.flow.push(flowObj);

    state.tasks = tempTasks;
    firebaseSaveTask(state.tasks[taskIndex]);
};

export const decrementTime = (state, id, deltaTime) => {
    const tempTasks = [...state.tasks];
    const taskIndex = tempTasks.findIndex(task => task.id === id);

    const newTime = tempTasks[taskIndex].remainingTime - deltaTime;

    if(newTime >= 0) tempTasks[taskIndex].remainingTime = newTime;
    else tempTasks[taskIndex].remainingTime = 0;

    state.tasks = tempTasks;
};