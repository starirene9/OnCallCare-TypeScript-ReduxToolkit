import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  TextField,
  MenuItem,
  Divider,
  Drawer,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReplayIcon from "@mui/icons-material/Replay";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useIntl } from "react-intl";
import {
  fetchDoctorsData,
  updateDoctor,
} from "../../features/doctors/doctor-slice";
import { selectPatientIdNameList } from "../../features/patients/patient-slice";
import { fetchPatientsData } from "../../features/patients/patient-slice";

interface DoctorsTableProps {
  searchTerm?: string;
  onSelectDoctor: (id: string) => void;
}

// util: replace underscores & Title‑case first letter
const titleCase = (str: string) => {
  const cleaned = str.replace(/_/g, " ");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};

const DoctorsTable: React.FC<DoctorsTableProps> = ({
  searchTerm = "",
  onSelectDoctor,
}) => {
  /* ------------------ local state ------------------ */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<{
    specialty?: string;
    onCall?: boolean;
    contactInfo?: string;
  }>({});
  const [alertDoctorId, setAlertDoctorId] = useState<string | null>(null);

  const [alertPatientId, setAlertPatientId] = useState<string>(""); // 선택된 환자
  const patientOptions = useSelector(selectPatientIdNameList);

  /* ---------------- redux / intl / theme ------------- */
  const intl = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const { doctors, loading, error, selectedDoctorId } = useSelector(
    (state: RootState) => state.doctors
  );

  /* ------------------ side‑effects ------------------- */
  useEffect(() => {
    if (Object.keys(doctors).length === 0 && !loading && !error) {
      dispatch(fetchDoctorsData());
    }
  }, [dispatch, doctors, loading, error]);

  useEffect(() => {
    dispatch(fetchPatientsData());
  }, [dispatch]);
  /* ------------------- filtering --------------------- */
  const doctorsArray = Object.values(doctors);
  const filteredDoctors = doctorsArray.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* --------------- table helpers -------------------- */
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleRetry = () => dispatch(fetchDoctorsData());

  /* --------------------- ui -------------------------- */
  if (loading) return <LinearProgress aria-label="Loading doctors table" />;

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
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

  if (filteredDoctors.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {intl.formatMessage({ id: "no_doctors_found" }, { term: searchTerm })}
        </Typography>
        {searchTerm && (
          <Button variant="outlined" onClick={() => window.location.reload()}>
            {intl.formatMessage({ id: "clear_search" })}
          </Button>
        )}
      </Box>
    );
  }

  const renderHeader = (
    id: string,
    opts: { hideOnMobile?: boolean; align?: "center" | "left" } = {}
  ) => {
    if (opts.hideOnMobile && isMobile) return null;
    return (
      <TableCell align={opts.align ?? "left"} sx={{ fontWeight: "bold" }}>
        {titleCase(intl.formatMessage({ id }).replace(/_/g, " "))}
      </TableCell>
    );
  };

  return (
    <>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Card
          variant="outlined"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table stickyHeader aria-label="doctors table">
              <TableHead>
                <TableRow>
                  {renderHeader("doctor")}
                  {renderHeader("specialty", { hideOnMobile: true })}
                  {renderHeader("on_call")}
                  {renderHeader("contact_info", { hideOnMobile: true })}
                  {renderHeader("actions", { align: "center" })}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDoctors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doc) => (
                    <TableRow
                      key={doc.id}
                      hover
                      selected={doc.id === selectedDoctorId}
                      onClick={() => onSelectDoctor(doc.id)}
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
                      {/* Name */}
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {doc.name}
                        </Typography>
                      </TableCell>

                      {/* Specialty */}
                      {!isMobile && (
                        <TableCell>
                          {editingDoctorId === doc.id ? (
                            <TextField
                              size="small"
                              fullWidth
                              value={editedData.specialty ?? doc.specialty}
                              onChange={(e) =>
                                setEditedData({
                                  ...editedData,
                                  specialty: e.target.value,
                                })
                              }
                            />
                          ) : (
                            titleCase(doc.specialty)
                          )}
                        </TableCell>
                      )}

                      {/* On call */}
                      <TableCell>
                        {editingDoctorId === doc.id ? (
                          <TextField
                            select
                            size="small"
                            fullWidth
                            value={
                              editedData.onCall ?? doc.onCall ? "Yes" : "No"
                            }
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                onCall: e.target.value === "Yes",
                              })
                            }
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </TextField>
                        ) : (
                          <Chip
                            label={doc.onCall ? "On duty" : "Off duty"}
                            color={doc.onCall ? "success" : "default"}
                            size="small"
                          />
                        )}
                      </TableCell>

                      {/* Contact */}
                      {!isMobile && (
                        <TableCell>
                          {editingDoctorId === doc.id ? (
                            <TextField
                              size="small"
                              fullWidth
                              value={editedData.contactInfo ?? doc.contactInfo}
                              onChange={(e) =>
                                setEditedData({
                                  ...editedData,
                                  contactInfo: e.target.value,
                                })
                              }
                            />
                          ) : (
                            doc.contactInfo
                          )}
                        </TableCell>
                      )}

                      {/* Actions */}
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {editingDoctorId === doc.id ? (
                            <>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDoctorId(null);
                                  setEditedData({});
                                  dispatch(
                                    updateDoctor({
                                      id: doc.id,
                                      specialty:
                                        editedData.specialty ?? doc.specialty,
                                      onCall: editedData.onCall ?? doc.onCall,
                                      contactInfo:
                                        editedData.contactInfo ??
                                        doc.contactInfo,
                                    })
                                  );
                                }}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDoctorId(null);
                                  setEditedData({});
                                }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              {/* View details */}
                              <Tooltip title="View details">
                                <IconButton
                                  size="small"
                                  color={
                                    doc.id === selectedDoctorId
                                      ? "primary"
                                      : "default"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectDoctor(doc.id);
                                  }}
                                >
                                  <LocalHospitalIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {/* Edit */}
                              <Tooltip title="Edit doctor">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDoctorId(doc.id);
                                    setEditedData({
                                      specialty: doc.specialty,
                                      onCall: doc.onCall,
                                      contactInfo: doc.contactInfo,
                                    });
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {/* Alert */}
                              <Tooltip title="Send alert">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAlertDoctorId(doc.id);
                                  }}
                                >
                                  <NotificationsActiveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
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
            count={filteredDoctors.length}
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
      </Box>

      {/* ---------------- Alert Drawer ---------------- */}
      <Drawer
        anchor="right"
        open={Boolean(alertDoctorId)}
        onClose={() => setAlertDoctorId(null)}
        PaperProps={{ sx: { width: { xs: "100%", md: "33.333%" }, p: 2 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {`Create Alert for ${
              alertDoctorId && doctors[alertDoctorId]?.name
            }`}
          </Typography>
          <IconButton onClick={() => setAlertDoctorId(null)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* ✅ Alert Form Start */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* 환자 이름 (예시로 고정) */}
          <TextField
            select
            label="Patient"
            value={alertPatientId}
            onChange={(e) => setAlertPatientId(e.target.value)}
            variant="outlined"
            fullWidth
            helperText="Choose a patient for this alert"
          >
            {Array.isArray(patientOptions) && patientOptions.length > 0 ? (
              patientOptions.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name ?? "Unknown"}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No patients available</MenuItem>
            )}
          </TextField>

          {/* 알림 시간 체크박스 */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              When to alert?
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <label>
                <input type="checkbox" /> 30 minutes before
              </label>
              <label>
                <input type="checkbox" /> 1 hour before
              </label>
            </Box>
          </Box>

          {/* 추가 메시지 입력 */}
          <TextField
            label="Additional Notes (optional)"
            multiline
            rows={3}
            inputProps={{ maxLength: 300 }}
            placeholder="Enter message (max 300 characters)"
            helperText="Max 300 characters"
            variant="outlined"
            fullWidth
          />

          {/* 생성 버튼 */}
          <Button variant="contained" color="primary">
            Create Alert
          </Button>
        </Box>
        {/* ✅ Alert Form End */}
      </Drawer>
    </>
  );
};

export default DoctorsTable;
