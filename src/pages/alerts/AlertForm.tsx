import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface PatientOption {
  id: string;
  name: string;
}

interface AlertFormProps {
  /** Drawer 열림 여부 */
  open: boolean;
  /** Drawer 닫힘 처리 */
  onClose: () => void;
  /** 의사 이름(헤더 표기용) */
  doctorName?: string;
  /** 의사 ID (알림 생성 시 사용) */
  doctorId: string;
  /** 환자 선택 옵션 */
  patientOptions: PatientOption[];
  /** 알림 생성 액션 */
  onCreate: (payload: {
    doctorId: string;
    patientId: string;
    alertOffsets: number[]; // 분 단위 오프셋 (ex. 30, 60)
    notes: string;
  }) => void;
}

/**
 * AlertForm – 의사 당직 알림 생성 폼
 *
 * 분리된 재사용 컴포넌트로, DoctorsTable 등에서 호출해 Drawer 형태로 띄웁니다.
 */
const AlertForm: React.FC<AlertFormProps> = ({
  open,
  onClose,
  doctorName = "",
  doctorId,
  patientOptions,
  onCreate,
}) => {
  /* -------------------------------------------------------------------------- */
  /*                                   state                                    */
  /* -------------------------------------------------------------------------- */
  const [patientId, setPatientId] = useState<string>("");
  const [offset30, setOffset30] = useState<boolean>(false);
  const [offset60, setOffset60] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  /* -------------------------------------------------------------------------- */
  /*                                 handlers                                   */
  /* -------------------------------------------------------------------------- */
  const handleCreate = () => {
    const alertOffsets: number[] = [];
    if (offset30) alertOffsets.push(30);
    if (offset60) alertOffsets.push(60);

    onCreate({ doctorId, patientId, alertOffsets, notes });

    // reset form & close
    setPatientId("");
    setOffset30(false);
    setOffset60(false);
    setNotes("");
    onClose();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", md: "33.333%" }, p: 2 } }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {`Create Alert for ${doctorName}`}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Patient select */}
        <TextField
          select
          label="Patient"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          variant="outlined"
          fullWidth
          helperText="Choose a patient for this alert"
        >
          {patientOptions.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </TextField>

        {/* Alert offsets */}
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

        {/* Notes */}
        <TextField
          label="Additional Notes (optional)"
          multiline
          rows={3}
          inputProps={{ maxLength: 300 }}
          placeholder="Enter message (max 300 characters)"
          helperText="Max 300 characters"
          variant="outlined"
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Create button */}
        <Button
          variant="contained"
          color="primary"
          disabled={!patientId || (!offset30 && !offset60)}
          onClick={handleCreate}
        >
          Create Alert
        </Button>
      </Box>
    </Drawer>
  );
};

export default AlertForm;
