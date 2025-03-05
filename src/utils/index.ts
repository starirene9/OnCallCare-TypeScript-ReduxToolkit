export const HEATMAP_COLORS = [
  "#0000FF", // 1. 파랑 (최소값)
  "#1E90FF", // 2. 푸른색
  "#00BFFF", // 3. 하늘색
  "#32CD32", // 4. 초록
  "#ADFF2F", // 5. 연두
  "#FFD700", // 6. 노랑
  "#FFA500", // 7. 노랑-주황
  "#FF8C00", // 8. 주황
  "#FF4500", // 9. 주황-빨강
  "#FF0000", // 10. 빨강 (최대값)
];

export const getHeatmapColor = (value: number, min: number, max: number) => {
  if (max === min) return HEATMAP_COLORS[HEATMAP_COLORS.length - 1];

  const step = (max - min) / (HEATMAP_COLORS.length - 1);
  const index = Math.min(
    HEATMAP_COLORS.length - 1,
    Math.floor((value - min) / step)
  );

  return HEATMAP_COLORS[index];
};
