import React from 'react';
import {XYPlot, ArcSeries} from 'react-vis';

export default class WeekStats extends React.Component {

    calcAngle(val) {
        let date = new Date(val);
        let minutes = (date.getHours() * 60) + date.getMinutes();

        //2PI = 24*60
        return (minutes / (24.0 * 60.0)) * (Math.PI * 2);
    };

    render() {
        const spacing = (Math.PI * 2) / 24;
        const graphWidth = window.screen.availWidth * 0.7;
        const graphHeight = window.screen.availHeight * 0.7;

        const numIntervals = 24*15;
        const angleIntervalAmount = (Math.PI * 2) / numIntervals;
        let angleIntervals = [];
        let maxCount = 1;

        //todo investigate bug where array is populated before it is in the code
        //console.log(angleIntervals);

        for (let i = 0; i < numIntervals; i++) {
            let tempAngleInterval = {
                start: i * angleIntervalAmount,
                end: (i + 1) * angleIntervalAmount,
                count: 0,
            };

            angleIntervals.push(tempAngleInterval);
        }

        let taskData = [];

        //go through each each day and tally up the times for each 15 minute window
        for (let k = 0; k < numIntervals; k++) {

            for (let h = 0; h < this.props.weekDayStats.length; h++) {
                const currentDayStat = this.props.weekDayStats[h];

                if (!currentDayStat.hasOwnProperty("tasks")) continue;

                for (let i = 0; i < currentDayStat.tasks.length; i++) {

                    for (let j = 0; j < currentDayStat.tasks[i].start.length; j++) {
                        let angle0 = this.calcAngle(currentDayStat.tasks[i].start[j]);
                        let angle = this.calcAngle(currentDayStat.tasks[i].stop[j]);

                        if(angle0 >= angleIntervals[k].start && angle <= angleIntervals[k].end){
                            //both inside interval
                            angleIntervals[k].count++;

                            if(angleIntervals[k] > maxCount) maxCount = angleIntervals[k];

                            break;
                        }
                        else if(angle0 <= angleIntervals[k].end){
                            //angle0 inside interval
                            angleIntervals[k].count++;

                            if(angleIntervals[k].count > maxCount) maxCount = angleIntervals[k].count;

                            break;
                        }
                        else if(angle <= angleIntervals[k].end){
                            //angle inside interval
                            angleIntervals[k].count++;

                            if(angleIntervals[k].count > maxCount) maxCount = angleIntervals[k].count;

                            break;
                        }
                        else if(angle0 < angleIntervals[k].start && angle > angleIntervals[k].end){
                            //task is longer than interval
                            angleIntervals[k].count++;

                            if(angleIntervals[k].count > maxCount) maxCount = angleIntervals[k].count;

                            break;
                        }
                    }
                }
            }
        }

        console.log(maxCount)

        for (let i = 0; i < numIntervals; i++) {

            let newData = {
                angle0: angleIntervals[i].start,
                angle: angleIntervals[i].end,
                radius: ((angleIntervals[i].count / maxCount) * 3) + 3,
                radius0: 3,
            };

            taskData.push(newData);
        }

        let hourData = [];

        for (let j = 1; j <= 24; j++) {
            let hourText = j - 1;
            if (hourText < 10) hourText = "0" + hourText;

            let hour = {
                angle0: (j - 1) * spacing,
                angle: j * spacing,
                radius: 3.5,
                radius0: 1,
                name: hourText + ":00"
            };

            hourData.push(hour);
        }

        return (
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
                    data={taskData}
                />
                <ArcSeries
                    color={'rgb(240, 84, 23)'}
                    data={hourData}
                />
            </XYPlot>
        );
    }
}