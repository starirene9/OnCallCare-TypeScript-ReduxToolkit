import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  Alert,
  Badge,
  useTheme,
  useMediaQuery,
  Card,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReplayIcon from "@mui/icons-material/Replay";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { getStatusColor } from "../../utils";
import { useIntl } from "react-intl";

interface PatientsTableProps {
  searchTerm?: string;
  onSelectPatient: (id: string) => void;
  patientImages: Record<string, string>;
}

const PatientsTable: React.FC<PatientsTableProps> = ({
  searchTerm = "",
  onSelectPatient,
  patientImages,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const intl = useIntl();

  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading, selectedPatientId, error } = useSelector(
    (state: RootState) => state.patients
  );

  const patientsArray = Object.values(patients); // to make an array

  const filteredPatients = patientsArray.filter(
    (patient) =>
      patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRetry = () => {
    dispatch({ type: "patients/fetchPatientsData" });
  };

  if (loading) {
    return <LinearProgress aria-label="Loading patient table" />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<ReplayIcon />}
              onClick={handleRetry}
            >
              {intl.formatMessage({ id: "retry" })}
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {intl.formatMessage(
            { id: "no_patients_found" },
            { term: searchTerm }
          )}
        </Typography>
        {searchTerm && (
          <Button variant="outlined" onClick={() => window.location.reload()}>
            {intl.formatMessage({ id: "clear_search" })}
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" component="div">
          {intl.formatMessage({ id: "patients_list" })}
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            (
            {intl.formatMessage(
              { id: "total_patients_table" },
              { count: filteredPatients.length }
            )}
            )
          </Typography>
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Print List">
            <IconButton size="small" aria-label="Print patients list">
              <PrintIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Data">
            <IconButton size="small" aria-label="Export patients data">
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Card
        variant="outlined"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
          <Table stickyHeader aria-label="patients table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {intl.formatMessage({ id: "patients" })}
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {intl.formatMessage({ id: "admission_reason" })}
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: "bold" }}>
                  {intl.formatMessage({ id: "attending_physician" })}
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {intl.formatMessage({ id: "next_appointment" })}
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: "bold" }}>
                  {intl.formatMessage({ id: "status" })}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {intl.formatMessage({ id: "actions" })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => (
                  <TableRow
                    key={patient.id}
                    hover
                    selected={patient.id === selectedPatientId}
                    onClick={() => onSelectPatient(patient.id)}
                    sx={{
                      cursor: "pointer",
                      "&.Mui-selected": {
                        backgroundColor: `${theme.palette.primary.main}15`,
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: `${theme.palette.primary.main}25`,
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            patient.status === "Critical" ? (
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  bgcolor: "error.main",
                                  borderRadius: "50%",
                                  border: "2px solid white",
                                }}
                              />
                            ) : null
                          }
                        >
                          <Avatar
                            src={patientImages[patient.id]}
                            sx={{
                              mr: 2,
                              width: 40,
                              height: 40,
                              border:
                                patient.id === selectedPatientId
                                  ? `2px solid ${theme.palette.primary.main}`
                                  : "none",
                            }}
                          />
                        </Badge>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {patient.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${patient.age} ${intl.formatMessage({
                              id: "years",
                            })} • ${intl.formatMessage({
                              id: `gender_${patient.gender.toLowerCase()}`,
                            })}`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {!isMobile && (
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {patient.admissionReason}
                      </TableCell>
                    )}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {patient.doctor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {intl.formatMessage({
                            id: patient.doctor.specialty
                              .toLowerCase()
                              .replace(/\s/g, "_"),
                            defaultMessage: patient.doctor.specialty,
                          })}
                        </Typography>
                      </Box>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        {" "}
                        {intl.formatDate(new Date(patient.nextAppointment), {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={intl.formatMessage({
                          id: `status_${patient.status.toLowerCase()}`,
                        })}
                        color={getStatusColor(patient.status) as any}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip
                          title={intl.formatMessage({ id: "view_details" })}
                        >
                          <IconButton
                            size="small"
                            color={
                              patient.id === selectedPatientId
                                ? "primary"
                                : "default"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPatient(patient.id);
                            }}
                            aria-label="View patient details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={intl.formatMessage({ id: "edit_patient" })}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add edit functionality here
                              console.log("Edit patient", patient.id);
                            }}
                            aria-label="Edit patient"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={intl.formatMessage({ id: "medical_records" })}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add medical records functionality here
                              console.log("Open medical records", patient.id);
                            }}
                            aria-label="View medical records"
                          >
                            <LocalHospitalIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? "" : "Rows:"}
          sx={{
            ".MuiTablePagination-selectLabel": {
              margin: 0,
            },
            ".MuiTablePagination-displayedRows": {
              margin: 0,
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default PatientsTable;
