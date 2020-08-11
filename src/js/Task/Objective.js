import React from "react";
import '../../css/objective.css';

export default function Objective(props) {

    let completeButton = <button
        onClick={function (e) {
            e.stopPropagation();
            props.completeObjective(props.taskId, props.id);
        }}
    >done</button>;

    let objectiveName = <div
        className={"taskObjectiveName"}
    >{props.name}</div>;

    if (props.finished) {
        return <div/>
        /*
        objectiveName = <del>{objectiveName}</del>;
        completeButton = "";
    */
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