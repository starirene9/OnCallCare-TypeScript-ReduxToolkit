import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchRealtimeHistoryData } from "../../features/realtimeDashboard/realtime-history-slice";
import { Typography, LinearProgress } from "@mui/material";

const PatientHistoryGraph: React.FC = () => {
  const { realtimeHistoryData, loading, error } = useSelector(
    (state: RootState) => state.realtimeHistoryData
  );

  // console.log("realtimeHistoryData", realtimeHistoryData);

  const [chartData, setChartData] = useState<
    { timestamp: string; [key: string]: number | string }[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRealtimeHistoryData());
  }, [dispatch]);

  useEffect(() => {
    if (realtimeHistoryData && Object.keys(realtimeHistoryData).length > 0) {
      const regionIds = Object.keys(realtimeHistoryData);
      const firstRegion = realtimeHistoryData[regionIds[0]]; // 첫 번째 region 가져오기

      if (!firstRegion || !firstRegion.timestamp) return;

      const startTime = new Date(firstRegion.timestamp[0]); // 첫 번째 region의 시작 시간 사용
      const endTime = new Date(firstRegion.timestamp[1]); // 첫 번째 region의 끝 시간 사용
      const timestamps: string[] = [];

      for (let t = startTime.getTime(); t <= endTime.getTime(); t += 60000) {
        timestamps.push(new Date(t).toISOString());
      }

      const transformedData = timestamps.map((time, index) => {
        const formattedTime = time.slice(0, 16).replace("T", " ");
        const dataPoint: { timestamp: string; [key: string]: number | string } =
          {
            timestamp: formattedTime,
          };

        regionIds.forEach((regionId) => {
          const countArray = realtimeHistoryData[regionId]?.regionCount;
          dataPoint[regionId] =
            countArray && countArray[index] !== null ? countArray[index] : 0;
        });

        return dataPoint;
      });

      setChartData(transformedData);
    }
  }, [realtimeHistoryData]);

  if (loading) {
    return <LinearProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={200}
      minHeight={200}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(time) => time.slice(11, 16)}
        />
        <YAxis />
        <Tooltip />
        {Object.keys(realtimeHistoryData).map((regionId, idx) => (
          <Line
            key={regionId}
            type="monotone"
            dataKey={regionId}
            stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`} // 자동 색상 지정
            strokeWidth={2}
            name={realtimeHistoryData[regionId].regionName}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PatientHistoryGraph;
