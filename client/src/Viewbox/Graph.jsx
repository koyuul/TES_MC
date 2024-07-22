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
import { splitToPoints } from '../utils/PacketSplitter';
import { generateSidebarLabels } from '../utils/SidebarGenerator';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip);


function Graph(props) {
    const [dataPackets, setDataPackets] = useState([]);

    // Once component loads, request data for graph
    useEffect(() => {
        const socket = io('ws://localhost:3000');
        socket.on('initialData', (initialData) => {
            console.log('Received initial data');

            console.log(generateSidebarLabels('TES13', initialData));
            setDataPackets(splitToPoints(initialData, props.name));
        })

        socket.on('change', (change) => {
            console.log('Data change registered');
            setDataPackets((prev, props) => [...prev, change]);
        });

        return () => {
            socket.disconnect();
        };
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
            label: props.name,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            data: dataPackets,
        }]
    }


    return <>
        <Line options={options} data={data} />
        <textarea value={JSON.stringify(dataPackets, null, 4)} rows={10} cols={50} readOnly={true}></textarea>

    </>
}

export default Graph;