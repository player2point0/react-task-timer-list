import React from 'react';
import {XYPlot, ArcSeries} from 'react-vis';
import "../../css/DayStats.css";
import {formatTime} from "../Ultility";

export default class DayStats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            centerTextName: "",
            centerTextDuration: "",
            weekDayIndex: 0,
        };

        this.increaseWeekDayIndex = this.increaseWeekDayIndex.bind(this);
        this.decreaseWeekDayIndex = this.decreaseWeekDayIndex.bind(this);
    }

    calcAngle(val) {
        let date = new Date(val);
        let minutes = (date.getHours() * 60) + date.getMinutes();

        //2PI = 24*60
        return minutes / (24.0 * 60.0) * (Math.PI * 2);
    };

    decreaseWeekDayIndex(){
        let newIndex = this.state.weekDayIndex - 1;
        if(newIndex < 0) newIndex = 0;

        this.setState(state => ({
            weekDayIndex: newIndex,
        }));
    }

    increaseWeekDayIndex(){
        let newIndex = this.state.weekDayIndex + 1;
        if(newIndex >= this.props.weekDayStats.length) newIndex = this.props.weekDayStats.length-1;

        this.setState(state => ({
            weekDayIndex: newIndex,
        }));
    }

    render() {
        const currentDayStat = this.props.weekDayStats[this.state.weekDayIndex];

        const spacing = (Math.PI * 2) / 24;
        const graphWidth = window.screen.availWidth * 0.7;
        const graphHeight = window.screen.availHeight * 0.75;
        let taskData = [];
        let hourData = [];
        let totalWorked = 0;
        let availableTaskColors = ["#dafbc0", "#c8f9a0", "#b5f781",
            "#A3F561", "#82c44e", "#62933a", "#416227"];
        let colorMap = {};

        if(currentDayStat !== null && currentDayStat.hasOwnProperty("tasks") && currentDayStat.tasks !== null){
            for (let i = 0; i < currentDayStat.tasks.length; i++) {

                let color = "#A3F561";

                if(colorMap.hasOwnProperty(currentDayStat.tasks[i].name)) {
                    color = colorMap[currentDayStat.tasks[i].name];
                }

                else if(availableTaskColors.length > 0){
                    colorMap[currentDayStat.tasks[i].name] = availableTaskColors.pop();
                    color = colorMap[currentDayStat.tasks[i].name];
                }

                for(let j = 0;j<currentDayStat.tasks[i].start.length;j++){

                    let duration = new Date(currentDayStat.tasks[i].stop[j]) -
                        new Date(currentDayStat.tasks[i].start[j]);
                    duration /= 1000;

                    let angle0 = this.calcAngle(currentDayStat.tasks[i].start[j]);
                    let angle = this.calcAngle(currentDayStat.tasks[i].stop[j]);

                    //angle over rap fix
                    if(angle < angle0){
                        angle = 2*Math.PI;
                    }


                    let newData = {
                        angle0: angle0,
                        angle: angle,
                        radius: 5,
                        radius0: 3,
                        name: currentDayStat.tasks[i].name,
                        duration: formatTime(duration),
                        color: color,
                    };

                    taskData.push(newData);
                }
            }
        }

        for (let j = 1; j <= 24; j++) {

            let hourText = j-1;
            if(hourText<10) hourText = "0"+hourText;

            let hour = {
                angle0: (j - 1) * spacing,
                angle: j * spacing,
                radius: 3.5,
                radius0: 1,
                name: hourText+":00"
            };

            hourData.push(hour);
        }

        if(currentDayStat !== null){
            if(currentDayStat.totalWorked){
                totalWorked = currentDayStat.totalWorked;
            }
        }

        return (
            <div className={"dayStatsContainer"}>
                <div className={"dayStatControls"}>
                    <div className={"sideBarElementText"}>{currentDayStat.date}</div>
                    <div className={"sideBarElementText"}>{formatTime(totalWorked)}</div>
                    <div
                        className={"sideBarElementButton"}
                        onClick={this.increaseWeekDayIndex}
                    >previous</div>
                    <div
                        className={"sideBarElementButton"}
                        onClick={this.decreaseWeekDayIndex}
                    >next</div>
                    <div className={"centerText"}>
                        <div className={"centerTextName"}>{this.state.centerTextName}</div>
                        {!this.state.centerTextDuration ||
                        <div className={"centerTextDuration"}>{this.state.centerTextDuration}</div>}
                    </div>
                </div>
                <XYPlot
                    className={"dayGraph"}
                    radiusDomain={[0, 5]}
                    xDomain={[-5, 5]}
                    yDomain={[-5, 5]}
                    width={graphWidth}
                    height={graphHeight}
                    style={{
                        strokeWidth: 2,
                    }}
                    stroke={'black'}
                    colorType={'literal'}
                >
                    <ArcSeries
                        color={'#0FA3B1'}
                        data={taskData}
                        onValueMouseOver={(datapoint)=>{
                            this.setState(state => ({
                                centerTextName: datapoint.name,
                                centerTextDuration: datapoint.duration,
                            }));
                        }}
                        onValueMouseOut={()=>{
                            this.setState(state => ({
                                centerTextName: "",
                                centerTextDuration: "",
                            }));
                        }}
                    />
                    <ArcSeries
                        color={'rgb(240, 84, 23)'}
                        data={hourData}
                        onValueMouseOver={(datapoint)=>{
                            this.setState(state => ({
                                centerTextName: datapoint.name,
                                centerTextDuration: "",
                            }));
                        }}
                        onValueMouseOut={()=>{
                            this.setState(state => ({
                                centerTextName: "",
                                centerTextDuration: "",
                            }));
                        }}
                    />
                </XYPlot>
            </div>
        );
    }
}