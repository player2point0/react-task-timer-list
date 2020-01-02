import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TaskContainer from './task.js';

const HOUR_HEIGHT = 30;
const MIN_TASK_HEIGHT = 20;

//renders the task based on the passed properties
//could change to a function
class Task extends React.Component {

    render() {
        let THIS_SCOPE = this;
        
        //could resize the task body to fit the task viewing div and not mess up the hours overlay
        let taskViewing;
        const HOUR_IN_SECONDS = 60 * 60;
        let taskHeightPer = (this.props.duration/HOUR_IN_SECONDS)<0.5 ? 0.5 : (this.props.duration/HOUR_IN_SECONDS);
        let taskHeight = (taskHeightPer * HOUR_HEIGHT)<MIN_TASK_HEIGHT? MIN_TASK_HEIGHT : (taskHeightPer * HOUR_HEIGHT);

        let startButtonText = this.props.paused? "un pause" : "pause";
        if(!this.props.started) startButtonText = "start";

        //display additional details when the task is selected
        if (this.props.isViewing) {
            taskHeight += 50;//expands the task by 50vh to display the buttons, could add a max/min height

            taskViewing = (
                <div className="taskViewing">
                    <button className="taskViewingButton" onClick={
                        function(e){
                            e.stopPropagation();
                            THIS_SCOPE.props.startTask(THIS_SCOPE.props.id);
                        }}>{startButtonText}</button>
                    <button className="taskViewingButton" onClick={
                        function(e){
                            e.stopPropagation();
                            THIS_SCOPE.props.finishTask(THIS_SCOPE.props.id);
                        }}>finish</button>
                    <button className="taskViewingButton" onClick={
                        function(e){
                            e.stopPropagation();
                            THIS_SCOPE.props.addTime(THIS_SCOPE.props.id);
                        }}>add time</button>
                </div>
            );
        }
        
        let coverHeight = taskHeight * ((this.props.duration - this.props.remainingTime) / this.props.duration);      

        return (
            <div className="task"  
                onClick={(e) => { this.props.taskOnClick(this.props.id, e)}}
                style={{height:taskHeight+"vh"}}>
                <div className="taskBackground" 
                    style={{height:taskHeight+"vh"}}></div>
                <div className="taskBody">
                    <div className="taskViewingCover"
                        style={{height:coverHeight+"vh"}}>
                    </div>
                    <div className="taskUpDownButtons">
                        <button className="taskUpButton" onClick={
                            function(e){
                                e.stopPropagation();
                                THIS_SCOPE.props.taskUp(THIS_SCOPE.props.id);
                            }}
                        >up</button>
                        <button className="taskDownButton" onClick={
                            function(e){
                                e.stopPropagation();
                                THIS_SCOPE.props.taskDown(THIS_SCOPE.props.id);
                            }}
                        >down</button>
                    </div>
                    <div className="taskSelectButton">
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
        if(mins<10) mins = "0"+mins;
        let hourBar = <h1 style={{height:heightPer*HOUR_HEIGHT+"vh"}}>{currentHour+":"+mins}</h1>;
        hourBars.push(hourBar); 

        for(let i = 1;i<12;i++)
        {
            currentTime.setUTCHours(currentHour + i)
            let hour = currentTime.getUTCHours();
            let hourBar = <h1 style={{height:HOUR_HEIGHT+"vh"}}>{hour+":00"}</h1>;
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
    let hours = String(Math.floor(time / 3600));
    let mins = String(Math.floor((time - (hours * 3600)) / 60));
    let seconds  = String(Math.floor((time - (hours * 3600) - (mins * 60))));
    
    if(hours.length < 2) hours = "0"+hours;
    if(mins.length < 2) mins = "0"+mins;
    if(seconds.length < 2) seconds = "0"+seconds;

    return hours+":"+mins+":"+seconds;
}

class TaskController extends React.Component {
    constructor(props) {
        super(props);
        //store the tasks
        let defaultTasks = [
            new TaskContainer("task1", 60),
            //new TaskContainer("task2", 123),
            //new TaskContainer("task3", 3600)
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
        this.finishTask = this.finishTask.bind(this);
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
                    updatedTasks[i].isViewing = true;
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
        for (let i = updatedTasks.length-1; i >= 0; i--) {
            if (updatedTasks[i].id === id) {

                if(updatedTasks[i].started)
                {
                    if(updatedTasks[i].remainingTime == 0)
                    {
                        updatedTasks.splice(i, 1);
                        break;
                    }

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

    finishTask(id){
        const updatedTasks = this.state.tasks.slice();
        for (let i = updatedTasks.length-1; i >= 0; i--) {
            if (updatedTasks[i].id === id) {
                updatedTasks.splice(i, 1);
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
                <form className="addTaskForm" onSubmit={this.handleSubmit}>
                    <div className="taskInput">
                        <label htmlFor="task-name-input">
                            task name:
                        </label>
                        <input
                            id="task-name-input"
                            onChange={this.handleNewTaskNameChange}
                            value={this.state.newTaskName}
                        />
                    </div>
                    <div className="taskInput">
                        <label htmlFor="task-hours-input">
                            task hours:
                        </label>
                        <input
                            id="task-hours-input"
                            onChange={this.handleNewTaskHoursChange}
                            value={this.state.newTaskHours}
                        />
                    </div>
                    <div className="taskInput">
                        <label htmlFor="task-mins-input">
                            task mins:
                        </label>
                        <input
                            id="task-mins-input"
                            onChange={this.handleNewTaskMinsChange}
                            value={this.state.newTaskMins}
                        />
                    </div>
                    <div className="taskInput">    
                        <button>
                            add new task
                        </button>
                    </div>
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
                        finishTask={this.finishTask}
                        addTime={this.addTime}
                    />))}
                </div>
                <div className="addTaskButton" onClick={this.addTask}>
                    <h1>add task</h1>
                </div>
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