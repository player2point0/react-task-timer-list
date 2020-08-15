import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainApp from "./MainApp/MainApp";
import * as serviceWorker from "./MainApp/serviceWorker";

serviceWorker.register();

ReactDOM.render(
	<MainApp/>,
	document.getElementById("root")
);