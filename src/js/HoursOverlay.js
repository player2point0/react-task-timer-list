import React from "react";
import "../css/hourCover.css";
import {padNumWithZero} from "./Ultility";

const HOUR_HEIGHT = 30;

function HourBar(props) {

	//todo change the line to a dashed one
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


//renders the hours overlay
class HoursOverlay extends React.Component {
    render() {
        //could adjust the height of the bars based on an viewed tasks
        //check if any tasks are viewed and if so don't display the overlay
        for (let i = 0; i < this.props.tasks.length; i++) {
            if (this.props.tasks[i].isViewing) {
                return <div className="hourCover"/>;
            }
        }

        //draw hour bars for the next 12 hours
        let hourBars = [];
        let currentTime = new Date();
        let currentHour = currentTime.getHours();
        let currentHourFormatted = padNumWithZero(currentHour);

        //draw the first bar smaller based on the remaining time in the hour
        let mins = currentTime.getMinutes();
        let heightPer = 1 - mins / 60.0;
        mins = padNumWithZero(mins);

        hourBars.push(<HourBar
            heightPer={heightPer}
            hour={currentHourFormatted}
            mins={mins}
        />);

        for (let i = 1; i < 12; i++) {
            currentTime.setHours(currentHour + i);
            let hour = padNumWithZero(currentTime.getHours().toString());
            hourBars.push(<HourBar
                heightPer={1}
                hour={hour}
                mins={"00"}

            />);
        }

        return <div className="hourCover">{hourBars}</div>;
    }
}

export default HoursOverlay;