import { Box, Paper } from "@mui/material";
import RealtimeCount from "./RealtimeCount";
import RealtimeGraph from "./RealtimeGraph";
import RealtimeMap from "./RealtimeMap";
import { Typography } from "@mui/material";
import { useIntl } from "react-intl";

const RealtimeDashboard = () => {
  const intl = useIntl();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", height: "100%" }}>
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          pr: { md: 2 },
          mb: { xs: 2, md: 0 },
        }}
      >
        <Paper sx={{ height: "100%", p: 2 }}>
          <RealtimeMap />
        </Paper>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ mb: 2, height: "50%" }}>
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
        </Box>

        <Box sx={{ height: "50%" }}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default RealtimeDashboard;
