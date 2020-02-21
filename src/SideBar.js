import React from 'react';
import Pomodoro from './Pomodoro.js';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            pomodoro: {
                startedWork: false,
                startedBreak: false,
                workTimeRemaining: WORK_TIME,
                breakTimeRemaining: BREAK_TIME, 
            },
        };

        this.showSideBar = this.showSideBar.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);

        this.interval = setInterval(() => this.pomodoroTick(), 1000);
    }

    showSideBar(){
        this.setState(state => ({
            showSideBar: true
        }));
    }

    hideSideBar(){
        this.setState(state => ({
            showSideBar: false
        }));
    }

    pomodoroTick() {
        let activeTask = false;
        const tempTasks = this.props.tasks;
        const pomodoro = this.state.pomodoro;
        
        //check for an active task
        for(let i = 0; i < tempTasks.length; i++) {
            //check for a running task
            if(tempTasks[i].started && !tempTasks[i].paused && tempTasks[i].remainingTime > 0){
                activeTask = true;
                break;
            }
        }

        //nothing to do - afk
        if(!activeTask) return;

        //if not started and have an active task
        //then start the work time or the break timer
        if(!this.state.pomodoro.startedWork){
            pomodoro.startedWork = true;
            pomodoro.workTimeRemaining = WORK_TIME-1;
        }

        //perform the ticks and other logic
        else{
            if(this.state.pomodoro.workTimeRemaining > 0){
                pomodoro.workTimeRemaining = this.state.pomodoro.workTimeRemaining - 1;
            }

            else{

                if(!this.state.pomodoro.startedBreak){
                    //call callback to show notification
                    this.props.sendNotification("Break time started", "");
                    //pause tasks
                    pomodoro.startedBreak = true;
                    pomodoro.breakTimeRemaining = BREAK_TIME-1;
                }

                else if(this.state.pomodoro.breakTimeRemaining > 0){
                    
                    pomodoro.breakTimeRemaining = this.state.pomodoro.breakTimeRemaining - 1;
                }

                //break finished
                else{
                    //call other callback to show notification
                    this.props.sendNotification("Break time finished", "");
                    //unpause tasks?
                    pomodoro.startedWork = false;
                    pomodoro.startedBreak = false;
                    pomodoro.breakTimeRemaining = BREAK_TIME;
                    pomodoro.workTimeRemaining = WORK_TIME;
                }
            }
        }

        this.setState(state => ({
            pomodoro: pomodoro
        }));
    }

    render() {

        if(!this.state.showSideBar)
        {
            return(
                <h1 className="showSideBar" onClick={this.showSideBar}>
                    s<br></br>
                    i<br></br>
                    d<br></br>
                    e<br></br>
                    b<br></br>
                    a<br></br>
                    r</h1>
            );
        }
        
        return(
            <div className="sideBarContainer">
                <div className="sideBar">
                    <h1 className="hideSideBar" onClick={this.hideSideBar}>sidebar</h1>
                    <h1>settings</h1>
                    <h1>stats</h1>
                    <h1>pomodoro</h1>
                    <Pomodoro
                        workTimeRemaining={this.state.pomodoro.workTimeRemaining}
                        breakTimeRemaining={this.state.pomodoro.breakTimeRemaining}
                    />
                </div>
                <div className="closeSideBar" onClick={this.hideSideBar}>
                    <h1>
                        c<br></br>
                        l<br></br>
                        o<br></br>
                        s<br></br>
                        e<br></br>
                    </h1>
                </div>
            </div>
        );
    }
}