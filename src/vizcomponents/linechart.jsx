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

const LineChart = ({ width, height, data, columns, colors, MARGIN }) => {

    const boundsWidth = width - MARGIN.left - MARGIN.right;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const pixelsPerTick = 100;

    // build the scales    
    const xScale = d3.scaleLinear()
        .domain([Math.min(...data.map(d => d.year)), Math.max(...data.map(d => d.year))])
        .range([0, boundsWidth]);
    
    const allValues = data.flatMap(d => columns.map(col => d[col]));
    const yScale = d3.scaleLinear().
        domain([Math.min(...allValues), Math.max(...allValues)]).
        range([boundsHeight, 0]);

    // build the lines

    // create a path for each energy type (each "column")
    const lines = columns.map(col => ({
        column: col,
        path: d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d[col]))(data) // equivalent to linebuilder=d3.line().blabla + line = linebuilder(data)
    }));

    const allLines = lines.map(({ column, path }) => (
        <g key={column}>
            <path
                d={path}
                stroke={colors[column] || "black"}
                fill="none"
                strokeWidth={3}
            />
        </g>
    ));


    return (
        <div>
            <svg width={width} height={height}>
                <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
                    {/* render axes*/}
                    <AxisLeft
                        yScale={yScale}
                        pixelsPerTick={pixelsPerTick}
                        boundsWidth={boundsWidth}
                        units="PWh"
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
                    {allLines}
                </g>
            </svg>
        </div>
    );
};