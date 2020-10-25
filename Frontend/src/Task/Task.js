import React from "react";
import TaskNotViewing from "./NotViewing/TaskNotViewing";
import FlowReport from "./FlowReport/FlowReport";
import TaskViewing from "./Viewing/TaskViewing";

//renders the task based on the passed properties
export default function Task({name, remainingTime, id,
                             reportFlowFlag, finished, reportFlow, paused,
                             started, objectives, startTask}) {

    if (reportFlowFlag && (finished || paused)) {
        return <FlowReport
            onDone={reportFlow}
            id={id}
        />;
    }

    if ((started && paused) || (!started && !paused)) {
        return (<TaskNotViewing
            name={name}
            remainingTime={remainingTime}
            id={id}
            startTask={startTask}
        />);
    }

    return <TaskViewing
        id={id}
        remainingTime={remainingTime}
        name={name}
        objectives={objectives}
        startTask={startTask}
    />;
}