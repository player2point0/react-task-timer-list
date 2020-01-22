import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TaskContainer from './TaskContainer.js';
import Task from './ReactTask';
import HoursOverlay from './HoursOverlay.js';
import SideBar from './SideBar.js'
import * as serviceWorker from './serviceWorker.js';

const SAVE_INTERVAL = 60;

class TaskController extends React.Component {
    constructor(props) {
        super(props);
        //store the tasks
        let defaultTasks = this.loadTasks();

        this.state = {
            time: 0,
            tasks: defaultTasks,
            showTaskForm: false,
            saveTasks: false,
        };

        this.toggleTaskForm = this.toggleTaskForm.bind(this);
        this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
        this.handleNewTaskHoursChange = this.handleNewTaskHoursChange.bind(this);
        this.handleNewTaskMinsChange = this.handleNewTaskMinsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addTask = this.addTask.bind(this);
        this.taskOnClick = this.taskOnClick.bind(this);
        this.taskUp = this.taskUp.bind(this);
        this.taskDown = this.taskDown.bind(this);
        this.startTask = this.startTask.bind(this);
        this.finishTask = this.finishTask.bind(this);
        this.addTime = this.addTime.bind(this);
        this.saveTasks = this.saveTasks.bind(this);
        this.loadTasks = this.loadTasks.bind(this);

        this.interval = setInterval(() => this.tick(), 1000);
    }

