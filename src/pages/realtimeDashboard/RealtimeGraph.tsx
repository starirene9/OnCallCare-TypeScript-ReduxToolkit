import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchRealtimeHistoryData } from "../../features/realtimeDashboard/realtime-history-slice";
import { Typography, LinearProgress } from "@mui/material";
import { HEATMAP_COLORS } from "../../utils";

const PatientHistoryGraph: React.FC = () => {
  const { realtimeHistoryData, loading, error } = useSelector(
    (state: RootState) => state.realtimeHistoryData
  );

  const [chartData, setChartData] = useState<
    { time: string; formattedTime: string; [key: string]: number | string }[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRealtimeHistoryData());

    const interval = setInterval(() => {
      // console.log("It runs every 1 min!");
      dispatch(fetchRealtimeHistoryData());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (realtimeHistoryData && Object.keys(realtimeHistoryData).length > 0) {
      const regionIds = Object.keys(realtimeHistoryData);
      const startTime = new Date(realtimeHistoryData["R1"]?.timestamp[0]);
      const endTime = new Date(realtimeHistoryData["R1"]?.timestamp[1]);
      const timestamps: { time: string; formattedTime: string }[] = [];

      for (let t = startTime.getTime(); t <= endTime.getTime(); t += 60000) {
        timestamps.push({
          time: new Date(t).toISOString().slice(0, 16).replace("T", " "),
          formattedTime: new Date(t).toISOString().slice(11, 16),
        });
      }

      const transformedData = timestamps.map((timestamp, index) => {
        const dataPoint: {
          time: string;
          formattedTime: string;
          [key: string]: number | string;
        } = {
          time: timestamp?.time,
          formattedTime: timestamp?.formattedTime,
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

  interface CustomTooltipPayload {
    color?: string;
    name?: string;
    value?: number;
    payload?: { timestamp?: string };
  }

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius: "4px",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
            {payload[0]?.payload?.time ?? "N/A"}
          </p>
          <hr
            style={{
              margin: "4px 0",
              border: "0",
              borderTop: "1px solid #ccc",
            }}
          />
          {(payload as CustomTooltipPayload[])
            .slice()
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map((entry, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                {entry.color && (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: entry.color,
                      marginRight: "8px",
                    }}
                  />
                )}
                <span style={{ color: "black" }}>
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
        </div>
      );
    }

    return null;
  };

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
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: -2, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="formattedTime"
          tickSize={8}
          includeHidden
          interval="preserveStartEnd"
        />
        <YAxis />
        {/* <Tooltip
          labelStyle={{ fontWeight: "bold" }}
          labelFormatter={(label) => (
            <div>
              <span style={{ fontWeight: "bold" }}>{label}</span>
              <hr
                style={{
                  margin: "4px 0",
                  border: "0",
                  borderTop: "1px solid #ccc",
                }}
              />
            </div>
          )}
          contentStyle={{
            paddingLeft: "22px",
            paddingRight: "22px",
            paddingBottom: "5px",
          }}
          itemStyle={{ border: "1px solid red" }}
          itemSorter={(item) => -(item?.value ?? 0)}
        /> */}
        <Tooltip content={<CustomTooltip />} />
        {Object.keys(realtimeHistoryData).map((regionId, index) => (
          <Line
            key={regionId}
            type="monotone"
            dataKey={regionId}
            stroke={HEATMAP_COLORS[index % HEATMAP_COLORS.length]}
            strokeWidth={2}
            dot={false}
            name={realtimeHistoryData[regionId].regionName}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PatientHistoryGraph;
