import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import PatientsCard from "./PatientsCard";
import PatientsTable from "./PatientsTable";
import SearchFilter from "../../components/shared/SearchFilter";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { selectPatient } from "../../features/patients/patient-slice";
import { useIntl } from "react-intl";
import P001 from "../../assets/patient1.png";
import P002 from "../../assets/patient2.jpeg";
import P003 from "../../assets/patient3.png";
import P004 from "../../assets/patient4.jpeg";
import P005 from "../../assets/patient5.jpeg";

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { patients, selectedPatientId } = useSelector(
    (state: RootState) => state.patients
  );
  const patientImages = { P001, P002, P003, P004, P005 };
  const intl = useIntl();
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
        label={intl.formatMessage({ id: "search_patients" })}
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
            width: { xs: "100%", md: "25%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <PatientsCard
              selectedPatientId={selectedPatientId}
              patientImages={patientImages}
            />
          </Paper>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "75%" },
            height: { xs: "50%", md: "100%" },
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <PatientsTable
              searchTerm={searchTerm}
              patientImages={patientImages}
              onSelectPatient={(id) => dispatch(selectPatient(id))}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Patients;
