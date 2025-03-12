import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRealtimeData } from "../../features/realtimeDashboard/realtime-slice";
import { RootState, AppDispatch } from "../../store/store";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { LinearProgress, Typography } from "@mui/material";
import { CustomTreemapCell } from "../../components/shared/CustomTreemapCell";
import { useIntl } from "react-intl";

const TreemapChart = () => {
  const intl = useIntl();
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
      regionId: realtimeData[key].regionId,
      name: intl.formatMessage({
        id: realtimeData[key].regionName.toLowerCase(),
      }),
      size: realtimeData[key].regionCount,
    }))
    .sort((a, b) => b.size - a.size);

  console.log("treemapData", treemapData);
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
        isAnimationActive={false}
        content={<CustomTreemapCell />}
      >
        <Tooltip
          contentStyle={{
            fontSize: "12px",
            padding: "7px",
            borderRadius: "4px",
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreemapChart;
