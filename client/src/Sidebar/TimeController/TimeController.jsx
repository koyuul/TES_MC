import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './TimeController.css';

export default function TimeController(props) {
    /*
        Time controlelrs responsibilieis:
            - primary: allow user to set boundaries for data requests.
                - static mode: from datetime A to datetime B
                - live mode: from (now - datetimeA) to now
            - have +-   1hr, +-1 day buttons to quick adjust bounds

    */
    function handleClick() {

    }

    return (
        <div id="time-controller">
            <div id="start-datetime" className="datetime-block">
                <input
                    type="time"
                    name="start-time"
                    id="start-time"
                    defaultValue={props.startTime}
                />
                <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    defaultValue={props.startDate}
                />
            </div>

            <div>to</div>

            <div id="end-datetime" className="datetime-block">
                <input
                    type="time"
                    name="end-time"
                    id="end-time"
                    defaultValue={props.endTime}
                />
                <input
                    type="date"
                    name="end-date"
                    id="end-date"
                    defaultValue={props.endDate}
                />
            </div>
            <input type="button" value="test" onClick={handleClick} />
        </div>
    )
}
