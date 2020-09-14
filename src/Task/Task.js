import React from "react";
import TaskNotViewing from "./NotViewing/TaskNotViewing";
import FlowReport from "./FlowReport/FlowReport";
import TaskViewing from "./Viewing/TaskViewing";

//renders the task based on the passed properties
export default function Task({name, remainingTime, id,
                             reportFlowFlag, finished, reportFlow, paused,
                             started, objectives, startTask}) {
    if (started && paused || (!started && !paused)) {
        return (<TaskNotViewing
            name={name}
            remainingTime={remainingTime}
            id={id}
            startTask={startTask}
        />);
    }

    if (reportFlowFlag && (finished || paused)) {
        //todo check this
        return <FlowReport
            onDone={reportFlow}
            id={id}
        />;
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