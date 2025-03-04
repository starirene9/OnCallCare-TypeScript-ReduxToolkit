import { Grid, Paper } from "@mui/material";
import RealtimeCount from "./RealtimeCount";
import RealtimeGraph from "./RealtimeGraph";
import RealtimeMap from "./RealtimeMap";

const RealtimeDashboard = () => {
  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ height: "100%", p: 2 }}>
          <RealtimeMap />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} container spacing={2} direction="column">
        <Grid item xs={6}>
          <Paper sx={{ height: "100%", p: 2 }}>
            <RealtimeCount />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ height: "100%", p: 2 }}>
            <RealtimeGraph />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RealtimeDashboard;
