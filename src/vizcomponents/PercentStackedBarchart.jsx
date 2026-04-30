import * as d3 from "d3";
import {useRef} from "react";
import {useDimensions} from "./useDimensions";


export const ResponsivePercentStackedBarchart = (props) => {
    const chartRef = useRef(null);
    const chartSize = useDimensions(chartRef);
    return (
        <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
            <PercentStackedBarchart
                height={chartSize.height}
                width={chartSize.width}
                {...props} // pass all the props
            />
        </div>
    );
};

const PercentStackedBarchart = ({ width, height, data, columns, colors, MARGIN }) => {

    const boundsWidth = width - MARGIN.left - MARGIN.right;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    // Normalize the data
    const normalizedData = data.map(d => {
        const total = d3.sum(columns, col => d[col]);
        const normalizedItem = { ...d };
        columns.forEach(col => {
            normalizedItem[col] = (d[col] / total) * 100;
        });

        return normalizedItem;
    });   

    // Stack the data
    const stackSeries = d3.stack().keys(columns)
    const series = stackSeries(normalizedData);
    
    // build the scales    
    const xScale = d3.scaleLinear()
        .domain([0, 100]) 
        .range([0, boundsWidth]);
    
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, boundsHeight])
        .paddingInner(0.1)
        .paddingOuter(0);

    // Build the bars (segments)
    const allBars = series.map((serie, i) => {   // series is an array, one item per energy type here
        return serie.map((segment, j) => (    // each serie is in the form [[38, 57, data: {…}], [38, 78, data: {…}]..., key: 'coal', index: 1]
            <g key={`${i}-${j}`}>
                <rect
                    x={xScale(segment[0])}
                    y={yScale(segment.data.country)}
                    width={xScale(segment[1]) - xScale(segment[0])}
                    height={yScale.bandwidth()}
                    fill={colors[serie.key] || "black"}
                />
                {i===0 && (
                    <text
                        x={-10}
                        y={yScale(segment.data.country) + yScale.bandwidth()/2}
                        style={{
                            fontSize: "14px",
                            textAnchor: "end",
                            dominantBaseline: "middle",
                        }}
                    >
                        {segment.data.country}
                    </text>
                )}
            </g>
        ));
    });

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
                {/* render all the <path>*/}
                {allBars}
            </g>
        </svg>
    );
};