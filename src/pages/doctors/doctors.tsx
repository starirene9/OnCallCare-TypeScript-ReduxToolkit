import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import DoctorsTable from "./DoctorsTable";
import DoctorsCalender from "./DoctorsCalender";
import SearchFilter from "../../components/shared/SearchFilter";

const Doctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}
    >
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        label="Search Doctors"
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
            <DoctorsTable searchTerm={searchTerm} />
          </Paper>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "33.3%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <DoctorsCalender searchTerm={searchTerm} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Doctors;
