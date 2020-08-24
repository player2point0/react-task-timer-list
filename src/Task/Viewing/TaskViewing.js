import React, {useState} from "react";
import "./taskViewing.css";
import {formatTime} from "../../Utility/Utility";
import Objective from "../Objective/Objective";
import {useStoreActions, useStoreState} from "easy-peasy";

export default function TaskViewing({
                                        id, paused, remainingTime, started, objectives,
                                        setReportFlow, finishTask, addTime, name,
                                        updateTasks, updateDayStat
                                    }) {

    const [newObjectiveName, setNewObjectiveName] = useState("");
    const unViewTask = useStoreActions(actions => actions.tasks.unViewTask);
    const addObjective = useStoreActions(actions => actions.tasks.addObjective);
    const completeObjective = useStoreActions(actions => actions.tasks.completeObjective);
    const tasks = useStoreState(state => state.tasks.tasks);
    const dayStat = useStoreState(state => state.dayStat.dayStat);

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
                    startTask(id, tasks, dayStat, updateTasks, updateDayStat);
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
                //todo could check if the task is active and then pause and report flow
                unViewTask(id);
            }}
        >
            <div className="taskObjectives">
                {taskObjectives}
                {addTaskObjective}
            </div>
            <div className={"taskControls"}>
                <div className="taskName">{name}</div>
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

//todo refactor this, very messy
function startTask(id, tasks, dayStat, updateTasks, updateDayStat) {
    let taskActive = false;
    let currentDate = (new Date()).toISOString();

    //todo check if the task is from a previous day stat and so doesn't exist in the tasks
    const updatedTask = tasks.find(task => task.id === id);

    if (updatedTask.started) {
        if (updatedTask.remainingTime >= 0) {
            if (updatedTask.paused) {
                updatedTask.unPause();
                taskActive = true;

                let taskInDayStat = false;

                //update the dayStat start and stop values
                for (let j = 0; j < dayStat.tasks.length; j++) {
                    if (dayStat.tasks[j].id === updatedTask.id) {
                        dayStat.tasks[j].start.push(currentDate);
                        dayStat.tasks[j].stop.push(currentDate);

                        taskInDayStat = true;
                    }
                }

                if (!taskInDayStat) {
                    dayStat.tasks.push({
                        id: updatedTask.id,
                        name: updatedTask.name,
                        start: [currentDate],
                        stop: [currentDate],
                    });
                }

            } else {
                updatedTask.pause();
            }
        }
    } else {
        updatedTask.start();
        taskActive = true;
        dayStat.tasks.push({
            id: updatedTask.id,
            name: updatedTask.name,
            start: [currentDate],
            stop: [currentDate],
        });
    }

    //pause any other active tasks
    if (taskActive) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id !== id && tasks[i].started && !tasks[i].paused) {
                tasks[i].pause();
                tasks[i].isViewing = false;
            }
        }
    }

    updateTasks(updateTasks);
    updateDayStat(updateDayStat);
}