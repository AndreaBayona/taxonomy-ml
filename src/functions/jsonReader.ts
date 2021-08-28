import * as data from '../data/data.json';
import {Position} from "react-flow-renderer";

const MAX_NODE_HEIGHT = 50;
const MAX_NODE_WIDTH = 180;
const EDGE_LENGTH = 100;

const getYPosition = (totalHeight: number, partialHeight: number, itemNumber: number) => {
    return (totalHeight/2 - partialHeight/2) + itemNumber*MAX_NODE_HEIGHT;
};

function extractNodes(items: any[], totalHeight: number, nodes: any[], edges: any[], parentId:number) {
    items.forEach((item, index) => {
        const {id, name, level} = item;
        const newNode = {
            id: id.toString(),
            data: {label: name},
            position: {x: (MAX_NODE_WIDTH+EDGE_LENGTH)*level, y: getYPosition(totalHeight, items.length * MAX_NODE_HEIGHT, index)},
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            type: level === 3 ? 'output' : undefined,
        }
        const edge = {
            id: `edge${id}-${parentId}`,
            target: id.toString(),
            source: parentId ? parentId.toString() : "0",
            type: 'step'
        };
        console.log(newNode)
        nodes.push(newNode);
        edges.push(edge);
    });
}

const countNodeWithMoreLeaves = (node: any, max: number): number => {
     if (node.children){
         if(node.level === 2) return node.children.length;
         else {
             let temp: number = 0;
             node.children.forEach((child: any)=> {
                 temp = countNodeWithMoreLeaves(child, max);
                 if (temp > max) max = temp;
             });
             return max;
         }
     }
     else return 0;
};
const level2Count = (categories: any[]) => {
    let sum = 0;
    categories.forEach((cat) => {
    if(cat.children) sum += cat.children.length;
    })
    return sum;
}
const leavesCount = (categories: any[]) => {
    let max = 0;
    let temp = 0;
    categories.forEach((node)=> {
        temp = countNodeWithMoreLeaves(node, max);
        if (temp > max) max = temp;
    });
    return max;
}

const getNodes = (nodesData: any[], maxHeight: number, nodes:any[], edges: any[], parent: number) => {
    console.log("nodesData", parent, nodesData);
    if(!nodesData || !nodesData.length) return;
    extractNodes(nodesData, maxHeight, nodes, edges, parent)
    nodesData.forEach((node)=> {
        getNodes(node.children, maxHeight, nodes, edges, node.id);
    });
}

export const readJson = () => {
    const categories = data.categories;
    const nodes: any[] = [];
    const edges: any[] = [];
    const maxHeight = level2Count(categories) * leavesCount(categories) * MAX_NODE_HEIGHT;
    console.log("maxHeight", maxHeight);
    nodes.push({
        id: 0,
        data: {label: "init"},
        position: {x: 5, y: maxHeight/2},
        sourcePosition: Position.Right,
        type: "input"
    })
    getNodes(categories, maxHeight, nodes, edges, 0);

    return {nodes, edges};
};