import React from "react";
import { Grid, Paper, TextField } from "@mui/material";
import EmergencyBroadcastForm from "./EmergencyBroadcastForm";
import EmergencyBroadcastTTS from "./EmergencyBroadcastTTS";
import EmergencyBroadcastTable from "./EmergencyBroadcastTable";

const EmergencyBroadcast = () => {
  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ height: "100%", p: 2 }}>
          <EmergencyBroadcastTable />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: "100%", p: 2 }}>
          <EmergencyBroadcastForm />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmergencyBroadcast;
