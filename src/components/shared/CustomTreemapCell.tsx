import { getHeatmapColor } from "../../utils";

export const CustomTreemapCell = (props: any) => {
  const { x, y, width, height, name, size, root } = props;
  const minSize = Math.min(...root.children.map((d: any) => d.size));
  const maxSize = Math.max(...root.children.map((d: any) => d.size));
  const color = getHeatmapColor(size, minSize, maxSize);

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
