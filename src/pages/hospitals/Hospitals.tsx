import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import HospitalsCard from "./HospitalsCard";
import HospitalsMap from "./HospitalsMap";

const Hospitals = () => {
  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ height: "100%", p: 2 }}>
          <HospitalsMap />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: "100%", p: 2 }}>
          <HospitalsCard />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Hospitals;
