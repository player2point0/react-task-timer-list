import React from "react";
import { formatTime } from "../js/Ultility.js";

export default class Pomodoro extends React.Component {
	render() {
		return (
			<React.Fragment>
				<h3>work time {formatTime(this.props.workTimeRemaining)}</h3>
				<h3>break time {formatTime(this.props.breakTimeRemaining)}</h3>
				<h2 onClick={this.props.resetPomodoro}>reset</h2>
			</React.Fragment>
		);
	}
}
