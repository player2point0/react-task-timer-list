import React from "react";
import TaskNotViewing from "./NotViewing/TaskNotViewing";
import FlowReport from "./FlowReport/FlowReport";
import TaskViewing from "./Viewing/TaskViewing";

//renders the task based on the passed properties
export default function Task({isViewing, name, remainingTime, id,
                             reportFlowFlag, finished, reportFlow, paused,
                             started, objectives, startTask}) {
    if (!isViewing) {
        return (<TaskNotViewing
            name={name}
            remainingTime={remainingTime}
            id={id}
        />);
    }

    if (reportFlowFlag) {
        //todo check this
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
        id={id}
        paused={paused}
        remainingTime={remainingTime}
        name={name}
        started={started}
        objectives={objectives}
        startTask={startTask}
    />;
}