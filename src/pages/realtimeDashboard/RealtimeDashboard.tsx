import { Grid, Paper } from "@mui/material";
import RealtimeCount from "./RealtimeCount";
import RealtimeGraph from "./RealtimeGraph";
import RealtimeMap from "./RealtimeMap";
import { Typography } from "@mui/material";

const RealtimeDashboard = () => {
  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ height: "100%", p: 2 }}>
          <RealtimeMap />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        container
        spacing={2}
        direction="column"
        sx={{ height: "100%" }}
      >
        <Grid item xs={6} sx={{ height: "50%" }}>
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
        <Grid item xs={6} sx={{ height: "50%" }}>
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
