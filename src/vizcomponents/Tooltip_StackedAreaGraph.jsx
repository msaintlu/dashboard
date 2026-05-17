export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, name, xValue, yValues, height, placement, yCats, colors, labels} = interactionData;

  return (
    <div
      className="tooltip"
      style={{
        left: xPos,
        top: 0,
        transform:
          placement === "left" ? "translateX(-110%)" : "translateX(10%)",
      }}
    >
      <div className="tooltip-title">
        <b>{name}</b>
      </div>
      {yCats.map((c, i) => (
        <div className="tooltip-content" style={{ borderColor: colors[c] }}>
          <div className="tooltip-row">
            <span> {labels[c]} </span>
            <b> {yValues[0][c].percentage + " %"} </b>
          </div>
        </div>
      ))}
    </div>
  );
};
