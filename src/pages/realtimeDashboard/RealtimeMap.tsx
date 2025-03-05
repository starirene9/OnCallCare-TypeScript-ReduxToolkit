import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRealtimeData } from "../../features/realtimeDashboard/realtime-slice";
import { RootState, AppDispatch } from "../../store/store";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { LinearProgress, Typography } from "@mui/material";
import { CustomTreemapCell } from "../../components/shared/CustomTreemapCell";

const TreemapChart = () => {
  const { realtimeData, loading, error } = useSelector(
    (state: RootState) => state.realtimeData
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRealtimeData());
  }, []);

  if (loading) {
    return <LinearProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const treemapData = Object.keys(realtimeData)
    .map((key) => ({
      name: realtimeData[key].regionName,
      size: realtimeData[key].regionCount,
    }))
    .sort((a, b) => b.size - a.size);

  console.log("treemap", treemapData);
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={200}
      minHeight={200}
    >
      <Treemap
        data={treemapData}
        dataKey="size"
        nameKey="name"
        stroke="#fff"
        fill="#8884d8"
        content={<CustomTreemapCell />}
      >
        <Tooltip
          contentStyle={{
            fontSize: "12px",
            padding: "7px",
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreemapChart;
