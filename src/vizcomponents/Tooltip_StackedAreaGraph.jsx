export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, name, xValue, color} = interactionData;

  return (
    <div
      className="tooltip"
      style={{
        left: xPos,
        top: yPos,
        borderColor: color,
      }}
    >
      <b>{name}</b>
      <p>{"x: " + xValue}</p>
    </div>
  );
};
