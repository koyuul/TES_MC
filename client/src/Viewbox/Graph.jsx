import React, { useMemo } from 'react';
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

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip);

const colors = ['#F86882', '#F08D71', '#F0C66F', '#A6CD77', '#81D0C9', '#9FA0E1'];

function Graph(props) {
    const color = useMemo(() => colors[props.index % colors.length], [props.idnex]);

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
            borderColor: color,
            data: props.points
        }]
    }

    return <>
        <Line options={options} data={data} />
        {/* <textarea value={JSON.stringify((props.dataPackets), null, 4)} rows={10} cols={50} readOnly={true}></textarea> */}

    </>
}

export default Graph;
