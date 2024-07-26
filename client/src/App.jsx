import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar/Sidebar"
import Viewbox from "./Viewbox/Viewbox";
import "./App.css";

export default function App() {
	const layoutRef = useRef(null);

	// Manage start and end dates
	const [startDate, setStartDate] = useState("2024-06-24");
	const [startTime, setStartTime] = useState("00:00");
	const [endDate, setEndDate] = useState("2024-07-02");
	const [endTime, setEndTime] = useState("12:00");
	const [dataPackets, setDataPackets] = useState([]);
	const [points, setPoints] = useState();

	useEffect(() => {
		const socket = io(
			'ws://localhost:3000',
			{
				query: {
					startDatetime: `${startDate}T${startTime}:00Z`,
					endDatetime: `${endDate}T${endTime}:00Z`,
				}
			}
		);

		socket.emit('initialRequest');
		socket.on('initialResponse', (initialResponse) => {
			console.log('Received initial response');
			console.log(initialResponse)
			let tempPoints = {};
			for (let packet of initialResponse) {
				for (let [key, val] of Object.entries(packet)) {
					if (tempPoints[key] == undefined) tempPoints[key] = [];
					tempPoints[key].push({ x: new Date(packet['EPOCH']), y: val });
				}
			}
			setDataPackets(initialResponse);
			setPoints(tempPoints);
			console.log(tempPoints);
		})

		return () => {
			socket.disconnect();
		};
	}, []); // Empty dependency array means this effect runs once after initial render


	/*
		Leave off:
			we have our sys working.
			we are able to change our date and register it in app.jsx
			we have to make a function that runs when submit button is clicked
			we now just have to implement the functionality in server.js
			socket.on('datechange', {
				// rerequest  data
			})




	*/

	useEffect(() => {
		console.log("we changed teh date hoorayyyy");
	}, [endDate])

	return (
		<div id="app">
			<Sidebar
				layoutRef={layoutRef}
				startDate={startDate}
				startTime={startTime}
				endDate={endDate}
				endTime={endTime}
				setStartDate={setStartDate}
				setStartTime={setStartTime}
				setEndDate={setEndDate}
				setEndTime={setEndTime}
			/>

			<Viewbox
				layoutRef={layoutRef}
				startDate={startDate}
				startTime={startTime}
				points={points}
				endDate={endDate}
				endTime={endTime}
			/>
		</div>
	)
};

