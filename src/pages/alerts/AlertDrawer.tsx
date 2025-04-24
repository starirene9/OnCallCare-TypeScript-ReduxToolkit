import React, { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

type PatientOption = { id: string; name: string };
type Doctor = { id: string; name: string };

interface AlertDrawerProps {
  open: boolean;
  doctor?: Doctor; // 선택된 의사 정보
  patientOptions: PatientOption[]; // 환자 목록
  alertPatientId: string; // 선택된 환자 id
  setAlertPatientId: Dispatch<SetStateAction<string>>;
  onClose: () => void; // 닫기 콜백
  onCreate?: (params: {
    doctorId: string;
    patientId: string;
    offsets: number[]; // 알림 시점(분) – 필요 시 확장
    notes: string;
  }) => void;
}

const AlertDrawer: React.FC<AlertDrawerProps> = ({
  open,
  doctor,
  patientOptions,
  alertPatientId,
  setAlertPatientId,
  onClose,
  onCreate,
}) => {
  const [notes, setNotes] = React.useState("");
  const [offset30, setOffset30] = React.useState(false);
  const [offset60, setOffset60] = React.useState(false);

  const handleCreate = () => {
    if (!doctor || !alertPatientId) return;
    onCreate?.({
      doctorId: doctor.id,
      patientId: alertPatientId,
      offsets: [offset30 && 30, offset60 && 60].filter(Boolean) as number[],
      notes,
    });
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", md: "33.333%" }, p: 2 } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {doctor ? `Create Alert for ${doctor.name}` : "Create Alert"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* 환자 선택 */}
        <TextField
          select
          label="Patient"
          value={alertPatientId}
          onChange={(e) => setAlertPatientId(e.target.value)}
          variant="outlined"
          fullWidth
          helperText="Choose a patient for this alert"
        >
          {patientOptions.length ? (
            patientOptions.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name ?? "Unknown"}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No patients available</MenuItem>
          )}
        </TextField>

        {/* 알림 시점 */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            When to alert?
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <label>
              <input
                type="checkbox"
                checked={offset30}
                onChange={(e) => setOffset30(e.target.checked)}
              />{" "}
              30 minutes before
            </label>
            <label>
              <input
                type="checkbox"
                checked={offset60}
                onChange={(e) => setOffset60(e.target.checked)}
              />{" "}
              1 hour before
            </label>
          </Box>
        </Box>

        {/* 비고 */}
        <TextField
          label="Additional Notes (optional)"
          multiline
          rows={3}
          inputProps={{ maxLength: 300 }}
          placeholder="Enter message (max 300 characters)"
          helperText={`${notes.length}/300`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          disabled={!doctor || !alertPatientId}
          onClick={handleCreate}
        >
          Create Alert
        </Button>
      </Box>
    </Drawer>
  );
};

export default AlertDrawer;
