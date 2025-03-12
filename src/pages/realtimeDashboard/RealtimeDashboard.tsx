import { Grid, Paper } from "@mui/material";
import RealtimeCount from "./RealtimeCount";
import RealtimeGraph from "./RealtimeGraph";
import RealtimeMap from "./RealtimeMap";
import { Typography } from "@mui/material";
import { useIntl } from "react-intl";

const RealtimeDashboard = () => {
  const intl = useIntl();

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
        <Grid item xs={6} sx={{ mb: 2 }}>
          <Paper
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 2, color: "var(--color-navy)" }}
            >
              {intl.formatMessage({ id: "realtime_ratio" })}
            </Typography>
            <RealtimeCount />
          </Paper>
        </Grid>
        <Grid item sx={{ height: "calc(100% * 6 / 12 - 17px)" }}>
          <Paper
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, color: "var(--color-navy)" }}
            >
              {intl.formatMessage({ id: "patient_history" })}
            </Typography>
            <RealtimeGraph />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RealtimeDashboard;
