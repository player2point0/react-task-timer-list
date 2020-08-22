import React from "react";
import TaskNotViewing from "./NotViewing/TaskNotViewing";
import FlowReport from "./FlowReport/FlowReport";
import TaskViewing from "./Viewing/TaskViewing";

//renders the task based on the passed properties
export default function Task({isViewing, name, remainingTime, id, taskOnClick,
                             reportFlowFlag, finished, reportFlow, paused}) {
    if (!isViewing) {
        return (<TaskNotViewing
            name={name}
            remainingTime={remainingTime}
            id={id}
            taskOnClick={taskOnClick}
        />);
    }

    if (reportFlowFlag) {
        if (finished) {
            return <FlowReport
                onDone={reportFlow}
                id={id}
            />;
        }

        if (paused) {
            return <FlowReport
                onDone={reportFlow}
                id={id}
            />;
        }
    }

    return <TaskViewing
        id={this.props.id}
        paused={this.props.paused}
        remainingTime={this.props.remainingTime}
        name={this.props.name}
        started={this.props.started}
        objectives={this.props.objectives}
        completeObjective={this.props.completeObjective}
        startTask={this.props.startTask}
        setReportFlow={this.props.setReportFlow}
        finishTask={this.props.finishTask}
        addTime={this.props.addTime}
        taskOnClick={this.props.taskOnClick}
        addObjective={this.props.addObjective}
    />;
}