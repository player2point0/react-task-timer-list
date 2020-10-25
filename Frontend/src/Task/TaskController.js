import React, {useState, useEffect} from "react";
import Task from "./Task";
import "../MainApp/newTaskForm.css";
import NewTaskForm from "../MainApp/NewTaskForm";
import {useStoreActions, useStoreState} from 'easy-peasy';
import {firebaseSaveTask} from "../Firebase/FirebaseController";

const SAVE_INTERVAL = 5 * 60 * 1000; //in milli for set interval

export default function TaskController() {

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [scrollToForm, setScrollToForm] = useState(false);
    const [lastTickTime, setLastTickTime] = useState(new Date());

    const tick = useStoreActions(actions => actions.tick);
    const startTask = useStoreActions(actions => actions.startTask);
    const reportFlow = useStoreActions(actions => actions.reportFlow);

    const tasks = useStoreState(state => state.tasks.tasks);
    const dayStat = useStoreState(state => state.dayStat.dayStat);

    const toggleTaskForm = () => {
        setShowTaskForm(!showTaskForm);
        setScrollToForm(true);
    };

    useEffect(() => {
        if (scrollToForm) {
            const addTaskFrom = document.getElementById("addTaskForm");
            if (addTaskFrom) addTaskFrom.scrollIntoView(false);

            setScrollToForm(false);
        }
    }, [scrollToForm]);

    useEffect(() => {
        const tickInterval = setInterval(() => {
            const currentDate = new Date();
            const deltaTime = (currentDate - lastTickTime) / 1000.0;
            setLastTickTime(currentDate);
            tick(deltaTime);
        }, 1000);
        const saveInterval = setInterval(() => {
            const saveTaskPromises = tasks.map(task => {
                return firebaseSaveTask(task)
            });
            Promise.all(saveTaskPromises)
                .catch(err => console.error(err));
        }, SAVE_INTERVAL);

        return () => {
            clearInterval(tickInterval);
            clearInterval(saveInterval);
        };

    }, [lastTickTime, tasks, dayStat]);

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (task.reportFlowFlag && (task.paused || task.finished)) {
            return <Task
                key={task.id}
                id={task.id}
                name={task.name}
                totalTime={task.totalTime}
                remainingTime={task.remainingTime}
                started={task.started}
                paused={task.paused}
                finished={task.finished}
                reportFlowFlag={task.reportFlowFlag}
                objectives={task.objectives}
                startTask={startTask}
                reportFlow={reportFlow}
            />
        }
    }

    return (
        <div>
            {tasks.map(task => (
                <Task
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    totalTime={task.totalTime}
                    remainingTime={task.remainingTime}
                    started={task.started}
                    paused={task.paused}
                    finished={task.finished}
                    reportFlowFlag={task.reportFlowFlag}
                    objectives={task.objectives}
                    startTask={startTask}
                    reportFlow={reportFlow}
                />
            ))}
            <div className="addTaskButton" onClick={toggleTaskForm}>
                <div>add task</div>
            </div>
            {showTaskForm &&
            <NewTaskForm/>}
        </div>
    );
}