import React from "react";
import "./taskNotViewing.css";
import {useStoreActions} from "easy-peasy";

export const MIN_TASK_HEIGHT = 5;
export const MIN_HOUR_TIME = 0.1;
export const HOUR_HEIGHT = 30;
export const HOUR_IN_SECONDS = 60 * 60;

export default function TaskNotViewing({remainingTime, id, name}) {
    const taskHeightPer = (remainingTime / HOUR_IN_SECONDS) < MIN_HOUR_TIME
        ? MIN_HOUR_TIME : (remainingTime / HOUR_IN_SECONDS);
    const taskHeight = (taskHeightPer * HOUR_HEIGHT) < MIN_TASK_HEIGHT
        ? MIN_TASK_HEIGHT : (taskHeightPer * HOUR_HEIGHT);

    const viewTask = useStoreActions(actions => actions.tasks.viewTask);

    //todo maybe add back the time
    return (
        <div
            id={id}
            className="taskNotViewing"
            onClick={e => {
                viewTask(id);
                const task = document.getElementById(id);
                if (task) task.scrollIntoView(true);
            }}
            style={{
                height: taskHeight + "vh",
            }}
        >
            <div className="taskNotViewingName">{name}</div>
        </div>
    );
}