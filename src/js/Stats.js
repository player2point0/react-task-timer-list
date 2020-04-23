import React from 'react';
import {XYPlot, ArcSeries, XAxis, YAxis} from 'react-vis';


export default class Stats extends React.Component {

    render() {
        if (this.props.dayStats === null) return <h1>no stats</h1>;

        const spacing = (Math.PI * 2) / 24;

        let startTimes = Object.keys(this.props.dayStats.startPoints);
        let endTimes = Object.keys(this.props.dayStats.startPoints);
        let i = 0;
        let data = [];

        for (let j = 1; j <= 24;j++) {

            let hour = {
                angle0: (j-1)*spacing,
                angle: j * spacing,
                radius: 1,
                radius0: 0,
                stroke: 1,
                color: 1,
            };

            data.push(hour);
        }

        let calcAngle = function (val) {
            let date = new Date(val);
            let minutes = (date.getHours() * 60) + date.getMinutes();

            //2PI = 24*60
            return minutes / (24.0 * 60.0) * (Math.PI * 2);
        };

        while (i < startTimes.length && i < endTimes.length) {
            let newData = {
                angle0: calcAngle(startTimes[i]),
                angle: calcAngle(endTimes[i]),
                radius: 1.5,
                radius0: 0,
                color: 0,
                stroke: 0.1,
            };

            data.push(newData);

            i++;
        }

        const COLORS = ['red', 'white'];

        return (
            <XYPlot
                colorRange={COLORS}
                xDomain={[-5, 5]}
                yDomain={[-5, 5]}
                width={600}
                height={600}
                style={{border:"1px solid red"}}
            >
                <XAxis />
                <YAxis />
                <ArcSeries
                    animation
                    data={data}
                />
            </XYPlot>
        );
    }
}