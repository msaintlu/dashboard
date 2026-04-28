
export const AxisBottom = (
    { xScale, pixelsPerTick, boundsHeight, label, grid=false, TICK_LENGTH=4 }) => {
    
    const range = xScale.range();
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return (
        <>
            <line x1={range[0]} x2={range[1]} stroke="black"/>
            {xScale.ticks(numberOfTicksTarget).map((value) => (
                <g key={value} transform={`translate(${xScale(value)}, 0)`}>
                    {/* Grid line */}
                    {grid && ( <line y2={-boundsHeight} stroke="lightgrey" opacity={0.5}/> )}
                    {/* Tick */}
                    <line y2={TICK_LENGTH} stroke="black" />
                    <text
                        style={{
                            fontSize: "14px",
                            textAnchor: "middle",
                            transform: "translateY(22px)",
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
                >
                    {label}
                </text>
            )}
        </>
    );
};
