import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainApp from "./MainApp/MainApp";
import * as serviceWorker from "./MainApp/serviceWorker";
import {createStore, StoreProvider} from 'easy-peasy';
import {taskModel} from "./EasyPeasy/Task/TaskModel";
import {dayStatModel} from "./EasyPeasy/DayStat/DayStatModel";

serviceWorker.register();

const store = createStore({
    tasks: taskModel,
    dayStat: dayStatModel,
    showAuthHtml: true,
    weekDayStats: null,
});

ReactDOM.render(
    <StoreProvider store={store}>
        <MainApp/>
    </StoreProvider>,
    document.getElementById("root")
);