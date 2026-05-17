export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, name, xValue, height, placement} = interactionData;

  return (
    <div
      className="tooltip"
      style={{
        left: xPos,
        top: yPos,
        transform:
          placement === "left" ? "translateX(-120%)" : "translateX(20%)",
      }}
    >
      <b>{name}</b>
      <p>{"x: " + xValue}</p>
    </div>
  );
};
