import React, { useState } from 'react';
import './TimeController.css';

export default function TimeController(props) {
    /*
        Time controlelrs responsibilieis:
            - primary: allow user to set boundaries for data requests.
                - static mode: from datetime A to datetime B
                - live mode: from (now - datetimeA) to now
            - have +-   1hr, +-1 day buttons to quick adjust bounds

    */
    return (
        <div id="time-controller">
            <div id="time-controller-inputs">
                <div id="start-datetime" className="datetime-block">
                    <input
                        type="time"
                        name="start-time"
                        id="start-time"
                        onChange={(e) => props.setStartTime(e.target.value)}
                        defaultValue={props.startTime}
                    />
                    <input
                        type="date"
                        name="start-date"
                        id="start-date"
                        onChange={(e) => props.setStartDate(e.target.value)}
                        defaultValue={props.startDate}
                    />
                </div>

                <div id="time-controller-separator">to</div>

                <div id="end-datetime" className="datetime-block">
                    <input
                        type="time"
                        name="end-time"
                        id="end-time"
                        onChange={(e) => props.setEndTime(e.target.value)}
                        defaultValue={props.endTime}
                    />
                    <input
                        type="date"
                        name="end-date"
                        id="end-date"
                        onChange={(e) => props.setEndDate(e.target.value)}
                        defaultValue={props.endDate}
                    />
                </div>
            </div>
            <input id="time-controller-submit" type="button" value="Update" onClick={props.handleTimeChange} />
        </div>
    )
}
