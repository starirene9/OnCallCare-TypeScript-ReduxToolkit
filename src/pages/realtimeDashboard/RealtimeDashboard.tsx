import { Grid, Paper } from "@mui/material";
import RealtimeCount from "./RealtimeCount";
import RealtimeGraph from "./RealtimeGraph";
import RealtimeMap from "./RealtimeMap";
import { Typography } from "@mui/material";

const RealtimeDashboard = () => {
  return (
    <Grid container sx={{ height: "100%" }}>
      <Grid item xs={12} md={6} sx={{ pr: 2 }}>
        <Paper sx={{ height: "100%", p: 2 }}>
          <RealtimeMap />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        container
        direction="column"
        sx={{ height: "100%" }}
      >
        <Grid item xs={7} sx={{ mb: 2 }}>
          <Paper
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Real-time Patients-to-Doctors Ratio
            </Typography>
            <RealtimeCount />
          </Paper>
        </Grid>
        <Grid item sx={{ height: "calc(100% * 5 / 12 - 16px)" }}>
          <Paper
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Patient Visit History
            </Typography>
            <RealtimeGraph />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RealtimeDashboard;
