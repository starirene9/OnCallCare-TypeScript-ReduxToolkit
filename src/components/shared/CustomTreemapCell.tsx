import { getRegionColor } from "../../utils";

export const CustomTreemapCell = (props: any) => {
  const { x, y, width, height, regionId, name, size } = props;
  const color = getRegionColor(regionId);

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
            fontSize={18}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 18} //
            textAnchor="middle"
            fill="white"
            fontSize={16}
          >
            {size}
          </text>
        </>
      )}
    </g>
  );
};
