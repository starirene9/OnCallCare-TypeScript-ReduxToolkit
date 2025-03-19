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
  Paper,
  Avatar,
  Chip,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getStatusColor } from "../../utils";

interface PatientsTableProps {
  searchTerm?: string;
  onSelectPatient: (id: string) => void;
}

const PatientsTable: React.FC<PatientsTableProps> = ({
  searchTerm = "",
  onSelectPatient,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { patients, loading, selectedPatientId, error } = useSelector(
    (state: RootState) => state.patients
  );

  // Convert patients object to array for table display
  const patientsArray = Object.values(patients); //  객체(patients)의 값들만을 배열로 변환하는 JavaScript 내장 함수

  // Filter patients based on search term
  const filteredPatients = patientsArray.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.admissionReason.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading) {
    return <LinearProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="subtitle1" component="div" gutterBottom>
        Patients List
      </Typography>
      <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: "auto" }}>
        <Table stickyHeader aria-label="patients table">
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Admission Reason</TableCell>
              <TableCell>Attending Physician</TableCell>
              <TableCell>Next Appointment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 현재 페이지의 데이터만 slice()로 가져옴
              .map(
                (
                  patient // map으로 각 환자를 테이블 배열 행에서 변환
                ) => (
                  <TableRow
                    key={patient.id}
                    hover
                    selected={patient.id === selectedPatientId}
                    onClick={() => onSelectPatient(patient.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={patient.photo} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="body1">
                            {patient.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.age} years • {patient.gender}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{patient.admissionReason}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {patient.doctor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {patient.doctor.specialty}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{patient.nextAppointment}</TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        color={getStatusColor(patient.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPatient(patient.id); // 선택된 환자의 id가 부모 컴포넌트로 전달
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Patient">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add edit functionality here
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Medical Records">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add medical records functionality here
                            }}
                          >
                            <LocalHospitalIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPatients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default PatientsTable;
