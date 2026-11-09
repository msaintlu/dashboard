import { MiniLinechart } from "./MiniLinechart";

export const Tooltip_PercentStackedBarchart = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const {
    xPos,
    yPos,
    barHeight,
    barGap,
    energyType,
    country,
    placement,
    historyData,
    colors,
    margin,
    chartWidth,
  } = interactionData;

  const tooltipWidth = 260;
  const tooltipPaddingLeft = 12;
  const anchorX = xPos + margin.left;
  const maxLeft = Math.max(margin.left, chartWidth - tooltipWidth);
  const tooltipLeft = energyType === "coal"
    ? margin.left
    : Math.max(margin.left, Math.min(anchorX - tooltipWidth / 2, maxLeft));
  const barEdgeOffset = barHeight / 2;
  const arrowOverlap = 2;
  const top = yPos + margin.top + (placement === "above"
    ? -barEdgeOffset + arrowOverlap
    : barEdgeOffset - arrowOverlap);
  const verticalTransform = placement === "above"
    ? "translateY(calc(-100% - var(--tooltip-arrow-depth)))"
    : "translateY(var(--tooltip-arrow-depth))";

  return (
    <div
      className={`tooltip percent-stacked-tooltip placement-${placement}`}
      style={{
        left: tooltipLeft,
        top,
        transform: verticalTransform,
        width: tooltipWidth,
        padding: `8px ${tooltipPaddingLeft}px`,
        "--tooltip-arrow-depth": `${barGap + arrowOverlap}px`,
        "--tooltip-arrow-height": `${2 * (barGap + arrowOverlap)}px`,
      }}
    >
      <div className="tooltip-title">
        <b>{country} · {energyType}</b>
      </div>
      <div className="tooltip-content tooltip-content-no-marker">
        <div className="tooltip-row">
          <span>Energy use</span>
          <span>PWh</span>
        </div>
        <MiniLinechart
          width={tooltipWidth-tooltipPaddingLeft-tooltipPaddingLeft}
          height={88}
          data={historyData}
          energyType={energyType}
          color={colors[energyType]}
          MARGIN={{top: 3, bottom: 15}}
        />
      </div>
    </div>
  );
};

