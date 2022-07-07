// @ts-nocheck
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Simulation } from "d3";
import { DiscordGuildData } from "./api/getNodes";
import Loader from "../components/loading";
import { useRouter } from "next/router";

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getViewBoxString(x: number, y: number, w: number, h: number) {
  return `${x} ${y} ${w} ${h}`;
}

function getPoint(e) {
  let point = { x: -1, y: -1 };

  if (e.targetTouches) {
    point.x = e.targetTouches[0].clientX;
    point.y = e.targetTouches[0].clientY;
  } else {
    point.x = e.clientX;
    point.y = e.clientY;
  }

  return point;
}

const Graph: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  const [nodeData, setNodeData] = useState<{
    nodes: DiscordGuildData[];
  } | null>(null);
  const isGatheringDataRef = useRef<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerDataRef = useRef<{
    isPointerDown: Boolean;
    originalX: number;
    originalY: number;
  }>({
    isPointerDown: false,
    originalX: 0,
    originalY: 0,
  });
  const nodeSize = 20;
  const graphDataRef = useRef<{
    nodes: any;
    texts: any;
    images: any;
    clips: any;
  }>({
    nodes: null,
    // links: null,
    texts: null,
    images: null,
    clips: null,
  });
  const simulationRef = useRef<Simulation<DiscordGuildData, undefined> | null>(
    null
  );
  const viewboxRef = useRef<ViewBox>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const newViewBoxRef = useRef<ViewBox>({ x: 0, y: 0, width: 0, height: 0 });

  const signOutCallback = useCallback(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);

  const onTick = useCallback(() => {
    if (
      graphDataRef.current.nodes &&
      graphDataRef.current.texts &&
      graphDataRef.current.images
    ) {
      // graphDataRef.current.links
      //   // @ts-ignore
      //   .attr("x1", function (d: any) {
      //     return d.source.x;
      //   })
      //   .attr("y1", function (d: any) {
      //     return d.source.y;
      //   })
      //   .attr("x2", function (d: any) {
      //     return d.target.x;
      //   })
      //   .attr("y2", function (d: any) {
      //     return d.target.y;
      //   });

      graphDataRef.current.nodes
        // @ts-ignore
        .attr("cx", function (d: any) {
          return d.x;
        })
        .attr("cy", function (d: any) {
          return d.y;
        });

      graphDataRef.current.texts
        // @ts-ignore
        .attr("x", function (d: any) {
          return d.x;
        })
        .attr("y", function (d: any) {
          return d.y - nodeSize;
        });

      graphDataRef.current.images
        // @ts-ignore
        .attr("x", (d) => d.x - nodeSize)
        .attr("y", (d) => d.y - nodeSize);
    }
  }, []);

  const onPointerDown = useCallback((e: Event) => {
    e.preventDefault();
    pointerDataRef.current.isPointerDown = true;
    const point = getPoint(e);
    pointerDataRef.current.originalX = point.x;
    pointerDataRef.current.originalY = point.y;
  }, []);
  const onPointerUp = useCallback((e: Event) => {
    e.preventDefault();
    pointerDataRef.current.isPointerDown = false;

    viewboxRef.current.x = newViewBoxRef.current.x;
    viewboxRef.current.y = newViewBoxRef.current.y;
  }, []);
  const onPointerMove = useCallback((e: Event) => {
    if (!pointerDataRef.current.isPointerDown) return;

    e.preventDefault();

    const point = getPoint(e);

    newViewBoxRef.current.x =
      viewboxRef.current.x - (point.x - pointerDataRef.current.originalX);
    newViewBoxRef.current.y =
      viewboxRef.current.y - (point.y - pointerDataRef.current.originalY);

    const viewBoxString = getViewBoxString(
      newViewBoxRef.current.x,
      newViewBoxRef.current.y,
      viewboxRef.current.width,
      viewboxRef.current.height
    );
    svgRef.current?.setAttribute("viewBox", viewBoxString);
  }, []);

  useEffect(() => {
    console.log("effect");
    if (svgRef.current && svgRef.current.childNodes.length < 1) {
      if (!nodeData) {
        if (!isGatheringDataRef.current) {
          fetch("/api/getNodes")
            .then((r) => {
              if (r.status === 200) {
                return r.json();
              }
              throw new Error("Could not get data");
            })
            .then((data: { nodes: DiscordGuildData[] }) => {
              setNodeData(data);
              isGatheringDataRef.current = false;
            })
            .catch((e) => {
              console.error(e);
              // isGatheringDataRef.current = false;
            });
          isGatheringDataRef.current = true;
        }
        return;
      }

      viewboxRef.current.width = svgRef.current.clientWidth;
      viewboxRef.current.height = svgRef.current.clientHeight;

      const svg = d3.select(svgRef.current);
      svg.attr(
        "viewBox",
        getViewBoxString(
          viewboxRef.current.x,
          viewboxRef.current.y,
          viewboxRef.current.width,
          viewboxRef.current.height
        )
      );

      simulationRef.current = d3
        .forceSimulation(nodeData.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force(
          "center",
          d3.forceCenter(
            svgRef.current.clientWidth / 2,
            svgRef.current.clientHeight / 2
          )
        )
        .on("tick", onTick);

      const groups = svg
        .selectAll("node")
        .data(nodeData.nodes)
        .enter()
        .append("g")
        .attr("class", "node");

      graphDataRef.current.nodes = groups
        .append("circle")
        .attr("r", nodeSize)
        .attr("fill", "black");
      // .call(d3.drag().on("drag", onDrag));

      graphDataRef.current.images = groups
        .append("image")
        .attr("href", (d) => {
          // console.log(d.icon);
          if (d.icon) {
            return `https://cdn.discordapp.com/icons/${d.id}/${d.icon}.${d.iconType}?size=128`;
          }
          return "";
        })
        .attr("width", nodeSize * 2)
        .attr("height", nodeSize * 2)
        .attr("clip-path", "url(#image-clip)")
        .attr("preserveAspectRatio", "xMidYMid slice");

      graphDataRef.current.texts = groups
        .append("text")
        .attr("class", "node-label")
        .text((d) => d.name);

      if (window.PointerEvent) {
        svgRef.current.addEventListener("pointerdown", onPointerDown);
        svgRef.current.addEventListener("pointerup", onPointerUp);
        svgRef.current.addEventListener("pointerleave", onPointerUp);
        svgRef.current.addEventListener("pointermove", onPointerMove);
      } else {
        // Add all mouse events listeners fallback
        svgRef.current.addEventListener("mousedown", onPointerDown);
        svgRef.current.addEventListener("mouseup", onPointerUp);
        svgRef.current.addEventListener("mouseleave", onPointerUp);
        svgRef.current.addEventListener("mousemove", onPointerMove);

        // Add all touch events listeners fallback
        svgRef.current.addEventListener("touchstart", onPointerDown);
        svgRef.current.addEventListener("touchend", onPointerUp);
        svgRef.current.addEventListener("touchmove", onPointerMove);
      }
    }
  }, [svgRef.current, nodeData]);

  if (session.status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <header>
        <nav className={`bg-blue-400 p-6 flex items-center justify-between`}>
          <span className={`uppercase text-gray-50 font-bold`}>B3LONG</span>
          <span className={`uppercase text-gray-50 font-bold text-xl`}>
            My Discord Communities
          </span>
          <button
            onClick={signOutCallback}
            className={`p-3 bg-yellow-400 rounded-md`}
          >
            Sign Out
          </button>
        </nav>
      </header>
      <div className={`flex-1`}>
        <svg ref={svgRef} className={`w-full h-full`}></svg>
        {!nodeData ? (
          <div
            className={`absolute top-0 right-0 left-0 bottom-0 bg-gray-900/70 flex items-center justify-center`}
          >
            <Loader />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Graph;
