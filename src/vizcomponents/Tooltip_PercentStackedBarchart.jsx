import { MiniLinechart } from "./MiniLinechart";

export const Tooltip_PercentStackedBarchart = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const {
    xPos,
    yPos,
    energyType,
    country,
    placement,
    historyData,
    colors,
    margin,
    chartWidth,
  } = interactionData;
  const tooltipWidth = 260;
  const anchorX = xPos + margin.left;
  const maxLeft = Math.max(margin.left, chartWidth - tooltipWidth);
  const tooltipLeft = energyType === "coal"
    ? margin.left
    : Math.max(margin.left, Math.min(anchorX - tooltipWidth / 2, maxLeft));
  const top = yPos + margin.top;
  const verticalTransform = placement === "above"
    ? "translateY(calc(-100% - 8px))"
    : "translateY(8px)";

  return (
    <div
      className="tooltip percent-stacked-tooltip"
      style={{
        left: tooltipLeft,
        top,
        transform: verticalTransform,
      }}
    >
      <div className="tooltip-title">
        <b>{country} · {energyType}</b>
      </div>
      <div className="tooltip-content tooltip-content-no-marker">
        <div className="tooltip-row">
          <span>Energy use</span>
          <b>PWh</b>
        </div>
        <MiniLinechart
          width={220}
          height={88}
          data={historyData}
          energyType={energyType}
          color={colors[energyType]}
        />
      </div>
    </div>
  );
};

