import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Graph() {
    const [dataPackets, setDataPackets] = useState(null);

    // Once component loads, request data for graph
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/TES13');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setDataPackets(await response.json());
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once after initial render

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    const data = {
        labels: ['a', 'b', 'c', 'd'],
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }


    return <>
        <Line options={options} data={data} />
        <textarea value={JSON.stringify(dataPackets, null, 4)} rows={10} cols={50}></textarea>

    </>
}

export default Graph;