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
	const socket = io(
		'ws://localhost:3000',
		{
			query: {
				startDatetime: `${startDate}T${startTime}:00Z`,
				endDatetime: `${endDate}T${endTime}:00Z`,
			}
		}
	);

	socket.on('dateChangeResponse', (dateChangeResponse) => {
		console.log('Received date change response');
		let tempPoints = {};
		for (let packet of dateChangeResponse) {
			for (let [key, val] of Object.entries(packet)) {
				if (tempPoints[key] == undefined) tempPoints[key] = [];
				tempPoints[key].push({ x: new Date(packet['EPOCH']), y: val });
			}
		}
		setDataPackets(dateChangeResponse);
		setPoints(tempPoints);
	});

	socket.on('initialResponse', (initialResponse) => {
		console.log('Received initial response');
		let tempPoints = {};
		for (let packet of initialResponse) {
			for (let [key, val] of Object.entries(packet)) {
				if (tempPoints[key] == undefined) tempPoints[key] = [];
				tempPoints[key].push({ x: new Date(packet['EPOCH']), y: val });
			}
		}
		setDataPackets(initialResponse);
		setPoints(tempPoints);
	})

	useEffect(() => {
		socket.emit('initialRequest');

		return () => {
			socket.disconnect();
		};
	}, []); // Empty dependency array means this effect runs once after initial render

	function handleTimeChange() {
		// TODO: ensure that the start aint after the end
		console.log('Handling time change...');
		socket.emit('dateChangeRequest',
			{
				query: {
					newStartDatetime: `${startDate}T${startTime}:00Z`,
					newEndDatetime: `${endDate}T${endTime}:00Z`,
				}
			}
		);

	}

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
				handleTimeChange={handleTimeChange}
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

