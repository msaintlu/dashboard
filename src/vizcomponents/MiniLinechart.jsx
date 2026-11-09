import * as d3 from "d3";

export const MiniLinechart = ({ width, height, data, energyType, color, MARGIN }) => {
  if (data.length === 0) {
    return null;
  }

  const boundsHeight = height - MARGIN.bottom - MARGIN.top;
  const boundsWidth = width

  const [firstYear, lastYear] = d3.extent(data, (d) => d.year);
  const maxValue = d3.max(data, (d) => d[energyType]);

  const xScale = d3.scaleLinear()
    .domain([firstYear, lastYear])
    .range([0, boundsWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([boundsHeight, 0]);

  const linePath = d3.line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d[energyType]))(data);

  return (
    <svg
      width={width}
      height={height}
    >
      <g transform={`translate(0,${MARGIN.top})`}>
        <path
          d={linePath}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
        <line x2={boundsWidth} y1={boundsHeight} y2={boundsHeight} stroke="grey" strokeWidth={0.5} />
        <text x={0} y={height - 3} fontSize={11} fill="grey" textAnchor="start">
          {firstYear}
        </text>
        <text x={boundsWidth} y={height - 3} fontSize={11} fill="grey" textAnchor="end">
          {lastYear}
        </text>
      </g>
    </svg>
  );
};