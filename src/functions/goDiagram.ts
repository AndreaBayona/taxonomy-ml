import * as go from 'gojs';

import * as data from '../data/data.json';

export function initDiagram() {
    const $ = go.GraphObject.make;

    const diagram = $(
        // id of DIV
        go.Diagram,
        // Automatically lay out the diagram as a tree;
        // separate trees are arranged vertically above each other.
        {
            layout: $(go.TreeLayout, { nodeSpacing: 3 })
        });

    // Define a node template showing class names.
    // Clicking on the node opens up the documentation for that class.
    diagram.nodeTemplate =
        $(go.Node,
            $("HyperlinkText",
                // compute the URL to open for the documentation
                (node: any) => {
                    return "../api/symbols/" + node.data.key + ".html";
                },
                // define the visuals for the hyperlink, basically the whole node:
                $(go.Panel, "Auto",
                    $(
                        go.Shape,
                        { fill: "#1F4963", stroke: null }
                    ),
                    $(
                        go.TextBlock,
                        { font: "bold 13px Helvetica, bold Arial, sans-serif", stroke: "white", margin: 3 },
                        new go.Binding("text", "key")
                    )
                )
            )
        );

    // Define a trivial link template with no arrowhead
    diagram.linkTemplate =
        $(go.Link,
            {
                curve: go.Link.Bezier,
                toEndSegmentLength: 30, fromEndSegmentLength: 30
            },
            $(go.Shape, { strokeWidth: 1.5 }) // the link shape, with the default black stroke
        );

    return diagram;
}

function getNodes(diagram: any) {
    // Collect all of the data for the model of the class hierarchy
    var nodeDataArray: any = [];

    // Iterate over all of the classes in "go"
    // for (k in go) {
    //     var cls = go[k];
    //     if (!cls) continue;
    //     var proto = cls.prototype;
    //     if (!proto) continue;
    //     if (k === 'EnumValue' || k === 'TextBlockMetrics') continue; // undocumented classes
    //     proto.constructor.className = k;  // remember name
    //     // find base class constructor
    //     var base = Object.getPrototypeOf(proto).constructor;
    //     if (base === Object) {  // "root" node?
    //         nodeDataArray.push({ key: k });
    //     } else {
    //         // add a node for this class and a tree-parent reference to the base class name
    //         nodeDataArray.push({ key: k, parent: base.className });
    //     }
    // }

    data.categories.forEach(category => {
        nodeDataArray.push({ key: category.name })
    })


    // Create the model for the hierarchy diagram
    diagram.model = new go.TreeModel(nodeDataArray);

    // Now collect all node data that are singletons
    var singlesArray: any = [];  // for classes that don't inherit from another class
    diagram.nodes.each((node: any) => {
        if (node.linksConnected.count === 0) {
            singlesArray.push(node.data);
        }
    });

    // Remove the unconnected class nodes from the main Diagram
    diagram.model.removeNodeDataCollection(singlesArray);

    // Display the unconnected classes in a separate Diagram
    // var singletons =
    //     $(go.Diagram, "mySingletons",
    //         {
    //             nodeTemplate: diagram.nodeTemplate, // share the node template with the main Diagram
    //             layout:
    //                 $(go.GridLayout,
    //                     {
    //                         wrappingColumn: 1,  // put the unconnected nodes in a column
    //                         spacing: new go.Size(3, 3)
    //                     }),
    //             model: new go.Model(singlesArray)  // use a separate model
    //         });
}

export function handleModelChange(changes: any) {
    alert('GoJS model changed!');
}
