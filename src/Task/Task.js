import React from "react";
import TaskNotViewing from "./NotViewing/TaskNotViewing";
import FlowReport from "./FlowReport/FlowReport";
import TaskViewing from "./Viewing/TaskViewing";

//renders the task based on the passed properties
class Task extends React.Component {
    render() {
        if (!this.props.isViewing) {
            return (<TaskNotViewing
                name={this.props.name}
                remainingTime={this.props.remainingTime}
                id={this.props.id}
                taskOnClick={this.props.taskOnClick}
            />);
        }

        if (this.props.reportFlowFlag) {
            if (this.props.finished) {
                return <FlowReport
                    onDone={this.props.reportFlow}
                    id={this.props.id}
                />;
            }

            if (this.props.paused) {
                return <FlowReport
                    onDone={this.props.reportFlow}
                    id={this.props.id}
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
}

export default Task;