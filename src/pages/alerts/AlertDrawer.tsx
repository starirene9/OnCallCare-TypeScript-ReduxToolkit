import React, { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addAlert } from "../../features/alerts/alert-slice";

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
  const dispatch = useDispatch<AppDispatch>();
  const [notes, setNotes] = React.useState("");
  const [offset, setOffset] = React.useState<30 | 60 | null>(null);

  const currentPatient = patientOptions.find((p) => p.id === alertPatientId);

  const handleCreate = () => {
    if (!doctor || !alertPatientId || offset === null) return;
    dispatch(
      addAlert({
        doctorId: doctor.id,
        patientId: alertPatientId,
        offsets: [offset],
        notes,
      })
    );
    onClose();
  };

  const APP_BAR_HEIGHT = 80;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          top: APP_BAR_HEIGHT, // 헤더 바로 아래에서 시작
          height: `calc(100% - ${APP_BAR_HEIGHT}px)`, // 남은 높이만 사용
          p: 2,
          width: { xs: "100%", md: "33%" },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
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
          label="Patient"
          value={currentPatient?.name ?? "Unknown"}
          variant="outlined"
          fullWidth
          InputProps={{ readOnly: true }} // ← 고정! 드롭다운 아님
        />

        {/* 알림 시점 */}
        {/* <Box>
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
        </Box> */}
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontSize: "0.875rem", mb: 1 }}>
            When to alert?
          </FormLabel>

          <RadioGroup
            value={offset ?? ""}
            onChange={(_, v) =>
              setOffset(v === "" ? null : (Number(v) as 30 | 60))
            }
            sx={{ gap: 1 }}
          >
            <FormControlLabel
              value={30}
              control={<Radio size="small" />}
              label="30 minutes before"
            />
            <FormControlLabel
              value={60}
              control={<Radio size="small" />}
              label="1 hour before"
            />
          </RadioGroup>
        </FormControl>

        {/* 비고 */}
        <TextField
          label="Additional Notes (optional)"
          multiline
          rows={8}
          inputProps={{ maxLength: 300 }}
          placeholder="Enter message (max 300 characters)"
          helperText={`${notes.length}/300`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          fullWidth
        />

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          color="primary"
          disabled={!doctor || !alertPatientId || offset === null}
          onClick={handleCreate}
        >
          Create Alert
        </Button>
      </Box>
    </Drawer>
  );
};

export default AlertDrawer;
