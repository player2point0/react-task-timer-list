import React from 'react';
import './dayRecap.css';
import '../Task/NotViewing/TaskNotViewing';
import uid from 'uid';
import HoursOverlay from '../HourCover/HoursOverlay';
import {groupDayStatTasks} from './DayRecap.util';
import {dateDiffInSeconds} from '../Utility/Utility';

import {
	MIN_TASK_HEIGHT,
	MIN_HOUR_TIME,
	HOUR_HEIGHT,
	HOUR_IN_SECONDS,
} from '../Task/NotViewing/TaskNotViewing';
import {useStoreState} from 'easy-peasy';

export default function DayRecap() {
	const dayStat = useStoreState(state => state.dayStat.dayStat);

	if (!dayStat) return 'no daystats loaded';
	if (dayStat.tasks.length === 0) return 'no daystats loaded';

	const recapTasksAndBreaks = groupDayStatTasks(dayStat.tasks);
	if (recapTasksAndBreaks.length === 0) return 'no tasks';

	return (
		<div>
			<HoursOverlay startTime={new Date(recapTasksAndBreaks[0].startTime)} numHours={12} />
			{recapTasksAndBreaks.map(task => (
				<DayRecapTask
					key={uid(16)}
					startTime={task.startTime}
					stopTime={task.stopTime}
					name={task.name}
				/>
			))}
		</div>
	);
}

//todo refactor this and taskNotViewing as one?
//todo add hidden text overflow like in the normal task
function DayRecapTask({startTime, stopTime, name}) {
	const duration = dateDiffInSeconds(startTime, stopTime);

	let taskHeightPer =
		duration / HOUR_IN_SECONDS < MIN_HOUR_TIME ? MIN_HOUR_TIME : duration / HOUR_IN_SECONDS;
	let taskHeight =
		taskHeightPer * HOUR_HEIGHT < MIN_TASK_HEIGHT ? MIN_TASK_HEIGHT : taskHeightPer * HOUR_HEIGHT;

	const style = !name
		? {
				height: taskHeight + 'vh',
				backgroundColor: 'red',
		  }
		: {
				height: taskHeight + 'vh',
		  };

	return (
		<div id={uid(16)} className="recapTask" style={style}>
			<div className="recapTaskName">{name}</div>
		</div>
	);
}
