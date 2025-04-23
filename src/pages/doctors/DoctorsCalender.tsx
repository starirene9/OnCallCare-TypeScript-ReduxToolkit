import React, { useEffect } from "react";
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
  Paper,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

const DoctorsCalendar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading } = useSelector(
    (state: RootState) => state.patients
  );

  useEffect(() => {
    dispatch(fetchPatientsData());
  }, [dispatch]);

  const scheduleMap: {
    [date: string]: { doctor: string; patient: string; time: string }[];
  } = {};
  Object.values(patients).forEach((patient) => {
    const date = dayjs(patient.nextAppointment);
    const formattedDate = date.format("YYYY-MM-DD");
    const time = date.format("hh:mm A");
    const entry = { doctor: patient.doctor.name, patient: patient.name, time };
    if (!scheduleMap[formattedDate]) {
      scheduleMap[formattedDate] = [entry];
    } else {
      scheduleMap[formattedDate].push(entry);
    }
  });

  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const formattedSelected = selectedDate.format("YYYY-MM-DD");
  const highlightedDates = Object.keys(scheduleMap);

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
            value={selectedDate}
            onChange={(newDate) => newDate && setSelectedDate(newDate)}
            slots={{ day: CustomDay }}
            slotProps={{ day: { highlightedDates } as any }}
            sx={{ width: "100%", maxWidth: 500 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {formattedSelected} - Duty Schedule
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
