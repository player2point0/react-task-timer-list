import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TaskContainer from './task.js';

const HOUR_HEIGHT = 30;

//renders the task based on the passed properties
//could change to a function
class Task extends React.Component {

    render() {
        let taskViewing;
        let coverHeight = 50 * ((this.props.duration - this.props.remainingTime) / this.props.duration);
        const HOUR_IN_SECONDS = 60 * 60;
        let taskHeightPer = (this.props.duration/HOUR_IN_SECONDS);
        if(taskHeightPer < 0.5) taskHeightPer = 0.5;

        let startButtonText = this.props.paused? "un pause" : "pause";
        if(!this.props.started) startButtonText = "start";

        //display additional details when the task is selected
        if (this.props.isViewing) {
            taskViewing = (
                <div>
                    <div className="taskViewingBackground"></div>
                    <div className="taskViewingCover"
                        style={{height:coverHeight+"vh"}}>
                    </div>
                    <div className="taskViewing">
                        <button className="taskStartButton" onClick={() => {this.props.startTask(this.props.id)}}>{startButtonText}</button>
                        <button className="taskAddTimeButton" onClick={() => {this.props.addTime(this.props.id)}}>add time</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="task">
                <div className="taskBody" style={{height:taskHeightPer*HOUR_HEIGHT+"vh"}}>
                    <div className="taskUpDownButtons">
                        <button className="taskUpButton" onClick={() => { this.props.taskUp(this.props.id) }}>Up</button>
                        <button className="taskDownButton" onClick={() => { this.props.taskDown(this.props.id) }}>Down</button>
                    </div>
                    <div className="taskSelectButton" onClick={() => { this.props.taskOnClick(this.props.id) }}>
                        <h1 className="taskName">{this.props.name}</h1>
                        <h1 className="taskTime">{formatTime(this.props.remainingTime)}</h1>
                    </div>
                </div>
                {taskViewing}
            </div>
        );
    }
}

//renders the hours overlay
class HoursOverlay extends React.Component {

    render() {

        //could adjust the height of the bars based on an viewed tasks
        //check if any tasks are viewed and if so don't display the overlay
        for(let i = 0;i<this.props.tasks.length;i++)
        {
            if(this.props.tasks[i].isViewing)
            {
                return(<div className="hourCover"></div>);
            } 
        }

        //draw hour bars for the next 12 hours
        let hourBars = [];
        let currentTime = new Date();
        let currentHour = currentTime.getUTCHours();
        
        //draw the first bar smaller based on the remaining time in the hour
        let mins = currentTime.getUTCMinutes();
        let heightPer = 1 - (mins/60.0);
        let hourBar = <h1 style={{height:heightPer*HOUR_HEIGHT+"vh"}}>{currentHour}</h1>;
        hourBars.push(hourBar); 

        for(let i = 1;i<12;i++)
        {
            currentTime.setUTCHours(currentHour + i)
            let hour = currentTime.getUTCHours();
            let hourBar = <h1 style={{height:HOUR_HEIGHT+"vh"}}>{hour}</h1>;
            hourBars.push(hourBar); 
        }

        return (
            <div className="hourCover">
                {hourBars}
            </div>
        );
    }
}

function formatTime(time){
    let hours = Math.floor(time / 3600);
    let mins = Math.floor((time - (hours * 3600)) / 60);
    
    return "hours: "+hours+" mins: "+mins;
}

class TaskController extends React.Component {
    constructor(props) {
        super(props);
        //store the tasks
        let defaultTasks = [
            new TaskContainer("task1", 7345),
            new TaskContainer("task2", 123),
            new TaskContainer("task3", 3600)
        ];
        this.state = {
            time: 0,
            tasks: defaultTasks,
            addTask: false,
        };

        this.addTask = this.addTask.bind(this);
        this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
        this.handleNewTaskHoursChange = this.handleNewTaskHoursChange.bind(this);
        this.handleNewTaskMinsChange = this.handleNewTaskMinsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.taskOnClick = this.taskOnClick.bind(this);
        this.taskUp = this.taskUp.bind(this);
        this.taskDown = this.taskDown.bind(this);
        this.startTask = this.startTask.bind(this);
        this.addTime = this.addTime.bind(this);
    }

