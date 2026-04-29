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

const CircularBarplot = ({ width, height, data, columns, colors, MARGIN }) => {

    const boundsWidth = width - MARGIN.left - MARGIN.right;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;  

    const innerRadius = 0;
    const outerRadius = Math.min(width, height) / 2;

    // build the scales    
    const xScale = d3.scaleBand()
        .domain(columns)
        .range([0, 2 * Math.PI])
        .padding(0.2)
    
    const yScale = d3.scaleRadial()
        .domain([0, d3.max(data.flatMap(d => columns.map(col => d[col])))])
        .range([innerRadius, outerRadius]);
        
    // Build the "bars"
    const arcPathGenerator = d3.arc();
    const allShapes = columns.map((col, i) => { // Je pense que là la boucle est pas sur le bon truc. Demander à l'IA de me corriger ce code, en lui disant ce que j'ai fait d'abord comme filtre sur data
        const path = arcPathGenerator({
            innerRadius: innerRadius,
            outerRadius: yScale(data[col]),
            startAngle: xScale(col),
            endAngle: xScale(col) + xScale.bandwidth(),
        });
        return (
            <g key={i}>
                <path
                    d={path}
                    stroke="none"
                    fill="#9d174d"
                    rx={1}
                />
            </g>
        );
    });

   return (
        <div>
            <svg width={width} height={height}>
               <g transform={`translate(${width/2+MARGIN}, ${height/2+MARGIN})`}>
                   {allShapes}
               </g>
            </svg>
        </div>
    );
};