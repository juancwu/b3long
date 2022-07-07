import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { gray, SimulationNodeDatum } from "d3";

export interface GraphProps {
  data: any;
  dimensions: {
    width: number;
    height: number;
  };
}

const Graph: FC<GraphProps> = ({ data, dimensions }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // all these data should come from data prop
    const nodes = [
      { name: "Awesome community" },
      { name: "user1" },
      { name: "user2" },
    ];
    const links = [
      { source: "user1", target: "Awesome community" },
      { source: "user2", target: "Awesome community" },
    ];
    const simulation = d3.forceSimulation(nodes as SimulationNodeDatum[]);
    simulation
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink())
      .force("center", d3.forceCenter())
      .on("tick", () => {
        console.log("tick");
      });

    // draw
  }, []);

  return <div ref={containerRef}></div>;
};

export default Graph;