    //update all the tasks which are started
    tick() {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].started && !updatedTasks[i].paused) {
                updatedTasks[i].remainingTime--;
                if(updatedTasks[i].remainingTime <= 0)
                {
                    updatedTasks[i].remainingTime = 0;
                    updatedTasks[i].started = false;
                    updatedTasks[i].isViewing = true;
                    alert(updatedTasks[i].name+" finished");
                }
            }
        }

        this.setState(state => ({
            tasks: updatedTasks,
            time: state.time + 1,
        }));
    }

    //display the add task inputs
    addTask() {
        this.setState(state => ({
            addTask: !state.addTask,
        }));
    }

    //interval for the tick method
    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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
        if (!this.state.newTaskName.length || !this.state.newTaskHours || !this.state.newTaskHours) return;
        if(isNaN(this.state.newTaskHours) || isNaN(this.state.newTaskMins)) return;
        if(this.state.newTaskHours < 0 || this.state.newTaskMins < 0) return;

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
        //save newTask
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
                
                if((i-1) < 0) return;//already in first place
                
                //swap
                let tempTask = updatedTasks[i];
                updatedTasks[i] = updatedTasks[i-1];
                updatedTasks[i-1] = tempTask;
                
                break;
            }
        }

        this.setState({
            tasks: updatedTasks
        });
    }

    //move the selected task down in the UI and nearer to the end in the list
    taskDown(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                
                if((i+1) >= updatedTasks.length) return;//already in last place
                
                //swap
                let tempTask = updatedTasks[i];
                updatedTasks[i] = updatedTasks[i+1];
                updatedTasks[i+1] = tempTask;
                
                break;
            }
        }

        this.setState({
            tasks: updatedTasks
        });
    }

    startTask(id) {
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {

                if(updatedTasks[i].started)
                {
                    updatedTasks[i].paused = !updatedTasks[i].paused;
                }

                updatedTasks[i].started = true;
                break;
            }
        }

        this.setState({
            tasks: updatedTasks
        });
    }

    addTime(id){
        const updatedTasks = this.state.tasks.slice();
        for (let i = 0; i < updatedTasks.length; i++) {
            if (updatedTasks[i].id === id) {
                let additionalTime = Number(updatedTasks[i].totalDuration / 2);

                updatedTasks[i].remainingTime = Number(updatedTasks[i].remainingTime) + Number(additionalTime);
                break;
            }
        }

        this.setState({
            tasks: updatedTasks
        });
    }

    render() {
        let addTask;

        if (this.state.addTask) {
            //display the inputs
            addTask = (
                <form onSubmit={this.handleSubmit}>
                    <h1>New Task</h1>
                    
                    <label htmlFor="task-name-input">
                        Task name:
                    </label>
                    <input
                        id="task-name-input"
                        onChange={this.handleNewTaskNameChange}
                        value={this.state.newTaskName}
                    />

                    <label htmlFor="task-hours-input">
                        Task hours:
                    </label>
                    <input
                        id="task-hours-input"
                        onChange={this.handleNewTaskHoursChange}
                        value={this.state.newTaskHours}
                    />

                    <label htmlFor="task-mins-input">
                        Task mins:
                    </label>
                    <input
                        id="task-mins-input"
                        onChange={this.handleNewTaskMinsChange}
                        value={this.state.newTaskMins}
                    />

                    <button>
                        Add New Task
                    </button>
                </form>
            );
        }

        return (
            <div className="taskController">
                <HoursOverlay
                    tasks={this.state.tasks}
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
                        addTime={this.addTime}
                    />))}
                </div>
                <button className="addTaskButton" onClick={this.addTask}>Add task</button>
                {addTask}
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <TaskController />,
    document.getElementById('root')
);  