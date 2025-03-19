import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import PatientsCard from "./PatientsCard";
import PatientsTable from "./PatientsTable";
import SearchFilter from "../../components/shared/SearchFilter";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { selectPatient } from "../../features/patients/patient-slice";

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { patients, selectedPatientId } = useSelector(
    (state: RootState) => state.patients
  );

  React.useEffect(() => {
    if (!selectedPatientId && Object.keys(patients).length > 0) {
      dispatch(selectPatient(Object.keys(patients)[0]));
    }
  }, [dispatch, patients, selectedPatientId]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}
    >
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        label="Search Patients"
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
            width: { xs: "100%", md: "33.3%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <PatientsCard selectedPatientId={selectedPatientId} />
          </Paper>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "66.7%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <PatientsTable
              searchTerm={searchTerm}
              onSelectPatient={(id) => dispatch(selectPatient(id))}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Patients;
