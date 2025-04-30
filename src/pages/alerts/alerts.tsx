import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import AlertTable from "./AlertTable";
import NavigationDiagram from "./NavigationDiagram";
import SearchFilter from "../../components/shared/SearchFilter";
import P001 from "../../assets/patient1.png";
import P002 from "../../assets/patient2.jpeg";
import P003 from "../../assets/patient3.png";
import P004 from "../../assets/patient4.jpeg";
import P005 from "../../assets/patient5.jpeg";

const Alerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const patientImages = { P001, P002, P003, P004, P005 };
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
            <AlertTable
              searchTerm={searchTerm}
              onSelectPatient={(id) => setSelectedId(id)}
              patientImages={patientImages}
            />
          </Paper>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "33.3%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <NavigationDiagram
              searchTerm={searchTerm}
              onSelectPatient={(id) => setSelectedId(id)}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Alerts;
