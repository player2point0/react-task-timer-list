import React from "react";
import { formatTime } from "./Ultility.js";

export default class Pomodoro extends React.Component {
	render() {
		return (
			<div>
				<h3>work time {formatTime(this.props.workTimeRemaining)}</h3>
				<h3>break time {formatTime(this.props.breakTimeRemaining)}</h3>
			</div>
		);
	}
}
