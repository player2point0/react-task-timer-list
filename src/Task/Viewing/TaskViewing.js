import React, {useState} from "react";
import "./taskViewing.css";
import {formatTime} from "../../Utility/Utility";
import Objective from "../Objective/Objective";

export default function TaskViewing({
                                        id, paused, remainingTime, started, objectives, completeObjective,
                                        startTask, setReportFlow, finishTask, addTime, taskOnClick,
                                        addObjective
                                    }) {

    const [newObjectiveName, setNewObjectiveName] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newObjectiveName) return;

        //todo if there is a completed objective then swap the new and the old
        addObjective(id, newObjectiveName);

        setNewObjectiveName("");
    };

    const TASK_ID = id;

    let taskObjectives;
    let startButtonText = paused || remainingTime === 0
        ? "un pause" : "pause";
    if (!started) startButtonText = "start";

    if (objectives) {
        taskObjectives = objectives
            .filter(objective => !objective.hide)
            .map(objective => (
                <Objective
                    key={objective.id}
                    name={objective.name}
                    id={objective.id}
                    taskId={TASK_ID}
                    finished={objective.finished}
                    completeObjective={completeObjective}
                />
            ));
    }

    const addTaskObjective =
        <form
            className="addObjectiveForm"
            onSubmit={handleSubmit}
            autoComplete="off"
            onClick={function (e) {
                e.stopPropagation();
            }}
        >
            <input
                id="objective-name-input"
                type="text"
                className="addObjectiveInput"
                onChange={(e) => setNewObjectiveName(e.target.value)}
                value={newObjectiveName}
                placeholder="objective"
            />
            <button>add</button>
        </form>;

    const taskViewingButtons = (
        <div className="taskViewingButtons">
            <TaskViewingButton
                buttonText={startButtonText}
                onClickFunc={() => {
                    startTask(id);
                    setReportFlow(id, true);
                }}
            />
            <TaskViewingButton
                buttonText={"finish"}
                onClickFunc={() => {
                    finishTask(id);
                    setReportFlow(id, true);
                }}
            />
            <TaskViewingButton
                buttonText={"+10 mins"}
                onClickFunc={() => addTime(id)}
            />
        </div>
    );

    return (
        <div
            className="taskVIewing"
            onClick={e => {
                taskOnClick(id, e);
            }}
        >
            <div className="taskObjectives">
                <div className={"taskObjectiveScrollContainer"}>
                    {taskObjectives}
                    {addTaskObjective}
                </div>
            </div>
            <div className={"taskControls"}>
                <div className="taskTime">{formatTime(remainingTime)}</div>
                {taskViewingButtons}
            </div>
        </div>
    );

}

function TaskViewingButton({buttonText, onClickFunc}) {
    return (
        <button
            className="taskViewingButton"
            onClick={function (e) {
                e.stopPropagation();
                onClickFunc();
            }}
        >
            {buttonText}
        </button>);
}