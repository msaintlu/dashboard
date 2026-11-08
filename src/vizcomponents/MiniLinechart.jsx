import * as d3 from "d3";

export const MiniLinechart = ({ width, height, data, energyType, color }) => {
  if (data.length === 0) {
    return null;
  }

  const boundsHeight = height - 20;
  const [firstYear, lastYear] = d3.extent(data, (item) => item.year);
  const maxValue = d3.max(data, (item) => item[energyType]) || 0;
  const xDomain = firstYear === lastYear
    ? [firstYear - 1, lastYear + 1]
    : [firstYear, lastYear];
  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([4, width - 4]);
  const yScale = d3.scaleLinear()
    .domain([0, maxValue || 1])
    .nice()
    .range([boundsHeight, 4]);
  const linePath = d3.line()
    .x((item) => xScale(item.year))
    .y((item) => yScale(item[energyType]))(data);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={`Utilisation de ${energyType} en PWh de ${firstYear} à ${lastYear}`}
    >
      <g>
        {/* Un axe horizontal avec uniquement la première et la dernière année. */}
        <path
          d={linePath}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
        <line x1={4} x2={width - 4} y1={boundsHeight} y2={boundsHeight} stroke="grey" strokeWidth={0.5} />
        <text x={4} y={height - 3} fontSize={11} fill="grey" textAnchor="start">
          {firstYear}
        </text>
        {lastYear !== firstYear && (
          <text x={width - 4} y={height - 3} fontSize={11} fill="grey" textAnchor="end">
            {lastYear}
          </text>
        )}
      </g>
    </svg>
  );
};