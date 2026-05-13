export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, name, xValue, height} = interactionData;

  return (
    <div
      className="tooltip"
      style={{
        left: xPos,
        top: yPos,
      }}
    >
      <b>{name}</b>
      <p>{"x: " + xValue}</p>
    </div>
  );
};
