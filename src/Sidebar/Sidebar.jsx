import React from 'react';
import { Tree } from 'react-arborist';
import { useDrag } from 'react-dnd';
import "./Sidebar.css";
export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.layoutRef = props.layoutRef;
        this.state = {
            items: [
                {
                    id: 'TES13',
                    name: 'TechEdSat-13',
                    children: [
                        {
                            id: 'TES13_raw',
                            name: 'Raw Mission Data',
                            children: [
                                {
                                    id: 'TES13_ax',
                                    name: 'ax'
                                }
                            ]
                        }
                    ],
                },
                {
                    id: 'TES15',
                    name: 'TechEdSat-15',
                    children: [],
                },
            ]
        }
    }

    SidebarItem = ({ node, style, dragHandle }) => {
        function handleClick(event) {
            if (node.isLeaf) {
                let tabToBeAdded = {
                    type: "tab",
                    component: "grid",
                    name: node.parent.parent.data.id + " - " + node.data.name
                }

                this.layoutRef.current.addTabWithDragAndDropIndirect( //TODO: find a way to impelement addToActiveTab on double click.
                    node.data.name + " 📈",
                    tabToBeAdded,
                );
            }
            else node.toggle();
        }

        return (
            <div className="sidebar-item" style={style} onClick={handleClick.bind(this)}>
                {node.isLeaf ? "📈 " : (node.isClosed) ? "▸ " : "▾"} {node.data.name}
            </div>
        );
    }

    render() {
        return (
            <div id="sidebar">
                <Tree initialData={this.state.items} openByDefault={false}>
                    {this.SidebarItem}
                </Tree>
            </div>
        )
    }
}
