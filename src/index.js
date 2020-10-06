import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainApp from "./MainApp/MainApp";
import * as serviceWorker from "./MainApp/serviceWorker";
import {createStore, StoreProvider} from 'easy-peasy';
import {taskModel} from "./EasyPeasy/Task/TaskModel";
import {dayStatModel} from "./EasyPeasy/DayStat/DayStatModel";
import {tick, startTask, reportFlow, updateFlow, hideReportFlow} from "./EasyPeasy/TaskController";

serviceWorker.register();

const store = createStore({
    tasks: taskModel,
    dayStat: dayStatModel,
    weekDayStats: null,
    tick: tick,
    startTask: startTask,
    reportFlow: reportFlow,
});

ReactDOM.render(
    <StoreProvider store={store}>
        <MainApp/>
    </StoreProvider>,
    document.getElementById("root")
);