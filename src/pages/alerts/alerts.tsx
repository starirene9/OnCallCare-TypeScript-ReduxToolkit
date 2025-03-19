import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import AlertTable from "./AlertTable";
import AlertForm from "./AlertForm";
import SearchFilter from "../../components/shared/SearchFilter";

const Alerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}
    >
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        label="Search by patient or doctor's name"
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "calc(100% - 30px)",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "66.7%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <AlertTable searchTerm={searchTerm} />
          </Paper>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "33.3%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <AlertForm searchTerm={searchTerm} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Alerts;
