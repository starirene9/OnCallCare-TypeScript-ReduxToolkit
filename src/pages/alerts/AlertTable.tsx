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
  Button,
  Alert,
  Badge,
  useTheme,
  useMediaQuery,
  Card,
  Divider,
  IconButton,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { getStatusColor } from "../../utils";
import { useIntl } from "react-intl";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AlertDrawer from "./AlertDrawer";

interface AlertTableProps {
  searchTerm?: string;
  onSelectPatient: (id: string) => void;
  patientImages?: Record<string, string>;
}

const AlertTable: React.FC<AlertTableProps> = ({
  searchTerm = "",
  onSelectPatient,
  patientImages = {},
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { patients, loading, selectedPatientId, error } = useSelector(
    (state: RootState) => state.patients
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertPatientId, setAlertPatientId] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<
    { id: string; name: string } | undefined
  >(undefined);

  const patientsArray = Object.values(patients);
  const patientOptions = patientsArray.map((p) => ({
    id: p.id,
    name: p.name,
  }));

  const term = searchTerm.toLowerCase();
  const filteredPatients = patientsArray.filter(
    (p) =>
      (p?.name?.toLowerCase().includes(term) ||
        p?.doctor?.name?.toLowerCase().includes(term)) &&
      (p.status === "Critical" || p.status === "Admitted")
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleRetry = () => dispatch({ type: "patients/fetchPatientsData" });

  if (loading) return <LinearProgress aria-label="Loading alert table" />;

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
      </Box>
      <Card
        variant="outlined"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
          <Table stickyHeader aria-label="alerts table">
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
                <TableCell sx={{ fontWeight: "bold" }}>
                  {intl.formatMessage({ id: "status" })}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Alert</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Create Alert
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => {
                  const avatarSrc = patientImages[patient.id] ?? undefined;
                  const alertCreated = (patient as any).alertCreated as
                    | boolean
                    | undefined;
                  return (
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
                              src={avatarSrc}
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
                      </TableCell>
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
                        {alertCreated ? (
                          <CircleOutlined
                            fontSize="small"
                            aria-label={intl.formatMessage({ id: "alert_set" })}
                          />
                        ) : (
                          <CloseRoundedIcon
                            fontSize="small"
                            aria-label={intl.formatMessage({
                              id: "alert_not_set",
                            })}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label={intl.formatMessage({
                            id: "create_alert",
                          })}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient.id);
                            setAlertPatientId(patient.id);
                            setSelectedDoctor({
                              id: patient.doctor.id ?? patient.doctor.name,
                              name: patient.doctor.name,
                            });
                            setDrawerOpen(true);
                          }}
                          size="small"
                        >
                          <span role="img" aria-label="Create Alert">
                            🚨
                          </span>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            ".MuiTablePagination-selectLabel": { margin: 0 },
            ".MuiTablePagination-displayedRows": { margin: 0 },
          }}
        />
      </Card>
      <AlertDrawer
        open={drawerOpen}
        doctor={selectedDoctor}
        patientOptions={patientOptions}
        alertPatientId={alertPatientId}
        setAlertPatientId={setAlertPatientId}
        onClose={() => setDrawerOpen(false)}
        onCreate={(params) => {
          // TODO: 알림 생성 액션(dispatch) 또는 API 호출
          console.log("create alert:", params);
        }}
      />
    </Box>
  );
};

export default AlertTable;
