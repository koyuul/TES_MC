import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    TimeScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client'

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Graph(props) {
    const [dataPackets, setDataPackets] = useState([]);

    // Once component loads, request data for graph
    useEffect(() => {
        const socket = io('ws://localhost:3000');
        socket.on('initialData', (initialData) => {
            console.log('Received initial data');
            setDataPackets(initialData);
        })

        socket.on('change', (change) => {
            console.log('Data change registered');
            setDataPackets((prev, props) => [...prev, change]);
        });

        return () => {
            socket.disconnect();
        };
        // const fetchData = async () => {
        //     try {
        //         const response = await fetch('http://localhost:3000/TES13');
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         setDataPackets(await response.json());
        //     } catch (error) {
        //         console.error('There has been a problem with your fetch operation:', error);
        //     }
        // };

        // fetchData();
    }, []); // Empty dependency array means this effect runs once after initial render

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
            }
        },
        plugins: {
            title: {
                display: true,
                text: props.node._renderedName,
            },
        },
    };

    const data = {
        datasets: [{
            label: 'My First Dataset',
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            data: [
                { x: '2024-05-11', y: 1 },
                { x: '2024-05-15', y: 5 },
                { x: '2024-05-29', y: 2 },
                { x: '2024-06-10', y: 19 },
            ],
        }]
    }


    return <>
        <Line options={options} data={data} />
        <textarea value={JSON.stringify(dataPackets, null, 4)} rows={10} cols={50} readOnly={true}></textarea>

    </>
}

export default Graph;