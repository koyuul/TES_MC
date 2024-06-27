import React, { useRef } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
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
