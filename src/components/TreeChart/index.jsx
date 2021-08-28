import * as d3 from "d3";

import {useD3} from "../../hooks/useD3";

const SVG_HEIGHT_IN_PX = 500;
const SVG_WIDTH_IN_PX = 925;
const MARGIN_IN_PX = {top: 10, right: 120, bottom: 10, left: 40};

const MAX_DEPTH = 5;
const X_NODE_SIZE = 30;
const Y_NODE_SIZE = SVG_WIDTH_IN_PX / MAX_DEPTH;

export const TreeChart = ({ data }) => {
  const ref = useD3(
    (svg) => {
      const tree = d3.tree().nodeSize([X_NODE_SIZE, Y_NODE_SIZE])
      const root = d3.hierarchy(data);
      const diagonal = d3
        .linkHorizontal()
        .x((node) => node.y)
        .y((node) => node.x);

      root.x0 = Y_NODE_SIZE / 2;
      root.y0 = 0;
      root.descendants().forEach((node, i) => {
        node.id = i;
        node._children = node.children;
        if (node.depth !== 0) node.children = null;
      });

      const baseLink = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 1.5);

      const baseNode = svg.append("g").attr("cursor", "pointer").attr("pointer-events", "all");

      const update = (sourceNode) => {
        const duration = 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node) => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + MARGIN_IN_PX.top + MARGIN_IN_PX.bottom;

        const transition = svg
          .transition()
          .duration(duration)
          .attr("viewBox", [
            -MARGIN_IN_PX.left,
            left.x - MARGIN_IN_PX.top,
            SVG_WIDTH_IN_PX,
            height,
          ])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update nodes.
        const node = baseNode.selectAll("g").data(nodes, (node) => node.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node
          .enter()
          .append("g")
          .attr("transform", (_node) => `translate(${sourceNode.y0},${sourceNode.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", function(_event, node) {
            node.children = node.children ? null : node._children;
            update(node);
          });

        nodeEnter
          .append("rect")
          .attr("width", 25)
          .attr("height", 15)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("y", -7.5)
          .attr("fill", (node) => (node._children ? "black" : "gray"))
          .attr("stroke-width", 10);

        nodeEnter
          .append("text")
          .attr("dy", "0.3em")
          .attr("x", (node) => (node._children ? -4 : 29))
          .attr("text-anchor", (node) => (node._children ? "end" : "start"))
          .style("font-size", "10px")
          .text((node) => {
            const { name, pipeline } = node.data;
            return `${name}${pipeline ? `(${pipeline})` : ""}`;
          })
          .clone(true)
          .lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");

        // Transition nodes to their new position.
        node
          .merge(nodeEnter)
          .transition(transition)
          .attr("transform", (node) => `translate(${node.y},${node.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        node
          .exit()
          .transition(transition)
          .remove()
          .attr("transform", (_node) => `translate(${sourceNode.y},${sourceNode.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

        // Update the links…
        const link = baseLink.selectAll("path").data(links, (node) => node.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link
          .enter()
          .append("path")
          .attr("d", (_node) => {
            const point = {x: sourceNode.x0, y: sourceNode.y0};
            return diagonal({source: point, target: point});
          });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition).attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link
          .exit()
          .transition(transition)
          .remove()
          .attr("d", (_node) => {
            const point = {x: sourceNode.x, y: sourceNode.y};
            return diagonal({source: point, target: point});
          });

        // Stash the old positions for transition.
        root.eachBefore((node) => {
          node.x0 = node.x;
          node.y0 = node.y;
        });
      }

      update(root);
    },
    [data.length],
  );

  return (
    <svg
      ref={ref}
      viewBox={[[-MARGIN_IN_PX.left, -MARGIN_IN_PX.top, SVG_WIDTH_IN_PX, X_NODE_SIZE]]}
      style={{
        height: SVG_HEIGHT_IN_PX,
        width: "100%",
        userSelect: "none",
      }}
    />
  );
}
