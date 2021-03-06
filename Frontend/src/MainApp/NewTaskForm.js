import React, {useState} from "react";
import {requestNotifications} from "../Utility/Utility";
import TaskContainer from "../Task/TaskContainer";
import {useStoreActions, useStoreState} from "easy-peasy";
import Fuse from "fuse.js";

export default function NewTaskForm() {

    const [newTaskName, setNewTaskName] = useState("");
    const [taskNameInputRef, setTaskNameInputRef] = useState(null);
    const [newTagName, setNewTagName] = useState("");
    const [tagSuggestion, setTagSuggestion] = useState("");
    const [newTaskHours, setNewTaskHours] = useState("0");
    const [newTaskMins, setNewTaskMins] = useState("0");
    const addTaskAction = useStoreActions(actions => actions.tasks.addTask);
    const addTagAction = useStoreActions(actions => actions.userData.addTag);
    const tags = useStoreState(state => state.userData.tags);
    const fuse = new Fuse(tags, {});

    //methods for the new task input
    const handleNewTaskNameChange = (e) => {
        setNewTaskName(e.target.value.toLowerCase());
    };
    const handleNewTagNameChange = (e) => {
        const currentTagVal = e.target.value.toLowerCase();

        const result = fuse.search(currentTagVal);
        const newTagSuggestion = result.length > 0? result[0]["item"] : "";

        setTagSuggestion(newTagSuggestion)
        setNewTagName(currentTagVal);
    };
    const handleNewTaskHoursChange = (e) => {
        setNewTaskHours(e.target.value);
    };
    const handleNewTaskMinsChange = (e) => {
        setNewTaskMins(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        addTask(newTaskName, newTagName, newTaskHours, newTaskMins, addTaskAction, addTagAction);

        setNewTaskName("");
        setNewTagName("");
        setNewTaskHours("0");
        setNewTaskMins("0");

        taskNameInputRef.focus();
    };

    const selectTagSuggestion = () => {
        setNewTagName(tagSuggestion);
        setTagSuggestion("");
    };

    const validateInputs = () => {
        if(!newTaskName) return  "name required";
        if(!newTagName) return  "tag required";
        if (newTaskHours < 0 || newTaskMins < 0) return "time must be positive";
        if(Number(newTaskHours + newTaskMins) === 0) return "time required";

        return "";
    };

    //todo add time suggestion
    //todo refactor this, cause it is starting to do a lot esp with a time suggestion

    const taskValidationMessage = validateInputs();

    return <form
        className="addTaskForm"
        autoComplete="off"
    >
        <input
            type="text"
            ref={(input) => { setTaskNameInputRef(input); }}
            autoFocus
            onChange={handleNewTaskNameChange}
            value={newTaskName}
            placeholder="name"
        />
        <input
            type="text"
            onChange={handleNewTagNameChange}
            value={newTagName}
            placeholder="tag"
            onKeyDown={(e) => {
                if(e.keyCode === 13 && tagSuggestion){
                    selectTagSuggestion();
                }
            }}
        />
        {tagSuggestion && <div
            className="tag-suggestion-message"
            onClick={selectTagSuggestion}
        >
            {tagSuggestion}
        </div>}
        <input
            type="number"
            min="0"
            max="99"
            onChange={handleNewTaskHoursChange}
            value={newTaskHours}
            placeholder="hours"
        />
        <input
            type="number"
            min="0"
            max="60"
            step="1"
            onChange={handleNewTaskMinsChange}
            value={newTaskMins}
            placeholder="minutes"
        />
        {taskValidationMessage && <div
            className="task-validation-message"
        >
            {taskValidationMessage}
        </div>}
        {!taskValidationMessage && <button
            className={"addTask"}
            onClick={handleSubmit}
        >
            add
        </button>}
    </form>;
};

function addTask(name, tag, hours, mins, addTaskAction, addTagAction) {
    requestNotifications();
    //need a name and at least one time value
    if (!name || !tag ||  (!hours && !mins)) return;

    //if we have one and not the other then assume zero
    if (!hours) hours = 0;
    if (!mins) mins = 0;

    //needs to be above zero
    if (hours < 0 || mins < 0 || Number(hours + mins) === 0) return;

    let newTaskDuration = hours * 3600 + mins * 60;
    let currentDate = new Date();

    let newTask = new TaskContainer(
        name,
        tag,
        newTaskDuration,
        currentDate
    );

    addTagAction(tag);
    addTaskAction(newTask);
}