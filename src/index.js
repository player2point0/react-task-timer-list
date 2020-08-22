import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainApp from "./MainApp/MainApp";
import * as serviceWorker from "./MainApp/serviceWorker";
import {createStore, StoreProvider} from 'easy-peasy';
import {addTask} from "./Actions";

serviceWorker.register();

//todo split this up
const store = createStore({
    tasks: [],
    addTask: addTask,
    showAuthHtml: true,
    lastTickTime: new Date(),
    removeTaskId: "",
    setSaveAllTasks: false,
    dayStat: null,
    weekDayStats: null,
    showRecap: false,
});

ReactDOM.render(
    <StoreProvider store={store}>
        <MainApp/>
    </StoreProvider>,
    document.getElementById("root")
);