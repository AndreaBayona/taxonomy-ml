import React from "react";
import * as d3 from "d3";

export const useD3 = (renderGraphFn: (selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>) => void, dependencies: React.DependencyList) => {
  const ref = React.useRef();

  React.useEffect(() => {
    renderGraphFn(d3.select(ref.current!));
    return () => {};
  }, dependencies);

  return ref;
};
