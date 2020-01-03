import React from 'react';

const MIN_TASK_HEIGHT = 20;
const HOUR_HEIGHT = 30;

//renders the task based on the passed properties
class Task extends React.Component {

    formatTime(time){
        let hours = String(Math.floor(time / 3600));
        let mins = String(Math.floor((time - (hours * 3600)) / 60));
        let seconds  = String(Math.floor((time - (hours * 3600) - (mins * 60))));
        
        if(hours.length < 2) hours = "0"+hours;
        if(mins.length < 2) mins = "0"+mins;
        if(seconds.length < 2) seconds = "0"+seconds;
    
        return hours+":"+mins+":"+seconds;
    }

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
                        <h1 className="taskTime">{this.formatTime(this.props.remainingTime)}</h1>
                    </div>
                </div>
                {taskViewing}
            </div>
        );
    }
}

export default Task