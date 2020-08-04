import React, {useState} from 'react';
import '../css/dayRecap.css';
import './Task/TaskNotViewing'
import uid from "uid";

export default function DayRecap({dayStat}) {

    const [showRecap, setShowRecap] = useState(false);

    //todo refactor the hours overlay to take a start and a end time

    if(!showRecap){
        return (
            <div>
                <div
                    className={"dayRecapButton"}
                    onClick={() => setShowRecap(!showRecap)}
                >
                    recap
                </div>
            </div>
        );
    }

    //go through each task
    //in each task go through the start times
    //compare the gap between the start time and the end time
    //if more than 5 minutes create a new recap task
    //else extend the recap tasks end length
    //todo check that the time subtractions work
    const MAX_BREAK_TIME = 5*60;
    let recapTasksArr = [];

    for(let taskIndex = 0;taskIndex<dayStat.tasks.length;taskIndex++){
        const currentTask = dayStat.tasks[taskIndex];
        let currentStartTime = currentTask.start[0];
        let currentStopTime = currentTask.start[0];

        for(let timeIndex = 0;timeIndex<dayStat.tasks[taskIndex].start.length-1;timeIndex++){
            let breakLength = currentTask.start[timeIndex+1] - currentTask.stop[timeIndex];

            if(breakLength > MAX_BREAK_TIME){
                recapTasksArr.push({
                    startTime: currentStartTime,
                    stopTime: currentStopTime,
                    name: currentTask.name
                });
                currentStartTime = currentTask.start[timeIndex+1];
            }
            currentStopTime = currentTask.stop[timeIndex+1];
        }
        recapTasksArr.push({
            startTime: currentStartTime,
            stopTime: currentStopTime,
            name: currentTask.name
        });
    }

    //sort the tasks by time
    recapTasksArr.sort((taskA, taskB) => taskA.startTime - taskB.startTime);
    //go through and fill in any spaces
    for(let i = 0;i<recapTasksArr.length-1;i++){
        let breakLength = recapTasksArr[i+1].startTime - recapTasksArr[i].stopTime;

        if(breakLength > MAX_BREAK_TIME){
            recapTasksArr.splice(i, 0, {
                startTime: recapTasksArr[i+1].startTime,
                stopTime: recapTasksArr[i].stopTime,
                name: ""
            });
        }
    }

    const dayRecapGraph = showRecap? (
        <div>
            {recapTasksArr.forEach(task => <DayRecapTask
                key={uid(16)}
                startTime={task.startTime}
                stopTime={task.stopTime}
                name={task.name}
            />)}
        </div>
    ) : "";

    return (
        <div>
            {dayRecapGraph}
            <div
                className={"dayRecapButton"}
                onClick={() => setShowRecap(!showRecap)}
            >
                recap
            </div>
        </div>
    );
}

function DayRecapTask({startTime, endTime, name}){

    return (
      <div>name</div>
    );
}