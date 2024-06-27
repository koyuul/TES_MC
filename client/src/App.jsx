import React, { useRef } from "react";
import Sidebar from "./Sidebar/Sidebar"
import Viewbox from "./Viewbox/Viewbox";
import "./App.css";

export default function App() {
	const layoutRef = useRef(null);

	return (
		<div id="app">
			<Sidebar layoutRef={layoutRef} />
			<Viewbox layoutRef={layoutRef} />
		</div>
	)
};
