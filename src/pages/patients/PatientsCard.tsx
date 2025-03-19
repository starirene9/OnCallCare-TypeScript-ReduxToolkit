import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  Stack,
  LinearProgress,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useEffect } from "react";
import { fetchPatientsData } from "../../features/patients/patient-slice";

interface PatientCardProps {
  searchTerm?: string;
  selectedPatientId?: string | null;
}

const PatientsCard: React.FC<PatientCardProps> = ({
  searchTerm,
  selectedPatientId,
}) => {
  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPatientsData());
  }, []);

  const patient = selectedPatientId ? patients[selectedPatientId] : null;

  if (loading) {
    return <LinearProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!patient) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No patient selected
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" component="div" gutterBottom>
          Patient Information
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 2 }}
            alt={patient.name}
            src={patient.photo}
          />
          <Box>
            <Typography variant="h6">{patient.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.age} years • {patient.gender}
            </Typography>
            <Chip
              size="small"
              color="primary"
              label={patient.id}
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Admission Reason
            </Typography>
            <Typography variant="body1">{patient.admissionReason}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <MedicalServicesIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Attending Physician
              </Typography>
              <Typography variant="body1">{patient.doctor.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {patient.doctor.specialty}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <AccessTimeIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Next Appointment
              </Typography>
              <Typography variant="body1">{patient.nextAppointment}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={patient.status}
              color={getStatusColor(patient.status) as any}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Helper function to determine status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "critical":
      return "error";
    case "stable":
      return "success";
    case "admitted":
      return "primary";
    case "recovery":
      return "warning";
    case "discharged":
      return "default";
    default:
      return "default";
  }
};

export default PatientsCard;
