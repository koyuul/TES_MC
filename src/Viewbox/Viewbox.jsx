import React from 'react'
import { useDrop } from 'react-dnd'
import { Layout, Model } from 'flexlayout-react'
import 'flexlayout-react/style/dark.css';
import "./Viewbox.css"

var json = { //TODO: make this relevant to ours
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

const model = Model.fromJson(json);


const Viewbox = function (props) {
    const factory = (node) => {
        var component = node.getComponent();

        if (component === "button") {
            return <button>{node.getName()}</button>;
        }
    }

    return (
        <div id="viewbox">
            <Layout model={model} factory={factory} ref={props.layoutRef} /> //TODO: make this allow floating tabs
        </div>
    )
}

export default Viewbox;