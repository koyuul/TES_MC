import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
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
import { splitToPoints } from '../utils/PacketSplitter';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip);

function Graph(props) {
    let [points, setPoints] = useState([]);

    useEffect(() => {
        const socket = io(
            'ws://localhost:3000'
        );

        socket.emit('initialRequest',
            {
                query: {
                    startDatetime: `${props.startDate}T${props.startTime}:00.000Z`,
                    endDatetime: `${props.endDate}T${props.endTime}:00.000Z`,
                }
            }
        )

        socket.on('initialResponse', (initialResponse) => {
            console.log('Received initial response');
            setPoints(initialResponse);
        })

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
            data: points
        }]
    }


    return <>
        <Line options={options} data={data} />
        <textarea value={JSON.stringify((points), null, 4)} rows={10} cols={50} readOnly={true}></textarea>

    </>
}

export default Graph;