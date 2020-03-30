import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import FirebaseController from "./FirebaseController.js";
import * as serviceWorker from "./serviceWorker.js";

serviceWorker.register();

ReactDOM.render(
	<FirebaseController/>,
	document.getElementById("root")
);