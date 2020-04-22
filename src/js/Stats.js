import React from 'react';

export default class Stats extends React.Component {

    render() {
        if (this.props.dayStats === null) return <h1>no stats</h1>;

        let startTimes = Object.keys(this.props.dayStats.startPoints);
        let endTimes = Object.keys(this.props.dayStats.startPoints);
        let i = 0;
        let data = [];

        for (let j = 1; j <= 25;j++) {
            let spacing = (Math.PI * 2) / 24;

            let hour = {
                angle: (j-1)*spacing,
                angele0: j * spacing,
                radius: 10,
                radius0: 1,
                stroke: 1,
                color: i,
            };

            data.push(hour);
        }

        console.log(data);


        let calcAngle = function (val) {
            let date = new Date(val);
            let minutes = (date.getHours() * 60) + date.getMinutes();

            //2PI = 24*60

            return minutes / (24.0 * 60.0);
        };
/*
        while (i < startTimes.length && i < endTimes.length) {
            let newData = {
                angle: calcAngle(startTimes[i]),
                angele0: 10 * calcAngle(endTimes[i]),
                radius: 2,
                radius0: 1
            };

            data.push(newData);

            i++;
        }
*/
        return (
            <h1>graph</h1>
        );
    }
}