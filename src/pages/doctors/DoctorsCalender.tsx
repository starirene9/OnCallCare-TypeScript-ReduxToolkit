import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchPatientsData } from "../../features/patients/patient-slice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import {
  Box,
  Typography,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface DoctorsCalendarProps {
  doctorName?: string | null;
}

const DoctorsCalendar: React.FC<DoctorsCalendarProps> = ({ doctorName }) => {
  console.log("DoctorsCalendar", doctorName);
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading } = useSelector(
    (state: RootState) => state.patients
  );

  useEffect(() => {
    dispatch(fetchPatientsData());
  }, [dispatch]);

  // ① doctorName 이 주어지면 해당 의사의 환자만 필터
  const patientsArr = Object.values(patients).filter((p) =>
    doctorName ? p.doctor.name === doctorName : true
  );

  const scheduleMap = useMemo(() => {
    const map: {
      [d: string]: { doctor: string; patient: string; time: string }[];
    } = {};
    patientsArr.forEach((p) => {
      const d = dayjs(p.nextAppointment);
      const key = d.format("YYYY-MM-DD");
      (map[key] ??= []).push({
        doctor: p.doctor.name,
        patient: p.name,
        time: d.format("hh:mm A"),
      });
    });
    return map;
  }, [patientsArr]);

  const highlightedDates = useMemo(
    () => Object.keys(scheduleMap),
    [scheduleMap]
  );

  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const formattedSelected = selectedDate.format("YYYY-MM-DD");

  function CustomDay(
    props: PickersDayProps<Dayjs> & { highlightedDates?: string[] }
  ) {
    const { day, outsideCurrentMonth, highlightedDates = [], ...other } = props;
    const formatted = day.format("YYYY-MM-DD");
    const isSelected = highlightedDates.includes(formatted);

    return (
      <Badge overlap="circular" badgeContent={isSelected ? "⛑️" : undefined}>
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
        />
      </Badge>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          p: 2,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Box>
          <DateCalendar
            key={doctorName ?? "all"}
            value={selectedDate}
            onChange={(d) => d && setSelectedDate(d)}
            slots={{ day: CustomDay }}
            slotProps={{ day: { highlightedDates } as any }}
            sx={{ width: "100%", maxWidth: 500 }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {doctorName
              ? `${doctorName}'s Schedule`
              : `${formattedSelected} — All Doctors Schedule`}
          </Typography>
          {scheduleMap[formattedSelected] ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Doctor</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduleMap[formattedSelected].map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.doctor}</TableCell>
                      <TableCell>{item.patient}</TableCell>
                      <TableCell>{item.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No appointments
            </Typography>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DoctorsCalendar;
