import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRealtimeData } from "../../features/realtimeDashboard/realtime-slice";
import { RootState, AppDispatch } from "../../store/store";
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from "recharts";
import { Typography, LinearProgress } from "@mui/material";
import { getRegionColor } from "../../utils";
import BasicCard from "../../components/shared/BasicCard";
import { getTimeAgo } from "../../utils";
import { useIntl } from "react-intl";

interface PieData {
  regionId: number;
  name: string;
  value: number;
  doctorCount: number;
  timeStamp: string;
}

const renderActiveShape = (props: any, intl: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 15;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  const textOffset = cos >= 0 ? 5 : -5;
  // Calculate text position based on angle to avoid overlapping with chart
  const textPositionX = ex + textOffset;

  // Add extra padding for top and bottom angles
  const isTopHalf = sin < 0;
  const isBottomHalf = sin > 0;
  const verticalOffset = isTopHalf ? -10 : isBottomHalf ? 10 : 0;
  const textPositionY = ey + verticalOffset;

  let patientsPerDoctorValue = 0;
  if (payload.doctorCount > 0) {
    const ratio = payload.value / payload.doctorCount;

    patientsPerDoctorValue =
      ratio % 1 === 0 ? Math.floor(ratio) : Number(ratio.toFixed(1));
  }

  const formattedPatientsPerDoctor =
    payload.doctorCount > 0
      ? intl.formatMessage(
          { id: "patients_per_doctor_ratio" },
          { ratio: patientsPerDoctorValue }
        )
      : intl.formatMessage({ id: "no_doctors" });

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fontSize="1rem"
        fontWeight="bold"
        fill="#333"
      >
        {payload.name
          .split(" ")
          .map((word: string, index: number, array: string[]) => (
            <tspan key={index} x={cx} dy={index === 0 ? 8 : 16}>
              {word}
            </tspan>
          ))}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={textPositionX}
        y={textPositionY}
        textAnchor={textAnchor}
        fill="#333"
        fontSize="0.9rem"
      >
        {intl.formatMessage({ id: "patients_per_doctor" })}:
        {formattedPatientsPerDoctor}
      </text>
      <text
        x={textPositionX}
        y={textPositionY}
        dy={18}
        textAnchor={textAnchor}
        fontSize="0.8rem"
        fill="#999"
      >
        {`${intl.formatMessage({ id: "patient_percentage" })}: ${(
          percent * 100
        ).toFixed(1)}%`}
      </text>
    </g>
  );
};

const PatientDoctorRatio: React.FC = () => {
  const { realtimeData, loading, error } = useSelector(
    (state: RootState) => state.realtimeData
  );
  const dispatch = useDispatch<AppDispatch>();
  const [activeIndex, setActiveIndex] = useState<number | 0>(0);
  const [timeAgo, setTimeAgo] = useState<string>("");
  const intl = useIntl();

  useEffect(() => {
    dispatch(fetchRealtimeData());
  }, []);

  const pieData: PieData[] = Object.keys(realtimeData)
    .map((key) => ({
      regionId: realtimeData[key].regionId,
      name: intl.formatMessage({
        id: realtimeData[key].regionName.toLowerCase().replace(/\s+/g, "_"),
      }),
      value: realtimeData[key].regionCount,
      doctorCount: realtimeData[key].regionDrCount,
      timeStamp: realtimeData[key].timestamp,
    }))
    .sort((a, b) => b.value - a.value);

  useEffect(() => {
    const updateAgo = () => {
      const newTimeAgo = getTimeAgo(pieData[activeIndex]?.timeStamp);
      setTimeAgo(newTimeAgo);
    };
    updateAgo();
    const interval = setInterval(updateAgo, 60000);

    return () => clearInterval(interval);
  }, [pieData, getTimeAgo]);

  if (loading) {
    return <LinearProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "auto",
      }}
    >
      <div
        style={{
          flexBasis: "75%",
          flexGrow: 1,
          height: "100%",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="95%"
          minWidth={200}
          minHeight={200}
        >
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={(props: any) => renderActiveShape(props, intl)}
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getRegionColor(entry?.regionId)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flexBasis: "25%", flexGrow: 1 }}>
        <BasicCard data={pieData} activeIndex={activeIndex} timeAgo={timeAgo} />
      </div>
    </div>
  );
};

export default PatientDoctorRatio;
