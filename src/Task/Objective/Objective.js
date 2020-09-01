import React from "react";
import './objective.css';

export default function Objective({completeObjective, taskId, id, name, finished}) {

    let completeButton = <button
        onClick={function (e) {
            e.stopPropagation();
            completeObjective({
                taskId: taskId,
                objectiveId: id
            });
        }}
    >done</button>;

    let objectiveName = <div
        className={"taskObjectiveName"}
    >{name}</div>;

    if (finished) {
        objectiveName = <del>{objectiveName}</del>;
        completeButton = "";
    }

    //todo fix the height sizing of long objectives
    return (
        <div
            className="taskObjective"
            onClick={function (e) {
                e.stopPropagation();
            }}
        >
            {objectiveName}
            {completeButton}
        </div>);
}