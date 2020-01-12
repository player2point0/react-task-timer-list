import React from 'react';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default class Pomodoro extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            startedWork: false,
            startedBreak: false,
            workTimeRemaining: WORK_TIME,
            breakTimeRemaining: BREAK_TIME, 
        };

        this.interval = setInterval(() => this.tick(), 1000);
    }

    tick() {
        let activeTask = false;
        const tempTasks = this.props.tasks;
        
        //check for an active task
        for(let i = 0; i < tempTasks.length; i++) {
            //check for a running task
            if(tempTasks[i].started && !tempTasks[i].paused){
                activeTask = true;
                break;
            }
        }

        //nothing to do - afk
        if(!activeTask) return;

        //if not started and have an active task
        //then start the work time or the break timer
        if(!this.state.startedWork){
            this.setState(state => ({
                startedWork: true,
                startedBreak: false,
                workTimeRemaining: WORK_TIME        
            }));
        }

        //perform the ticks and other logic
        else{
            if(this.state.workTimeRemaining > 0){
                this.setState(state => ({
                    workTimeRemaining: this.state.workTimeRemaining - 1
                }));
            }

            else{

                if(!this.state.startedBreak){
                    //call callback to show notification

                    this.setState(state => ({
                        startedBreak: true,
                        breakTimeRemaining: BREAK_TIME
                    }));
                }

                else if(this.state.breakTimeRemaining > 0){
                    this.setState(state => ({
                        workTimeRemaining: this.state.workTimeRemaining - 1
                    }));
                }

                //break finished
                else{
                    //call other callback to show notification
                    
                    this.setState(state => ({
                        startedWork: false,
                        startedBreak: false,    
                        //workTimeRemaining: WORK_TIME,
                        //breakTimeRemaining: BREAK_TIME,
                    }));
                }
            }
        }
    }

    formatTime(time){
        let mins = String(Math.floor((time) / 60));
        let seconds  = String(Math.floor((time - (mins * 60))));
        
        if(mins.length < 2) mins = "0"+mins;
        if(seconds.length < 2) seconds = "0"+seconds;
    
        return mins+":"+seconds;
    }

    render() {





        return (
            <div>
                <h2>time</h2>
                <h2>work time {this.formatTime(this.state.workTimeRemaining)}</h2>
                <h2>break time {this.formatTime(this.state.breakTimeRemaining)}</h2>
            </div>
        );
    }
}