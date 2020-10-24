exports.sortTasks = (tasks) => {
    /*
   create a score for each task
   -tasks that have been started and have high flow values,
   would need to expand task to contain average flow and last active

   could also change the task ordering based on time and periods of flow
    */

    tasks.sort((taskA, taskB) => {
        let score = 0;
        //older tasks
        score += taskA.dateCreated < taskB.dateCreated? -1:1;
        score += taskA.dateStarted < taskB.dateStarted? -1:1;
        //shorter tasks
        score += taskA.remainingTime < taskB.remainingTime? -1:1;
        //started tasks
        if(taskA.started && !taskB.started) score += -1;
        else if(!taskA.started && taskB.started) score += 1;

        return score;
    });

    return tasks;
};