import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TaskContainer from './task.js';

//renders the task based on the passed properties
//could change to a function
class Task extends React.Component {

    render() {

        let taskViewing;

        //display additional details when the task is selected
        if(this.props.isViewing)
        {
            taskViewing = <h1> {this.props.id}</h1>;
        }
        
        return (
            <div className="Task">
                <h1>{this.props.name}</h1>
                <h1>{this.props.duration}</h1>
                <button onClick={() => {this.props.taskOnClick(this.props.id)}}>view task</button>
                {taskViewing}
            </div>
        );
    }
}

class TaskController extends React.Component {
    constructor(props) {
        super(props);
        //store the tasks
        let defaultTasks = [new TaskContainer("task1", 1234), new TaskContainer("task2", 4321)];
        this.state = {
            time: 0,
            tasks: defaultTasks,
            addTask: false,
        };

        this.addTask = this.addTask.bind(this);
        this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
        this.handleNewTaskDurationChange = this.handleNewTaskDurationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.taskOnClick = this.taskOnClick.bind(this);
    }
    
    //update all the tasks which are started
    tick() {
        this.setState(state => ({
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
    handleNewTaskDurationChange(e) {
        this.setState({ newTaskDuration: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.newTaskName.length || !this.state.newTaskDuration) {
            return;
        }

        let newTask = new TaskContainer(
            this.state.newTaskName,
            this.state.newTaskDuration
        );

        this.setState(state => ({
            tasks: state.tasks.concat(newTask),
            addTask: false,
        }));

        //clear the inputs
        //save newTask
    }

    //display the selected task
    taskOnClick(id){
        const updatedTasks = this.state.tasks.slice();
        for(let i = 0;i<updatedTasks.length;i++)
        {
            if(updatedTasks[i].id === id)
            {
                updatedTasks[i].isViewing = !updatedTasks[i].isViewing;
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
                    <label htmlFor="task-duration-input">
                        Task Name:
                    </label>
                    <input
                        id="task-duration-input"
                        onChange={this.handleNewTaskDurationChange}
                        value={this.state.newTaskDuration}
                    />
                    <label htmlFor="task-name-input">
                        Task duration:
                    </label>
                    <input
                        id="task-name-input"
                        onChange={this.handleNewTaskNameChange}
                        value={this.state.newTaskName}
                    />
                    <button>
                        Add New Task
                    </button>
                </form>
            );
        }

        return (
            <div className="taskController">
                <h1>Time {this.state.time}</h1>
                {this.state.tasks.map(task => ( <Task
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    duration={task.duration}
                    isViewing={task.isViewing}
                    taskOnClick={this.taskOnClick}
                />))}
                <button onClick={this.addTask}>Add task</button>
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