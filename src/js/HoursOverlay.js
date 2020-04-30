import React from "react";
import "../css/hourCover.css";

const HOUR_HEIGHT = 30;

//renders the hours overlay
class HoursOverlay extends React.Component {
	render() {
		//could adjust the height of the bars based on an viewed tasks
		//check if any tasks are viewed and if so don't display the overlay
		for (let i = 0; i < this.props.tasks.length; i++) {
			if (this.props.tasks[i].isViewing) {
				return <div className="hourCover"></div>;
			}
		}

		//draw hour bars for the next 12 hours
		let hourBars = [];
		let currentTime = new Date();
		let currentHour = currentTime.getHours();

		//draw the first bar smaller based on the remaining time in the hour
		let mins = currentTime.getMinutes();
		let heightPer = 1 - mins / 60.0;
		if (mins < 10) mins = "0" + mins;
		let hourBar = (
			<h1
				style={{ height: heightPer * HOUR_HEIGHT + "vh" }}
				key={currentHour + ":" + mins}
			>
				{currentHour + ":" + mins}
			</h1>
		);
		hourBars.push(hourBar);

		for (let i = 1; i < 12; i++) {
			currentTime.setUTCHours(currentHour + i);
			let hour = currentTime.getHours().toString();
			if (hour < 10) hour = "0" + hour;
			let hourBar = (
				<h1
					style={{ height: HOUR_HEIGHT + "vh" }}
					key={hour}
				>
					{hour + ":00"}
				</h1>
			);
			hourBars.push(hourBar);
		}

		return <div className="hourCover">{hourBars}</div>;
	}
}

export default HoursOverlay;
