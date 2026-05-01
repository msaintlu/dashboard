import * as d3 from "d3";
import {useRef} from "react";
import {useDimensions} from "./useDimensions";
import {AxisBottom} from "./AxisBottom";
import {AxisLeft} from "./AxisLeft";

export const ResponsiveLineChart = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);
  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
      <LineChart
        height={chartSize.height}
        width={chartSize.width}
        {...props} // pass all the props
      />
    </div>
  );
};

const LineChart = ({ width, height, data, columns, colors, MARGIN, labels }) => {

  const marginRight = labels ? 170 : MARGIN.right;

  const boundsWidth = width - MARGIN.left - marginRight;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const pixelsPerTick = 100;

  // build the scales    
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, boundsWidth]);
  
  const allValues = data.flatMap(d => columns.map(col => d[col]));
  const yScale = d3.scaleLinear().
    domain([Math.min(...allValues), Math.max(...allValues)]).
    range([boundsHeight, 0]);

  // build the lines
  const allPath = columns.map((col, i) => {
    const lineBuilder = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d[col]));
    const linePath = lineBuilder(data);
    const labelY = data.filter((d) => d.year === 2024).map((d) => d[col])[0];
    return (
      <g key={i}>
        <path
          d={linePath}
          stroke={colors[col] || "black"}
          fill="none"
          strokeWidth={3}
        />
        {labels && (
          <g transform={`translate(${boundsWidth + 8}, ${yScale(labelY)})`}>
            <text
              style={{
                fontSize: "14px",
                textAnchor: "start",
                dominantBaseline: "middle",
                fill: colors[col],
              }}
          >
              {labels[col]}
            </text>
          </g>
        )}
      </g>
    );
  });

  return (
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
        {/* render all the <path>*/}
        {allPath}
      </g>
    </svg>
  );
};