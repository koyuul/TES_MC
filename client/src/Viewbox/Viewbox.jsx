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
const rethinkURL = ""

/*
    implementation:
        - have time conductor for live and static time
            - [visibleStart, visibleEnd], visibleLength
            - [loadedStart, loadedEnd]

        1 from sidebar, user drags graph into viewbox
        2 graph has name "TES13 - SP1V"
        3 add "SP1V" to 'viewable sensors' list maintained by viewbox
            - viewbox should maintain an state object that holds an array for each new packet data
              in the form { 'SP1V': [] }
        4 send request to subscribe to server for all packets that have EPOCH within timebounds [loadedStart, loadedEnd]
            - if any of the graphs's visibleStart or visibleEnd approaches Ls or Le within 40%, update loading bounds 1.75*Ls and 1.75*Le 
*/

const Viewbox = function (props) {
    const [displayedData, setDisplayedData] = useState({});

    const factory = (node) => {
        var component = node.getComponent();

        if (component === "button") return <button>{node.getName()}</button>;
        if (component === "graph") {
            try {
                let name = node._attributes.name.split(' ')[0]
                return <Graph node={node} />
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