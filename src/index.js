import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import MainApp from "./js/MainApp";
import * as serviceWorker from "./js/serviceWorker.js";

serviceWorker.register();

ReactDOM.render(
	<MainApp/>,
	document.getElementById("root")
);