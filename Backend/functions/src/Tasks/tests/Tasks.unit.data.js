const taskA = {
    name: "taskA",
    dateCreated: 1,
    dateStarted: 1,
    timeRemaining: 1,
    started: true,
};

const taskB = {
    name: "taskB",
    dateCreated: 3,
    dateStarted: 4,
    timeRemaining: 1,
    started: true,
};

const taskC = {
    name: "taskC",
    dateCreated: 5,
    dateStarted: 4,
    timeRemaining: 5,
    started: false,
};

const taskD = {
    name: "taskD",
    dateCreated: 15,
    dateStarted: 34,
    timeRemaining: 115,
    started: false,
};

exports.serverTasks = [
    taskB,
    taskC,
    taskD,
    taskA,
];


exports.sortedTasks = [
    taskA,
    taskB,
    taskC,
    taskD,
];