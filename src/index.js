import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Task extends React.Component {

    render() {
        return (
            <h1>{this.props.name}</h1>
        );
    }
}

class TaskController extends React.Component {
    constructor(props) {
        super(props);
        //store the tasks 
        this.state = {
            time: 0,
            tasks: ["task1", "task2"],
            addTask: false,
        };

        this.addTask = this.addTask.bind(this);    
        this.handleNewTaskNameChange = this.handleNewTaskNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    tick() {
        //update all the tasks which are started
        this.setState(state => ({
            time: state.time + 1,
        }));
    }

    addTask() {
        if (this.addTask) {
            //save our new task
        }

        this.setState(state => ({
            addTask: !state.addTask,
        }));

        console.log(this.state.addTask);
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleNewTaskNameChange(e) {
        this.setState({ newTaskName: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.newTaskName.length) {
            return;
        }

        this.setState(state => ({
            tasks: state.tasks.concat(state.newTaskName),
        }));
    }

    render() {
        let addTask;

        if (this.state.addTask) {
            //display the inputs
            addTask = (
                <form onSubmit={this.handleSubmit}>
                    <h1>New Task</h1>
                    <label htmlFor="task-name-input">
                        Task Name:
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
                {this.state.tasks.map(task => (
                    <Task name={task} />
                ))}
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