    //update all the tasks which are started
    tick() {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].started && !updatedTasks[i].paused) {
                updatedTasks[i].remainingTime--;
                if (updatedTasks[i].remainingTime <= 0) {
                    updatedTasks[i].remainingTime = 0;
                    
                    if(!updatedTasks[i].timeUp){
                        sendNotification("task out of time", "");
                        updatedTasks[i].isViewing = true;
                        updatedTasks[i].timeUp = true;
                        this.saveTasks();
                    }
                }
            }
        }

        this.setState(state => ({
            tasks: updatedTasks,
            time: state.time + 1,
        }));

        //save all tasks every n ticks
        if (this.state.time % SAVE_INTERVAL === 0) {
            this.setState({ saveTasks: true });
        }
    }

    //save all tasks
    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }

    //load any saved tasks
    loadTasks() {
        let savedTasks = JSON.parse(localStorage.getItem("tasks"));

        if (savedTasks === null || savedTasks === undefined) {
            savedTasks = [];
        }

        return savedTasks;
    }

    //display the add task inputs
    toggleTaskForm() {
        this.setState(state => ({
            showTaskForm: !state.showTaskForm,
        }));
    }

    //interval for the tick method, called when changes are made to the props
    componentDidUpdate() {
        if (this.state.saveTasks) {
            console.log("save tasks");
            this.saveTasks();
            this.setState({ saveTasks: false });
        }
    }

    //methods for the new task input
    handleNewTaskNameChange(e) {
        this.setState({ newTaskName: e.target.value });
    }
    handleNewTaskHoursChange(e) {
        this.setState({ newTaskHours: e.target.value });
    }
    handleNewTaskMinsChange(e) {
        this.setState({ newTaskMins: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        this.addTask();
    }

    addTask(){
        requestNotifications();

        if (!this.state.newTaskName || !this.state.newTaskHours || !this.state.newTaskHours) return;
        if (isNaN(this.state.newTaskHours) || isNaN(this.state.newTaskMins)) return;
        if (this.state.newTaskHours < 0 || this.state.newTaskMins < 0) return;

        let newTaskDuration = (this.state.newTaskHours * 3600) + (this.state.newTaskMins * 60);

        let newTask = new TaskContainer(
            this.state.newTaskName,
            newTaskDuration
        );

        this.setState(state => ({
            tasks: state.tasks.concat(newTask),
            addTask: false,
        }));

        //clear the inputs
        this.setState(state => ({
            newTaskName: "",
            newTaskHours: "0",
            newTaskMins: "0",
            saveTasks: true
        }));
    }

    //display the selected task
    taskOnClick(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                updatedTasks[i].isViewing = !updatedTasks[i].isViewing;
                break;
            }
        }

        this.setState({
            tasks: updatedTasks
        });
    }

    //move the selected task up in the UI and nearer to the front in the list
    taskUp(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {

                if ((i - 1) < 0) return;//already in first place

                //swap
                let tempTask = updatedTasks[i];
                updatedTasks[i] = updatedTasks[i - 1];
                updatedTasks[i - 1] = tempTask;

                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            saveTasks: true
        });
    }

    //move the selected task down in the UI and nearer to the end in the list
    taskDown(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {

                if ((i + 1) >= updatedTasks.length) return;//already in last place

                //swap
                let tempTask = updatedTasks[i];
                updatedTasks[i] = updatedTasks[i + 1];
                updatedTasks[i + 1] = tempTask;

                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            saveTasks: true
        });
    }

    startTask(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = updatedTasks.length - 1; i >= 0; i--) {
            if (updatedTasks[i].id === id) {

                if (updatedTasks[i].started) {
                    if (updatedTasks[i].remainingTime >= 0) {

                        if(updatedTasks[i].paused) updatedTasks[i].unPause();
                        else updatedTasks[i].pause();
                    }
                }

                updatedTasks[i].started = true;
                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            saveTasks: true
        });
    }

    finishTask(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = updatedTasks.length - 1; i >= 0; i--) {
            if (updatedTasks[i].id === id) {
                updatedTasks.splice(i, 1);
                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            saveTasks: true
        });
        //sendNotification()
    }

    addTime(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                console.log(updatedTasks[i]);
                updatedTasks[i].addTime();
                break;
            }
        }

        this.setState({
            tasks: updatedTasks,
            saveTasks: true
        });
    }

    render() {
        let addTaskHtml;

        if (this.state.showTaskForm) {
            //display the inputs
            addTaskHtml = (
                <form className="addTaskForm" onSubmit={this.handleSubmit} autoComplete="off">
                    <input
                        id="task-name-input"
                        type="text"
                        onChange={this.handleNewTaskNameChange}
                        value={this.state.newTaskName}
                        placeholder="name"
                    />
                    <input
                        id="task-hours-input"
                        type="number"
                        min="0"
                        max="99"
                        onChange={this.handleNewTaskHoursChange}
                        value={this.state.newTaskHours}
                        placeholder="hours"
                    />
                    <input
                        id="task-mins-input"
                        type="number"
                        min="0"
                        max="60"
                        step="1"
                        onChange={this.handleNewTaskMinsChange}
                        value={this.state.newTaskMins}
                        placeholder="minutes"
                    />
                    <div className="taskInput">
                        <button>add</button>
                    </div>
                </form>
            );
        }

        return (
            <div className="app">
                <HoursOverlay
                    tasks={this.state.tasks}
                />
                <SideBar 
                    tasks={this.state.tasks}
                    sendNotification={sendNotification}
                />
                <div className="tasksContainer">
                    {this.state.tasks.map(task => (<Task
                        key={task.id}
                        id={task.id}
                        name={task.name}
                        duration={task.totalDuration}
                        remainingTime={task.remainingTime}
                        started={task.started}
                        paused={task.paused}
                        isViewing={task.isViewing}
                        taskOnClick={this.taskOnClick}
                        taskUp={this.taskUp}
                        taskDown={this.taskDown}
                        startTask={this.startTask}
                        finishTask={this.finishTask}
                        addTime={this.addTime}
                    />))}
                </div>
                <div className="addTaskButton" onClick={this.toggleTaskForm}>
                    <h1>add task</h1>
                </div>
                {addTaskHtml}
            </div>
        );
    }
}

// ========================================

async function requestNotifications(){
    const status = await Notification.requestPermission();
    console.log("notifications : "+status);
}

requestNotifications();

serviceWorker.register();

function sendNotification(title, text){

    const options = {
        body: text,

    }
    const notification = new Notification(title, options);

    setTimeout(notification.close.bind(notification), 4000);
}

ReactDOM.render(
    <TaskController />,
    document.getElementById('root')
);