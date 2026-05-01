
export const AxisLeft = (
    { yScale, pixelsPerTick, boundsWidth, label, units, grid = false, TICK_LENGTH = 4, axisLine=true }) => {
    
    const range = yScale.range();
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return (
        <>
            {axisLine && ( <line y1={range[0]} y2={range[1]} stroke="grey"/> )}
            {yScale.ticks(numberOfTicksTarget).map((value) => (
                <g key={value} transform={`translate(0, ${yScale(value)})`}>
                    {/* Grid line */}
                    {grid && ( <line x2={boundsWidth} stroke="lightgrey" opacity={0.5} /> )}
                    {/* Tick */}
                    {axisLine && ( <line x2={- TICK_LENGTH} stroke="grey" /> )}
                    <text
                        style={{
                            fontSize: "14px",
                            textAnchor: "end",
                            dominantBaseline: "middle",
                            transform: "translateX(-10px)",
                            fill: "grey",
                        }}
                    >
                        {value}
                    </text>
                </g>
            ))}
            {/* Axis title — rotated 90° */}
            {label && (
                <text
                    x={-height / 2}
                    y={- 50}
                    fontSize={20}
                    textAnchor="middle"
                    transform="rotate(-90)"
                    fill="grey"
                >
                    {label}
                </text>
            )}
            {/* Axis Units */}
            {units && (
                <text
                    x={10}
                    y={0}
                    fontSize={14}
                    fill="grey"
                >
                    {units}
                </text>
            )}
        </>
    );
};
