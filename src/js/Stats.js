import React from 'react';
import {XYPlot, ArcSeries, LabelSeries} from 'react-vis';


export default class Stats extends React.Component {

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
        let hourLabelData = [];

        for (let i = 0; i < this.props.dayStats.tasks.length; i++) {

            //todo add different colors for tasks
            for(let j = 0;j<this.props.dayStats.tasks[i].start.length;j++){

                let newData = {
                    angle0: this.calcAngle(this.props.dayStats.tasks[i].start[j]),
                    angle: this.calcAngle(this.props.dayStats.tasks[i].stop[j]),
                    radius: 5,
                    radius0: 2,
                };

                taskData.push(newData);
            }
        }

        for (let j = 1; j <= 24; j++) {

            let hour = {
                angle0: (j - 1) * spacing,
                angle: j * spacing,
                radius: 4,
                radius0: 2,
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
                    <LabelSeries
                        animation
                        allowOffsetToBeReversed
                        data={hourLabelData} />
                    <ArcSeries
                        color={'#0FA3B1'}
                        animation
                        data={taskData}
                    />
                    <ArcSeries
                        color={'rgb(240, 84, 23)'}
                        animation
                        data={hourData}
                    />
                </XYPlot>
            </React.Fragment>
        );
    }
}