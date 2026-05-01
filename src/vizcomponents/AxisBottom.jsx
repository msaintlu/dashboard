
export const AxisBottom = (
    { xScale, pixelsPerTick, boundsHeight, label, grid=false, TICK_LENGTH=4, axisLine=true }) => {
    
    const range = xScale.range();
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return (
        <>
            {axisLine && ( <line x1={range[0]} x2={range[1]} stroke="grey"/> )}
            {xScale.ticks(numberOfTicksTarget).map((value) => (
                <g key={value} transform={`translate(${xScale(value)}, 0)`}>
                    {/* Grid line */}
                    {grid && ( <line y2={-boundsHeight} stroke="lightgrey" opacity={0.5}/> )}
                    {/* Tick */}
                    {axisLine && ( <line y2={TICK_LENGTH} stroke="grey" /> )}
                    <text
                        style={{
                            fontSize: "14px",
                            textAnchor: "middle",
                            transform: "translateY(22px)",
                            fill: "grey",
                        }}
                    >
                        {value}
                    </text>
                </g>
            ))}
            {/* Axis title */}
            {label && (
                <text
                    x={width / 2}
                    y={65}
                    fontSize={20}
                    textAnchor="middle"
                    fill="grey"
                >
                    {label}
                </text>
            )}
        </>
    );
};
