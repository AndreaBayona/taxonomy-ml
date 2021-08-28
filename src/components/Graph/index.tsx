import * as React from 'react';
import ReactFlow from 'react-flow-renderer';
import {readJson} from "../../functions/jsonReader";

const flowStyles = { height: 1500 };

export const Graph : React.FunctionComponent = () => {
    const {nodes, edges} = readJson();
    const elements = nodes.concat(edges);
    return (
        <ReactFlow elements={elements} style={flowStyles}/>
    )
};
