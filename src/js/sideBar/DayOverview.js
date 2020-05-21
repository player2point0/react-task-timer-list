import React from 'react';
import {formatTime, padNumWithZero} from "../Ultility";

export default class DayOverview extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let finishTime = new Date();
        let finishHour;
        let finishMinute;
        let totalPlanned = 0;
        let totalWork = 0;
        let totalBreak = 0;

        for (let i = 0; i < this.props.tasks.length; i++) {
            totalPlanned += this.props.tasks[i].remainingTime;
        }

        finishTime.setTime(finishTime.getTime() + totalPlanned * 1000);

        finishHour = padNumWithZero(finishTime.getHours());
        finishMinute = padNumWithZero(finishTime.getMinutes());

        if(this.props.dayStats.totalWorked){
            totalWork = this.props.dayStats.totalWorked;
        }

        if(this.props.dayStats.totalBreak){
            totalBreak = this.props.dayStats.totalBreak;
        }

        return (
            <React.Fragment>
                <div className={"sideBarElementText"}>total work {formatTime(totalWork)}</div>
                <div className={"sideBarElementText"}>total break {formatTime(totalBreak)}</div>
                <div className={"sideBarElementText"}>total planned {formatTime(totalPlanned)}</div>
                <div className={"sideBarElementText"}>finish time {finishHour + ":" + finishMinute}</div>
            </React.Fragment>
        );
    }
}