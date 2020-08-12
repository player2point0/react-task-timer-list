import React from "react";
import '../../css/objective.css';

export default function Objective({completeObjective, taskId, id, name, finished}) {

    let completeButton = <button
        onClick={function (e) {
            e.stopPropagation();
            completeObjective(taskId, id);
        }}
    >done</button>;

    let objectiveName = <div
        className={"taskObjectiveName"}
    >{name}</div>;

    if (finished) {
        objectiveName = <del>{objectiveName}</del>;
        completeButton = "";
    }

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