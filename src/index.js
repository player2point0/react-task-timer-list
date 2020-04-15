import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import FirebaseController from "./js/FirebaseController.js";
import * as serviceWorker from "./js/serviceWorker.js";

serviceWorker.register();

ReactDOM.render(
	<FirebaseController/>,
	document.getElementById("root")
);