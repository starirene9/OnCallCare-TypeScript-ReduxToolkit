import { HEATMAP_COLORS } from "../../utils";

export const CustomTreemapCell = (props: any) => {
  const { x, y, width, height, name, size, index } = props;
  const color = HEATMAP_COLORS[index % HEATMAP_COLORS.length];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#fff"
      />
      {width > 50 && height > 20 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 14} //
            textAnchor="middle"
            fill="white"
            fontSize={12}
          >
            {size}
          </text>
        </>
      )}
    </g>
  );
};
