import React from "react";
import "../../css/taskNotViewing.css";

export const MIN_TASK_HEIGHT = 5;
export const MIN_HOUR_TIME = 0.1;
export const HOUR_HEIGHT = 30;
export const HOUR_IN_SECONDS = 60 * 60;

export default function TaskNotViewing(props) {
    let taskHeightPer = (props.remainingTime / HOUR_IN_SECONDS) < MIN_HOUR_TIME
        ? MIN_HOUR_TIME : (props.remainingTime / HOUR_IN_SECONDS);
    let taskHeight = (taskHeightPer * HOUR_HEIGHT) < MIN_TASK_HEIGHT
        ? MIN_TASK_HEIGHT : (taskHeightPer * HOUR_HEIGHT);

    return (
        <div
            id={props.id}
            className="taskNotViewing"
            onClick={e => {
                props.taskOnClick(props.id, e);
                const task = document.getElementById(props.id);
                if (task) task.scrollIntoView(true);
            }}
            style={{
                height: taskHeight + "vh",
            }}
        >
            <div className="taskNotViewingName">{props.name}</div>
        </div>
    );
}
