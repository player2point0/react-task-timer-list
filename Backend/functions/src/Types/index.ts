export interface Task {
	id: string;
}

export interface DayStat {
	id: string;
	userId: string;
	date: string;
	flow: Array<any>;
	tasks: Array<any>;
}

export interface FlowTime {
	averageFocused: number;
	averageProductive: number;
	totalAverage: number;
}

export interface UserData {
	flowTimes: Map<string, Map<string, FlowTime>>;
	tags: Array<string>;
}
