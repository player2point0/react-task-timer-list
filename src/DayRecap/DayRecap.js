import React, {useState} from 'react';
import './dayRecap.css';
import '../Task/NotViewing/TaskNotViewing'
import uid from "uid";
import {dateDiffInSeconds} from "../Utility/Utility";
import HoursOverlay from "../HourCover/HoursOverlay";

import {MIN_TASK_HEIGHT, MIN_HOUR_TIME, HOUR_HEIGHT, HOUR_IN_SECONDS} from '../Task/NotViewing/TaskNotViewing';

export function groupDayStatTasks(tasks){
    //go through each task
    //in each task go through the start times
    //compare the gap between the start time and the end time
    //if more than 5 minutes create a new recap task
    //else extend the recap tasks end length
    const MAX_BREAK_TIME = 5 * 60;
    let recapTasksArr = [];

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        const currentTask = tasks[taskIndex];
        let currentStartTime = currentTask.start[0];
        let currentStopTime = currentTask.stop[0];

        for (let timeIndex = 0; timeIndex < tasks[taskIndex].start.length - 1; timeIndex++) {
            let breakLength = dateDiffInSeconds(currentTask.stop[timeIndex], currentTask.start[timeIndex + 1]);

            if (breakLength > MAX_BREAK_TIME) {
                recapTasksArr.push({
                    startTime: currentStartTime,
                    stopTime: currentStopTime,
                    name: currentTask.name
                });
                currentStartTime = currentTask.start[timeIndex + 1];
            }
            currentStopTime = currentTask.stop[timeIndex + 1];
        }
        recapTasksArr.push({
            startTime: currentStartTime,
            stopTime: currentStopTime,
            name: currentTask.name
        });
    }

    //sort the tasks by time
    recapTasksArr.sort((taskA, taskB) => dateDiffInSeconds(taskB.startTime, taskA.startTime));
    //go through and fill in any spaces
    let recapTasksAndBreaks = [];
    for (let i = 0; i < recapTasksArr.length - 1; i++) {
        let breakLength = dateDiffInSeconds(recapTasksArr[i].stopTime, recapTasksArr[i + 1].startTime);

        if (breakLength > MAX_BREAK_TIME) {
            recapTasksAndBreaks.push({
                startTime: recapTasksArr[i].stopTime,
                stopTime: recapTasksArr[i+1].startTime,
                name: ""
            });
        }

        recapTasksAndBreaks.push({
            startTime: recapTasksArr[i].startTime,
            stopTime: recapTasksArr[i].stopTime,
            name: recapTasksArr[i].name
        });
    }

    recapTasksAndBreaks.push({
        startTime: recapTasksArr[recapTasksArr.length - 1].startTime,
        stopTime: recapTasksArr[recapTasksArr.length - 1].stopTime,
        name: recapTasksArr[recapTasksArr.length - 1].name
    });

    recapTasksAndBreaks.sort((taskA, taskB) => dateDiffInSeconds(taskB.startTime, taskA.startTime));

    return recapTasksAndBreaks;
}

export default function DayRecap({dayStat}) {
    if (!dayStat) return "no daystats loaded";
    if(dayStat.tasks.length === 0) return "no daystats loaded";

    const recapTasksAndBreaks = groupDayStatTasks(dayStat.tasks);

    return (
        <div>
            <HoursOverlay
                startTime={new Date(recapTasksAndBreaks[0].startTime)}
                numHours={12}
            />
            {recapTasksAndBreaks.map(task => <DayRecapTask
                key={uid(16)}
                startTime={task.startTime}
                stopTime={task.stopTime}
                name={task.name}
            />)}
        </div>
    );
}

//todo refactor this and taskNotViewing as one?
//todo add hidden text overflow like in the normal task
function DayRecapTask({startTime, stopTime, name}) {
    const duration = dateDiffInSeconds(startTime, stopTime);

    let taskHeightPer = (duration / HOUR_IN_SECONDS) < MIN_HOUR_TIME
        ? MIN_HOUR_TIME : (duration / HOUR_IN_SECONDS);
    let taskHeight = (taskHeightPer * HOUR_HEIGHT) < MIN_TASK_HEIGHT
        ? MIN_TASK_HEIGHT : (taskHeightPer * HOUR_HEIGHT);

    const style = !name ?
        {
            height: taskHeight + "vh",
            backgroundColor: "red",
        } :
        {
            height: taskHeight + "vh",
        };


    return (
        <div
            id={uid(16)}
            className="recapTask"
            style={style}
        >
            <div className="recapTaskName">{name}</div>
        </div>
    );
}