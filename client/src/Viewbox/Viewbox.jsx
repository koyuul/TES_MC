import React, { useState } from 'react'
import { Layout, Model } from 'flexlayout-react'
import Graph from "./Graph"
import 'flexlayout-react/style/dark.css';
import "./Viewbox.css"

//TODO: make this relevant to us
//TODO: make this preload
let defaultViewModel = { // This model defines the inital view we see when the app opens
    global: {},
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "One",
                        component: "button",
                    }
                ]
            },
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "Two",
                        component: "button",
                    }
                ]
            }
        ]
    }
};

const model = Model.fromJson(defaultViewModel);
const Viewbox = function (props) {
    const factory = (node) => {
        var component = node.getComponent();

        if (component === "button") return <button>{node.getName()}</button>;
        if (component === "graph") {
            try {
                let name = node._attributes.name.split(' ');
                return <Graph
                    node={node} name={name[name.length - 1]}
                    startDate={props.startDate}
                    startTime={props.startTime}
                    endDate={props.endDate}
                    endTime={props.endTime}
                    points={props.points[name[name.length - 1]]}
                />
            }
            catch (err) {
                alert(err)
                console.error(err)
            }
        }
    }

    return (
        <div id="viewbox">
            <Layout model={model} factory={factory} ref={props.layoutRef} /> //TODO: make this allow floating tabs
        </div>
    )
}

export default Viewbox;