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
import FormControlLabelPosition from "../../components/shared/Switch";
import { useIntl } from "react-intl";

const PatientHistoryGraph: React.FC = () => {
  const intl = useIntl();
  const { realtimeHistoryData, loading, error } = useSelector(
    (state: RootState) => state.realtimeHistoryData
  );

  const [chartData, setChartData] = useState<
    { time: string; formattedTime: string; [key: string]: number | string }[]
  >([]);

  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRealtimeHistoryData());

    const interval = setInterval(() => {
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

        if (checked) {
          const totalPatients = regionIds.reduce((sum, regionId) => {
            const countArray = realtimeHistoryData[regionId]?.regionCount;
            return (
              sum +
              (countArray && countArray[index] !== null ? countArray[index] : 0)
            );
          }, 0);
          dataPoint["Total Patients"] = totalPatients; // ✅ 총합 데이터 추가
        } else {
          regionIds.forEach((regionId) => {
            const countArray = realtimeHistoryData[regionId]?.regionCount;
            dataPoint[regionId] =
              countArray && countArray[index] !== null ? countArray[index] : 0;
          });
        }

        return dataPoint;
      });

      setChartData(transformedData);
    }
  }, [realtimeHistoryData, checked]); // ✅ checked 값이 변경될 때마다 업데이트

  interface CustomTooltipProps extends TooltipProps<number, string> {
    checked: boolean;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    checked,
  }) => {
    if (!active || !payload || payload.length === 0) return null;

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

        {checked ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-dark-blue)",
                  marginRight: "8px",
                }}
              />
              <span style={{ color: "black" }}>
                {intl.formatMessage({ id: "total_patients" })}:{" "}
                {payload[0]?.value}
              </span>
            </div>
          </div>
        ) : (
          payload
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
                  {intl.formatMessage({
                    id: entry.name
                      ? entry.name.replace(/\s+/g, "_").toLowerCase()
                      : "unknown",
                  })}
                  : {entry.value}
                </span>
              </div>
            ))
        )}
      </div>
    );
  };

  if (loading) {
    return <LinearProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "20px",
        }}
      >
        <FormControlLabelPosition
          name={intl.formatMessage({ id: "total_patients" })}
          checked={checked}
          handleChange={handleChange}
          labelStyle={{ fontSize: "0.8rem", color: "var(--color-gray)" }}
        />
      </div>
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
          <Tooltip content={<CustomTooltip checked={checked} />} />
          {checked ? (
            <Line
              type="monotone"
              dataKey="Total Patients"
              stroke="var(--color-dark-blue)"
              strokeWidth={2}
              dot={false}
              name={intl.formatMessage({ id: "total_patients" })}
            />
          ) : (
            Object.keys(realtimeHistoryData).map((regionId, index) => (
              <Line
                key={regionId}
                type="monotone"
                dataKey={regionId}
                stroke={HEATMAP_COLORS[index % HEATMAP_COLORS.length]}
                strokeWidth={2}
                dot={false}
                name={intl.formatMessage({
                  id: realtimeHistoryData[regionId].regionName
                    .replace(/\s+/g, "_")
                    .toLowerCase(),
                })}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default PatientHistoryGraph;
