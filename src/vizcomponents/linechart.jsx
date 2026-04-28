import * as d3 from "d3";
import {useRef} from "react";
import {useDimensions} from "./useDimensions";
import {AxisBottom} from "./AxisBottom";

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

const LineChart = ({ width, height, data, MARGIN }) => {

    const boundsWidth = width - MARGIN.left - MARGIN.right;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const pixelsPerTick = 100;

    // build the scales and axes    
    const xScale = d3.scaleLinear()
        .domain([Math.min(...data.map(d => d.year)), Math.max(...data.map(d => d.year))])
        .range([0, boundsWidth]);
    const yScale = d3.scaleLinear().
        domain([Math.min(...data.map(d => d.coal)), Math.max(...data.map(d => d.coal))]).
        range([boundsHeight, 0]);

    // build the lines
    const lineBuilder = d3
        .line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.coal));
    
    const linePath = lineBuilder(data);

    return (
        <div>
            <svg width={width} height={height}>
                <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
                    {/* render axes*/}
                    <g transform={`translate(0,${boundsHeight})`}>
                        <AxisBottom
                            xScale={xScale}
                            pixelsPerTick={pixelsPerTick}
                            boundsHeight={boundsHeight}
                        />
                    </g>
                    {/* render all the <path>*/}
                    <path
                        d={linePath}
                        stroke="#9a6fb0"
                        fill="none"
                        strokeWidth={2}
                    />
                </g>
            </svg>
        </div>
    );
};