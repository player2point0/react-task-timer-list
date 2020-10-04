import React, {useState} from "react";
import {requestNotifications} from "../Utility/Utility";
import TaskContainer from "../Task/TaskContainer";
import {useStoreActions} from "easy-peasy";

export default function NewTaskForm() {

    const [newTaskName, setNewTaskName] = useState("");
    const [taskNameInputRef, setTaskNameInputRef] = useState(null);
    const [newTaskHours, setNewTaskHours] = useState("0");
    const [newTaskMins, setNewTaskMins] = useState("0");
    const addTaskAction = useStoreActions(actions => actions.tasks.addTask);

    //methods for the new task input
    const handleNewTaskNameChange = (e) => {
        setNewTaskName(e.target.value.toLowerCase());
    };
    const handleNewTaskHoursChange = (e) => {
        setNewTaskHours(e.target.value);
    };
    const handleNewTaskMinsChange = (e) => {
        setNewTaskMins(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        addTask(newTaskName, newTaskHours, newTaskMins, addTaskAction);

        setNewTaskName("");
        setNewTaskHours("0");
        setNewTaskMins("0");

        taskNameInputRef.focus();
    };

    const validateInputs = () => {
        if(!newTaskName) return  "name required";
        if (newTaskHours < 0 || newTaskMins < 0) return "time must be positive";
        if(Number(newTaskHours + newTaskMins) === 0) return "time required";

        return "";
    };

    const taskValidationMessage = validateInputs();

    return <form
        id="addTaskForm"
        className="addTaskForm"
        autoComplete="off"
    >
        <input
            id="task-name-input"
            type="text"
            ref={(input) => { setTaskNameInputRef(input); }}
            autoFocus
            onChange={handleNewTaskNameChange}
            value={newTaskName}
            placeholder="name"
        />
        <input
            id="task-hours-input"
            type="number"
            min="0"
            max="99"
            onChange={handleNewTaskHoursChange}
            value={newTaskHours}
            placeholder="hours"
        />
        <input
            id="task-mins-input"
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

function addTask(name, hours, mins, addTaskAction) {
    requestNotifications();
    //need a name and at least one time value
    if (!name || (!hours && !mins)) return;

    //if we have one and not the other then assume zero
    if (!hours) hours = 0;
    if (!mins) mins = 0;

    //needs to be above zero
    if (hours < 0 || mins < 0 || Number(hours + mins) === 0) return;

    let newTaskDuration = hours * 3600 + mins * 60;
    let currentDate = new Date();

    let newTask = new TaskContainer(
        name,
        newTaskDuration,
        currentDate
    );

    addTaskAction(newTask);
}