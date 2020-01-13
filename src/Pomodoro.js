import React from 'react';

export default class Pomodoro extends React.Component{
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
                <h2>work time {this.formatTime(this.props.workTimeRemaining)}</h2>
                <h2>break time {this.formatTime(this.props.breakTimeRemaining)}</h2>
            </div>
        );
    }
}