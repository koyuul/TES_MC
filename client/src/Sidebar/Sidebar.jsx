import React, { useRef, useState } from 'react';
import { Tree } from 'react-arborist';
import useResizeObserver from "use-resize-observer";
import TES13_labels from "../data/TES13_labels.json";
import "./Sidebar.css";

export default function Sidebar(props) {
    let layoutRef = props.layoutRef;
    let [items, setItems] = useState([
        {
            id: 'TES13',
            name: 'TechEdSat-13',
            children: [
                {
                    id: 'TES13_raw',
                    name: 'Raw Mission Data',
                    children: TES13_labels.labels
                }
            ],
        },
        {
            id: 'TES15',
            name: 'TechEdSat-15',
            children: [],
        },
    ])


    let SidebarItem = ({ node, style, dragHandle }) => {
        const timer = useRef();

        function handleClick(event) {
            clearTimeout(timer.current);

            if (node.isLeaf) {
                if (event.detail == 1) {
                    timer.current = setTimeout(() => {
                        layoutRef.current.addTabToActiveTabSet(
                            {
                                type: "tab",
                                component: "graph",
                                name: node.parent.parent.data.id + " - " + node.data.name,
                            },
                        );
                    }, 200)
                } else if (event.detail == 2) {
                    clearTimeout(timer);
                    layoutRef.current.addTabWithDragAndDropIndirect(
                        node.data.name + " 📈",
                        {
                            type: "tab",
                            component: "graph",
                            name: node.parent.parent.data.id + " - " + node.data.name,
                        },
                    );
                }
            }
            else node.toggle();
        }

        return (
            <div className="sidebar-item" style={style} onClick={handleClick}>
                {node.isLeaf ? "📈 " : (node.isClosed) ? "▸ " : "▾"} {node.data.name}
            </div>
        );
    }

    const { ref, width, height } = useResizeObserver();
    return (
        <div id="sidebar">
            <h4 className="sidebar-title"> explorer </h4>
            <div id="tree" ref={ref}>
                <Tree initialData={items} openByDefault={true} width={width} height={height}>
                    {SidebarItem}
                </Tree>
            </div>
            <h4 className="sidebar-title"> time controller </h4>
        </div>
    )
}
