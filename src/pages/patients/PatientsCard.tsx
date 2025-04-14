import React, { useEffect } from "react";
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
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import ReplayIcon from "@mui/icons-material/Replay";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchPatientsData } from "../../features/patients/patient-slice";
import { getStatusColor } from "../../utils";
import { useIntl } from "react-intl";

interface PatientCardProps {
  selectedPatientId?: string | null;
  patientImages: Record<string, string>;
}

const PatientsCard: React.FC<PatientCardProps> = ({
  selectedPatientId,
  patientImages,
}) => {
  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );

  const dispatch = useDispatch<AppDispatch>();
  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchPatientsData());
  }, [dispatch]);

  const patient = selectedPatientId ? patients[selectedPatientId] : null;

  if (loading) {
    return <LinearProgress aria-label="Loading patient information" />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          startIcon={<ReplayIcon />}
          variant="outlined"
          color="primary"
          onClick={() => dispatch(fetchPatientsData())}
          sx={{ mt: 1 }}
        >
          {intl.formatMessage({ id: "try_again" })}
        </Button>
      </Box>
    );
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
          {intl.formatMessage({ id: "no_patient_selected" })}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 1 : 0,
        }}
      >
        <Typography variant="subtitle1" component="div">
          {intl.formatMessage({ id: "patient_information" })}
        </Typography>

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "auto",
            }}
          >
            <Tooltip title={intl.formatMessage({ id: "view_patient_history" })}>
              <IconButton
                size="small"
                aria-label="View patient history"
                onClick={() => console.log("View patient history")}
              >
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Card sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
            mb: 2,
            gap: 2,
          }}
        >
          {!isMobile && (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                border: "2px solid",
                borderColor: "grey.400",
              }}
              alt={patient.name}
              src={patientImages[patient.id] || patient.photo}
            />
          )}
          <Box sx={{ flexGrow: 1, width: isMobile ? "100%" : "auto" }}>
            <Typography variant={isMobile ? "h6" : "h5"}>
              {patient.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${patient.age} ${intl.formatMessage({
                id: "years",
              })} • ${intl.formatMessage({
                id: `gender_${patient.gender.toLowerCase()}`,
              })}`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "center" : "flex-start",
                mt: 1,
                gap: isMobile ? 1 : 0,
              }}
            >
              <Chip size="small" color="primary" label={patient.id} />
              <Chip
                label={intl.formatMessage({
                  id: `status_${patient.status.toLowerCase()}`,
                })}
                color={getStatusColor(patient.status) as any}
                sx={{ ml: isMobile ? 0 : 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Card>

      <Divider sx={{ my: 2 }} />

      <CardContent sx={{ flexGrow: 1, p: 0 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {intl.formatMessage({ id: "admission_reason" })}
            </Typography>
            <Typography variant="body1">{patient.admissionReason}</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
              gap: 1,
            }}
          >
            {!isMobile && (
              <MedicalServicesIcon color="primary" sx={{ mb: 1 }} />
            )}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {intl.formatMessage({ id: "attending_physician" })}
              </Typography>
              <Typography variant="body1">{patient.doctor.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {patient.doctor.specialty}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
              gap: 1,
            }}
          >
            {!isMobile && <AccessTimeIcon color="primary" sx={{ mb: 1 }} />}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {intl.formatMessage({ id: "next_appointment" })}
              </Typography>
              <Typography variant="body1">
                {intl.formatDate(new Date(patient.nextAppointment), {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Box>
  );
};

export default PatientsCard;
