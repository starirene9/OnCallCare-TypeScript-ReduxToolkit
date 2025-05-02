import React, { useCallback, useMemo, useState } from "react";
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
  Tooltip,
  Skeleton,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { getStatusColor } from "../../utils";
import { useIntl } from "react-intl";
import AlertDrawer from "./AlertDrawer";

/** ------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------*/
interface AlertTableProps {
  searchTerm?: string;
  onSelectPatient: (id: string) => void;
  /** Optional map of patient id → avatar URL */
  patientImages?: Record<string, string>;
}

type DoctorInfo = { id: string; name: string } | undefined;

/** ------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------*/
const AlertTable: React.FC<AlertTableProps> = ({
  searchTerm = "",
  onSelectPatient,
  patientImages = {},
}) => {
  /** ----------------------- hooks & state ------------------------ */
  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertPatientId, setAlertPatientId] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo>();

  /** ----------------------- redux selectors ---------------------- */
  const { patients, loading, selectedPatientId, error } = useSelector(
    (state: RootState) => state.patients
  );
  const { byPatient, byId } = useSelector((state: RootState) => state.alerts);

  /** ----------------------- derived data ------------------------- */
  const patientsArray = useMemo(() => Object.values(patients), [patients]);

  const filteredPatients = useMemo(() => {
    // Lower‑case once for performance
    const term = searchTerm.toLowerCase();
    return patientsArray.filter(
      (p) =>
        (p.name.toLowerCase().includes(term) ||
          p.doctor.name.toLowerCase().includes(term)) &&
        (p.status === "Critical" || p.status === "Admitted")
    );
  }, [patientsArray, searchTerm]);

  /** ----------------------- event handlers ----------------------- */
  const handleChangePage = useCallback(
    (_: unknown, newPage: number) => setPage(newPage),
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    },
    []
  );

  const handleRetry = useCallback(
    () => dispatch({ type: "patients/fetchPatientsData" }),
    [dispatch]
  );

  const handleCreateAlert = useCallback(
    (patientId: string, doctorId: string, doctorName: string) => {
      onSelectPatient(patientId);
      setAlertPatientId(patientId);
      setSelectedDoctor({ id: doctorId, name: doctorName });
      setDrawerOpen(true);
    },
    [onSelectPatient]
  );

  /** ----------------------- render helpers ----------------------- */
  const renderStatusChip = (status: string) => (
    <Chip
      label={intl.formatMessage({ id: `status_${status.toLowerCase()}` })}
      color={getStatusColor(status) as any}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );

  const renderAlertIcon = (patientId: string, defaultCreated?: boolean) => {
    const hasAlert = Boolean(byPatient?.[patientId]?.length);
    const alertCreated = defaultCreated || hasAlert;
    const latestId = byPatient[patientId]?.slice(-1)[0];
    const note = latestId ? byId[latestId]?.notes ?? "" : "";

    return (
      <Tooltip title={note || "No notes"} arrow placement="top">
        {alertCreated ? (
          <CircleOutlined fontSize="small" />
        ) : (
          <CloseRoundedIcon fontSize="small" />
        )}
      </Tooltip>
    );
  };

  /** ----------------------- early returns ------------------------ */
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

  if (!filteredPatients.length) {
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

  /** ----------------------- component ---------------------------- */
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
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
              {
                count: filteredPatients.length,
              }
            )}
            )
          </Typography>
        </Typography>
      </Box>

      {/* Table */}
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
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Alert
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Create
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPatients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => {
                  const avatarSrc = patientImages[patient.id];

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
                      {/* Patient */}
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
                            {avatarSrc ? (
                              <Avatar
                                src={avatarSrc}
                                sx={{ mr: 2, width: 40, height: 40 }}
                              />
                            ) : (
                              <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{ mr: 2 }}
                              />
                            )}
                          </Badge>

                          <Box>
                            <Typography variant="body1" fontWeight={500} noWrap>
                              {patient.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {`${patient.age} ${intl.formatMessage({
                                id: "years",
                              })} • ${intl.formatMessage({
                                id: `gender_${patient.gender.toLowerCase()}`,
                              })}`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Admission reason */}
                      {!isMobile && (
                        <TableCell sx={{ maxWidth: 200, whiteSpace: "normal" }}>
                          {patient.admissionReason}
                        </TableCell>
                      )}

                      {/* Physician */}
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} noWrap>
                          {patient.doctor.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {intl.formatMessage({
                            id: patient.doctor.specialty
                              .toLowerCase()
                              .replace(/\s/g, "_"),
                            defaultMessage: patient.doctor.specialty,
                          })}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>{renderStatusChip(patient.status)}</TableCell>

                      {/* Alert indicator */}
                      <TableCell align="center">
                        {renderAlertIcon(
                          patient.id,
                          (patient as any).alertCreated
                        )}
                      </TableCell>

                      {/* Create alert button */}
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          aria-label={intl.formatMessage({
                            id: "create_alert",
                          })}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateAlert(
                              patient.id,
                              patient.doctor.id ?? patient.doctor.name,
                              patient.doctor.name
                            );
                          }}
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

        {/* Pagination */}
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
            ".MuiTablePagination-selectLabel": { m: 0 },
            ".MuiTablePagination-displayedRows": { m: 0 },
          }}
        />
      </Card>

      {/* Drawer */}
      <AlertDrawer
        open={drawerOpen}
        doctor={selectedDoctor}
        patientOptions={patientsArray.map(({ id, name }) => ({ id, name }))}
        alertPatientId={alertPatientId}
        setAlertPatientId={setAlertPatientId}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};

export default AlertTable;
