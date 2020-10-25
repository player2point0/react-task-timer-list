import React from "react";
import './objective.css';
import Linkify from 'linkifyjs/react';

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

    return (
        <div
            className="taskObjective"
            onClick={function (e) {
                e.stopPropagation();
            }}
        >
            <Linkify>
                <div
                    className={"taskObjectiveName"}
                >
                    {finished?<del>{name}</del> : name}
                </div>
            </Linkify>
            {!finished && completeButton}
        </div>);
}