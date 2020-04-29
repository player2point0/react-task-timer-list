import React from 'react';
import {XYPlot, ArcSeries, LabelSeries, XAxis, YAxis} from 'react-vis';


export default class Stats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            centerText: ""
        };
    }

    calcAngle(val) {
        let date = new Date(val);
        let minutes = (date.getHours() * 60) + date.getMinutes();

        //2PI = 24*60
        return minutes / (24.0 * 60.0) * (Math.PI * 2);
    };

    render() {
        if (this.props.dayStats === null) return <h1>no stats</h1>;

        const spacing = (Math.PI * 2) / 24;
        const graphWidth = window.screen.availWidth * 0.7;
        const graphHeight = window.screen.availHeight * 0.75;
        let taskData = [];
        let hourData = [];
        let hourLabelData = [
            {x: 0, y: 0, label: this.state.centerText}
        ];

        for (let i = 0; i < this.props.dayStats.tasks.length; i++) {

            //todo add different colors for tasks
            for(let j = 0;j<this.props.dayStats.tasks[i].start.length;j++){

                let newData = {
                    angle0: this.calcAngle(this.props.dayStats.tasks[i].start[j]),
                    angle: this.calcAngle(this.props.dayStats.tasks[i].stop[j]),
                    radius: 5,
                    radius0: 2,
                    name: this.props.dayStats.tasks[i].name,
                };

                taskData.push(newData);
            }
        }

        for (let j = 1; j <= 24; j++) {

            let hourText = j-1;
            if(hourText<10) hourText = "0"+hourText;

            let hour = {
                angle0: (j - 1) * spacing,
                angle: j * spacing,
                radius: 4,
                radius0: 2,
                name: hourText+":00"
            };

            hourData.push(hour);
        }

        return (
            <React.Fragment>
                <h2>{this.props.dayStats.date}</h2>
                <XYPlot
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
                        animation
                        data={taskData}
                        onValueMouseOver={(datapoint)=>{
                            this.setState(state => ({
                                centerText: datapoint.name
                            }));
                        }}
                        onValueMouseOut={()=>{
                            this.setState(state => ({
                                centerText: ""
                            }));
                        }}
                    />
                    <ArcSeries
                        color={'rgb(240, 84, 23)'}
                        animation
                        data={hourData}
                        onValueMouseOver={(datapoint)=>{
                            this.setState(state => ({
                                centerText: datapoint.name
                            }));
                        }}
                        onValueMouseOut={()=>{
                            this.setState(state => ({
                                centerText: ""
                            }));
                        }}
                    />
                    <LabelSeries
                        xDomain={[-5, 5]}
                        yDomain={[-5, 5]}
                        animation
                        labelAnchorX={"middle"}
                        labelAnchorY={"middle"}
                        data={hourLabelData}
                        style={{fontSize: "var(--small-text-size)"}}
                    />
                </XYPlot>
            </React.Fragment>
        );
    }
}