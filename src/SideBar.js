import React from 'react';
import Pomodoro from './Pomodoro.js';
import {formatTime, getDateStr} from './Ultility.js'

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false,
            showStats: false,
            showSettings: false,
            showPomodoro: false,
            pomodoro: {
                startedWork: false,
                startedBreak: false,
                workTimeRemaining: WORK_TIME,
                breakTimeRemaining: BREAK_TIME, 
            },
        };

        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.toggleStats = this.toggleStats.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.togglePomodoro = this.togglePomodoro.bind(this);

        this.interval = setInterval(() => this.pomodoroTick(), 1000);
    }

    toggleSideBar(){
        const currentState = this.state.showSideBar;

        this.setState(state => ({
            showSideBar: !currentState
        }));
    }

    toggleStats(){
        const currentState = this.state.showStats;

        this.setState(state => ({
            showStats: !currentState
        }));
    }

    toggleSettings(){
        const currentState = this.state.showSettings;

        this.setState(state => ({
            showSettings: !currentState
        }));
    }

    togglePomodoro(){
        const currentState = this.state.showPomodoro;

        this.setState(state => ({
            showPomodoro: !currentState
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
                    //call callback to show notification, with stashing of break time
                    
                    //todo test this
                    this.props.sendNotification("Break time started", "click to stash break", ()=>{
                        pomodoro.startedBreak = false;
                        pomodoro.breakTimeRemaining += BREAK_TIME;
                    });


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

    stats(){
        let dateStr = getDateStr();

        let savedStats = JSON.parse(localStorage.getItem(dateStr));
        let totalTimeWorked = 0;
        let totalAdditionalTime = 0;

        if(savedStats == null) savedStats = [];

        for(let i = 0;i<savedStats.length;i++){
            totalTimeWorked += savedStats[i].totalDuration;
            totalAdditionalTime += savedStats[i].stats.timeAdded;
        }
        
        return (
            <div>
                <h3>worked : {formatTime(totalTimeWorked)}</h3>
                <h3>additional : {formatTime(totalAdditionalTime)}</h3>
            </div>
        );
    }

    render() {

        if(!this.state.showSideBar)
        {
            return(
                <h1 className="showSideBar" onClick={this.toggleSideBar}>
                    s<br></br>
                    i<br></br>
                    d<br></br>
                    e<br></br>
                    b<br></br>
                    a<br></br>
                    r</h1>
            );
        }

        let statsHTML;
        let settingsHTML;
        let pomodoroHTML;

        if(this.state.showStats){
            statsHTML = this.stats();
        }

        if(this.state.showSettings){
            settingsHTML = "settings html";
        }

        if(this.state.showPomodoro){
            pomodoroHTML = <Pomodoro
            workTimeRemaining={this.state.pomodoro.workTimeRemaining}
            breakTimeRemaining={this.state.pomodoro.breakTimeRemaining}
        />;
        }

        
        return(
            <div className="sideBarContainer">
                <div className="sideBar">
                    <h1 className="hideSideBar" onClick={this.toggleSideBar}>sidebar</h1>
                    <h1 onClick={this.toggleStats}>stats</h1>
                    {statsHTML}
                    <h1 onClick={this.togglePomodoro}>pomodoro</h1>
                    {pomodoroHTML}
                </div>
                <div className="closeSideBar" onClick={this.toggleSideBar}>
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