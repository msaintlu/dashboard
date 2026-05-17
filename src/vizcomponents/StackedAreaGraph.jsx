import * as d3 from "d3";
import {useRef, useState} from "react";
import {useDimensions} from "./useDimensions";
import {AxisBottom} from "./AxisBottom";
import {AxisLeft} from "./AxisLeft";
import {Tooltip} from "./Tooltip_StackedAreaGraph";

export const ResponsiveStackedAreaGraph = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);
  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
      <StackedAreaGraph
        height={chartSize.height}
        width={chartSize.width}
        {...props} // pass all the props
      />
    </div>
  );
};

const bisect = d3.bisector((d) => d.year).left; // To catch the closest x point for the tooltip


const StackedAreaGraph = ({ width, height, data, columns, colors, MARGIN, hoveredCol, setHoveredCol }) => {
  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const pixelsPerTick = 100;
  const [interactionData, setInteractionData] = useState(null);

  // Stack the data
  const stackSeries = d3.stack().keys(columns);
  const series = stackSeries(data);

  // build the scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, boundsWidth]);

  const maxValue = d3.max(series.flatMap((d) => d.map((point) => point[1])));
  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([boundsHeight, 0]);

  // Build the areas

  const areaBuilder = d3
    .area()
    .x((s) => xScale(s.data.year))
    .y1((s) => yScale(s[1]))
    .y0((s) => yScale(s[0]));

  const allPath = series.map((serie, i) => {
    const path = areaBuilder(serie);
    return (
      <g key={i}>
        <path
          d={path}
          fill={colors[serie.key] || "black"}
          opacity={hoveredCol === null || hoveredCol === serie.key ? 1 : 0.2}
          /*onMouseEnter={() => setHoveredCol(serie.key)}*/
          /*onMouseLeave={() => setHoveredCol(null)}*/
          style={{ transition: "opacity 100ms ease-in-out" }}
          onMouseLeave={() => {
            setHoveredCol(null);
          }}
        />
      </g>
    );
  });

  // Handle mouse hovering for tooltip

  const handleMouseMove = (event) => {
    const cursorX = event.nativeEvent.offsetX - MARGIN.left;
    const xValue = xScale.invert(cursorX);

    const index = bisect(data, xValue);
    const d0 = data[index - 1];
    const d1 = data[index];
    const nearest = !d0
      ? d1
      : !d1
      ? d0
      : xValue - d0.year > d1.year - xValue
      ? d1
      : d0;

    setInteractionData({
      xPos: xScale(nearest.year),
      yPos: boundsHeight/3,
      name: nearest.year,
      xValue: nearest.year,
      height: boundsHeight,
      placement: xScale(nearest.year) < boundsWidth / 2 ? "right" : "left",
    });
  };

  // Mini scatterplot at hovering, for each year    
  const hoveringPoints = (interactionData) => {
    return series.map((serie) => {
      const segment = serie.find((s) => s.data.year === interactionData.xValue);
      if (!segment) return null; 

      return (
        <circle
          key={`hover-point-${serie.key}`} 
          cx={interactionData.xPos}
          cy={yScale((segment[0]+segment[1])/2)} 
          r={3}
          fill={colors[serie.key] || "red"} 
          stroke="white" 
          strokeWidth={0.5}
        />
      );
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* render axes*/}
          <AxisLeft
            yScale={yScale}
            pixelsPerTick={pixelsPerTick}
            boundsWidth={boundsWidth}
            units="PWh"
            axisLine={false}
            grid={true}
          />
          <g transform={`translate(0,${boundsHeight})`}>
            <AxisBottom
              xScale={xScale}
              pixelsPerTick={pixelsPerTick}
              boundsHeight={boundsHeight}
              axisLine={false}
            />
          </g>
          {/* render all the <path> */}
          {allPath}
          {/* render tooltip */}
          {interactionData && (
            <g>
              <line
                x1={interactionData.xPos}
                y1={0}
                x2={interactionData.xPos}
                y2={boundsHeight}
                stroke="black"
                strokeWidth={0.5}
              />
              {hoveringPoints(interactionData)}
            </g>
          )}
          {/* Invisible cursor catcher */}
          <rect
            width={boundsWidth}
            height={boundsHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setInteractionData(null)}
          />
        </g>
      </svg>
      {/* Tooltip layer */}
      <div
        style={{
          position: "absolute",
          width: boundsWidth,
          height: boundsHeight,
          top: MARGIN.top,
          left: MARGIN.left,
          pointerEvents: "none",
        }}
      >
        <Tooltip interactionData={interactionData} />
      </div>
    </div>
  );
};