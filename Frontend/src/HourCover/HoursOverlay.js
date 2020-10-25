import React from "react";
import "./hourCover.css";
import {padNumWithZero} from "../Utility/Utility";
import uid from "uid";

const HOUR_HEIGHT = 30;

function HourBar(props) {
	return (
        <div
            className={"hourCoverHour"}
            style={{height: props.heightPer * HOUR_HEIGHT + "vh"}}
            key={props.hour + ":" + props.mins}
        >
            <div className={"line"}/>
            {props.hour + ":" + props.mins}
        </div>
    );
}

//todo test this
//renders the hours overlay
export default function HoursOverlay({startTime, numHours}) {
    //draw hour bars for the next 12 hours
    let hourBars = [];
    let currentTime = startTime;
    let currentHourFormatted = padNumWithZero(currentTime.getHours());
    const timeSpacing = 1;

    //draw the first bar smaller based on the remaining time in the hour
    let mins = currentTime.getMinutes();
    let heightPer = 1 - mins / 60.0;
    mins = padNumWithZero(mins);

    hourBars.push(<HourBar
        key={uid(16)}
        heightPer={heightPer}
        hour={currentHourFormatted}
        mins={mins}
    />);

    for (let i = 1; i < numHours; i+=timeSpacing) {
        currentTime.setHours(currentTime.getHours() + timeSpacing);
        let hour = padNumWithZero(currentTime.getHours().toString());
        hourBars.push(<HourBar
            key={uid(16)}
            heightPer={timeSpacing}
            hour={hour}
            mins={"00"}
        />);
    }

    return <div className="hourCover">{hourBars}</div>;
}