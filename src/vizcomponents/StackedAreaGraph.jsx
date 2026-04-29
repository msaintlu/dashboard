import * as d3 from "d3";
import {useRef} from "react";
import {useDimensions} from "./useDimensions";
import {AxisBottom} from "./AxisBottom";
import {AxisLeft} from "./AxisLeft";

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

const StackedAreaGraph = ({ width, height, data, columns, colors, MARGIN }) => {

    const boundsWidth = width - MARGIN.left - MARGIN.right;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const pixelsPerTick = 100;

    // Stack the data
    const stackSeries = d3.stack().keys(columns)
    const series = stackSeries(data);
    
    // build the scales    
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.year))
        .range([0, boundsWidth]);
    
    const maxValue = d3.max(series.flatMap(d => d.map(point => point[1])));
    const yScale = d3.scaleLinear().
        domain([0, maxValue]).
        range([boundsHeight, 0]);
 
    // Build the areas
    const areaBuilder = d3.area()
        .x((s) => xScale(s.data.year))
        .y1((s) => yScale(s[1]))
        .y0((s) => yScale(s[0]));

    const allPath = series.map((serie, i) => {
        const path = areaBuilder(serie);
        return (
            <path
                key={i}
                d={path}
                fill={colors[serie.key] || "black"}
            />
        );
    });


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
                        axisLine={false}
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
        </div>
    );
};