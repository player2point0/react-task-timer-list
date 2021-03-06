import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainApp from "./MainApp/MainApp";
import * as serviceWorker from "./MainApp/serviceWorker";
import {createStore, StoreProvider} from 'easy-peasy';
import {taskModel} from "./EasyPeasy/Task/TaskModel";
import {dayStatModel} from "./EasyPeasy/DayStat/DayStatModel";
import {tick, startTask, reportFlow} from "./EasyPeasy/TaskController";
import {firebaseConfig} from "./Firebase/FirebaseController";
import {userDataModel} from "./EasyPeasy/UserData/UserDataModel";

serviceWorker.register(firebaseConfig);

const store = createStore({
    tasks: taskModel,
    dayStat: dayStatModel,
    userData: userDataModel,
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