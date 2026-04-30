import * as d3 from "d3";
import {useRef} from "react";
import {useDimensions} from "./useDimensions";
import {AxisBottom} from "./AxisBottom";
import {AxisLeft} from "./AxisLeft";

export const ResponsiveCircularBarplot = (props) => {
    const chartRef = useRef(null);
    const chartSize = useDimensions(chartRef);
    return (
        <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
            <CircularBarplot
                height={chartSize.height}
                width={chartSize.width}
                {...props} // pass all the props
            />
        </div>
    );
};

const CircularBarplot = ({ width, height, data, columns, colors, MARGIN}) => {
    const boundsWidth = width - MARGIN.left - MARGIN.right;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const innerRadius = 30;
    const outerRadius = Math.min(boundsWidth, boundsHeight) / 2;

    // build the scales
    const xScale = d3.scaleBand()
        .domain(columns)
        .range([0, 2 * Math.PI])
        .padding(0.3);

    const maxValue = d3.max(columns, (col) => data[col]);
    const yScale = d3.scaleRadial()
        .domain([0, maxValue])
        .range([innerRadius, outerRadius]);

    // Build the "bars"
    const arcPathGenerator = d3.arc();
        
    const allShapes = columns.map((col, i) => {
        const path = arcPathGenerator({
            innerRadius: innerRadius,
            outerRadius: yScale(data[col]),
            startAngle: xScale(col),
            endAngle: xScale(col) + xScale.bandwidth(),
            padAngle: 0.01,
        });
        return (
            <g key={i}>
                <path
                    d={path}
                    stroke="none"
                    fill={colors[col] || "#9d174d"}
                    rx={1}
                />
            </g>
        );
    });

    return (
        <div>
            <svg width={width} height={height}>
                <g transform={`translate( ${width/2}, ${height/2} )`} >
                    {allShapes}
                </g>
            </svg>
        </div>
    );
};;