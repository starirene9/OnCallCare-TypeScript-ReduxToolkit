import React, { useState } from "react";
import { Grid, Paper, TextField } from "@mui/material";
import PatientsCard from "./PatientsCard";
import PatientsRoutes from "./PatientsRoutes";

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Grid container spacing={2} sx={{ height: "100%" }}>
      <Grid item xs={12}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Search Patients"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={4} sx={{ height: "calc(100% - 30px)" }}>
        <Paper sx={{ p: 2, height: "calc(100% - 30px)" }}>
          <PatientsCard searchTerm={searchTerm} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} sx={{ height: "calc(100% - 30px)" }}>
        <Paper sx={{ p: 2, height: "calc(100% - 30px)" }}>
          <PatientsRoutes searchTerm={searchTerm} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Patients;
