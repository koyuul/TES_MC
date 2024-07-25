import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar/Sidebar"
import Viewbox from "./Viewbox/Viewbox";
import "./App.css";

export default function App() {
	const layoutRef = useRef(null);

	// Manage start and end dates
	const [startDate, setStartDate] = useState("2024-06-24");
	const [startTime, setStartTime] = useState("00:00");
	const [endDate, setEndDate] = useState("2024-07-01");
	const [endTime, setEndTime] = useState("00:00");
	const [dataPackets, setDataPackets] = useState([]);

	/*;
		LEAVE OFF:
			- ok sorry this is a trash place to leave off but my brain is melted.
			- our new approach will be to
				- req everything in appjsx
				- handle the processing client side
				- we will have to change how graph.jsx will handle everything

		thinkign whether or not we should:
			- req all data within dates up front, then split it all up client side
			- only req data within dates that is being displayed
	*/

	return (
		<div id="app">
			<Sidebar
				layoutRef={layoutRef}
				startDate={startDate}
				startTime={startTime}
				endDate={endDate}
				endTime={endTime}
				dataPackets={dataPackets}
				setStartDate={setStartDate}
				setStartTime={setStartTime}
				setendDate={setEndDate}
				setendTime={setEndTime}
			/>

			<Viewbox
				layoutRef={layoutRef}
				startDate={startDate}
				startTime={startTime}
				dataPackets={dataPackets}
				endDate={endDate}
				endTime={endTime}
			/>
		</div>
	)
};
