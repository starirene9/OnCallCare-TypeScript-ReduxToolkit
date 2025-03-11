export const HEATMAP_COLORS = [
  "#DC143C", // 1. 크림슨 (붉은 계열)
  "#104E8B", // 2. 어두운 푸른색 (파랑 계열)
  "#A52A2A", // 3. 브라운 (갈색 계열)
  "#1E90FF", // 4. 도드라지는 푸른색 (밝은 파랑)
  "#8B4513", // 5. 새들 브라운 (갈색 계열)
  "#00008B", // 6. 진한 파랑 (어두운 파랑)
  "#FF4500", // 7. 진한 주황-빨강 (주황 계열)
  "#006400", // 8. 진한 초록 (녹색 계열)
  "#B22222", // 9. 불타는 빨강 (붉은 계열)
  "#FFD700", // 10. 황금색 (노랑 계열)
];

export const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now.getTime() - time.getTime()) / 1000); // 초 단위 차이

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 3600)} hours ago`;
};
