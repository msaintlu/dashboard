import * as d3 from "d3";
import {useRef} from "react";
import {useDimensions} from "./useDimensions";


export const ResponsiveDonut = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);
  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
      <Donut
        height={chartSize.height}
        width={chartSize.width}
        {...props} // pass all the props
      />
    </div>
  );
};

const Donut = ({ width, height, data, columns, colors, MARGIN, labels, hoveredCol, setHoveredCol }) => {
  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const innerRadius = 40;
  const outerRadius = Math.min(boundsWidth, boundsHeight) / 2;
  const INFLEXION_PADDING = 10; // default space between donut and label inflexion point
  const LABEL_PADDING = 10; // space between inflexion point and label

  // Build the slices
  const pieGenerator = d3.pie().value((col) => data[col]);
  const pie = pieGenerator(columns);
  const arcPathGenerator = d3.arc();

  const arcs = pie.map((p, i) => {

    const sliceInfo = {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      startAngle: p.startAngle,
      endAngle: p.endAngle,
    };
    const slicePath = arcPathGenerator(sliceInfo);

    // Legend
    // First arc for the legend segment pointing the slices
    const sliceExtInfo = {
      innerRadius: outerRadius,
      outerRadius: outerRadius,
      startAngle: p.startAngle,
      endAngle: p.endAngle,
    };
    const centroid = arcPathGenerator.centroid(sliceExtInfo); // [x,y] position of the centroid

    // Second arc for the legend segment inflexion point
    const inflexionPadding =
      p.data === "other_renewable"
        ? 30
        : p.data === "solar"
        ? 30
        : p.data === "wind"
        ? 18
        : INFLEXION_PADDING;
    const inflexionInfo = {
      innerRadius: outerRadius + inflexionPadding,
      outerRadius: outerRadius + inflexionPadding,
      startAngle: p.startAngle,
      endAngle: p.endAngle,
    };
    const inflexionPoint = arcPathGenerator.centroid(inflexionInfo);
    const inflexionInfo_other_renewable = {
      innerRadius: outerRadius + inflexionPadding,
      outerRadius: outerRadius + inflexionPadding,
      startAngle: pie.filter((p) => p.data === "other_renewable")[0].startAngle,
      endAngle: pie.filter((p) => p.data === "other_renewable")[0].endAngle,
    };
    const inflexionPoint_other_renewable = arcPathGenerator.centroid(inflexionInfo_other_renewable);

    // Labels
    const isRightLabel = inflexionPoint[0] >= inflexionPoint_other_renewable[0];
    const labelPosX = inflexionPoint[0] + LABEL_PADDING * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";
    const label = labels[p.data]; //+ " (" + p.value + ")";
    return (
      <g
        key={i}
        onMouseEnter={() => setHoveredCol(p.data)}
        onMouseLeave={() => setHoveredCol(null)}
        opacity={hoveredCol === null || hoveredCol === p.data ? 1 : 0.2}
        style={{ transition: "opacity 100ms ease-in-out" }}
      >
        <path d={slicePath} fill={colors[p.data]} /> {/* The donut */}
        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflexionPoint[0]}
          y2={inflexionPoint[1]}
          stroke={colors[p.data]}
        />
        <circle cx={centroid[0]} cy={centroid[1]} r={3} fill={colors[p.data]} />
        <line
          x1={inflexionPoint[0]}
          y1={inflexionPoint[1]}
          x2={labelPosX}
          y2={inflexionPoint[1]}
          stroke={colors[p.data]}
        />
        <text
          style={{ cursor: "default" }}
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={inflexionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={15}
          fill={colors[p.data]}
        >
          {label}
        </text>
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g 
          transform={
            `translate( ${MARGIN.left + boundsWidth / 2}, ${MARGIN.top + boundsHeight / 2} )`
          }
        >
          {arcs}
        </g>
      </svg>
    </div>
  );
};