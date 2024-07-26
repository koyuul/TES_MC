import React from 'react';
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
            data: props.points
        }]
    }


    return <>
        <Line options={options} data={data} />
        {/* <textarea value={JSON.stringify((props.dataPackets), null, 4)} rows={10} cols={50} readOnly={true}></textarea> */}

    </>
}

export default Graph;
