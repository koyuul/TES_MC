import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import "./Sidebar.css";

export default class Sidebar extends React.Component {
    constructor() {
        super();
        this.state = {
            items: {
                root: {
                    index: 'root',
                    isFolder: true,
                    children: ['TES13', 'TES15'],
                    data: 'Root item',
                    canRename: false,
                },


                TES13: {
                    index: 'TES13',
                    canMove: false,
                    isFolder: true,
                    children: ['TES13_raw'],
                    data: 'TechEdSat-13',
                    canRename: false,
                },
                TES13_raw: {
                    index: 'TES13_raw',
                    canMove: false,
                    isFolder: true,
                    children: ['TES13_ax'],
                    data: 'Raw Mission Data',
                },
                TES13_ax: { //TODO: Implement a generator for individual items based on a database table?
                    index: 'TES13_ax',
                    canMove: true,
                    isFolder: false,
                    children: [],
                    data: 'ax',
                },


                TES15: {
                    index: 'TES15',
                    canMove: true,
                    isFolder: false,
                    children: [],
                    data: 'TechEdSat-15',
                }
            }
        };

    }

    render() {
        return (
            <div id="sidebar">
                <UncontrolledTreeEnvironment
                    dataProvider={new StaticTreeDataProvider(this.state.items, (item, data) => ({ ...item, data }))}
                    getItemTitle={item => item.data}
                    viewState={{}}
                    canDragAndDrop={true}
                    canDropOnFolder={false}
                    canReorderItems={false}
                >
                    <Tree treeId="main" rootItem="root" treeLabel="Main Example" />
                </UncontrolledTreeEnvironment>
            </div>
        )
    }
}
