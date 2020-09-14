import React, {useState} from "react";
import "./taskViewing.css";
import {formatTime} from "../../Utility/Utility";
import Objective from "../Objective/Objective";
import {useStoreActions} from "easy-peasy";

export default function TaskViewing({id, paused, remainingTime, started,
                                        objectives, name, startTask}) {

    const [newObjectiveName, setNewObjectiveName] = useState("");
    const addObjective = useStoreActions(actions => actions.tasks.addObjective);
    const completeObjective = useStoreActions(actions => actions.tasks.completeObjective);
    const finishTask = useStoreActions(actions => actions.tasks.finishTask);
    const setReportFlow = useStoreActions(actions => actions.tasks.setReportFlow);
    const addTime = useStoreActions(actions => actions.tasks.addTime);
    const saveDayStat = useStoreActions(actions => actions.dayStat.saveDayStat);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newObjectiveName) return;

        //todo if there is a completed objective then swap the new and the old
        addObjective({
            taskId: id,
            objectiveName: newObjectiveName
        });

        setNewObjectiveName("");
    };

    const TASK_ID = id;

    let taskObjectives;

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
                buttonText={"finish"}
                onClickFunc={() => {
                    finishTask(id);
                    saveDayStat();
                    setReportFlow({
                        taskId: id,
                        val: true
                    });
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
                //todo could check if the task is active and then pause and report flow
                startTask(id);
            }}
        >

            <div className={"taskControls"}>
                <div className="taskName">{name}</div>
                <div className="taskTime">{formatTime(remainingTime)}</div>
                {taskViewingButtons}
            </div>
            <div className="taskObjectives">
                {taskObjectives}
                {addTaskObjective}
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