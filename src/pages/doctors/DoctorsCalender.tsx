import React, { useEffect, useMemo, useRef, useCallback } from "react";
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
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading } = useSelector(
    (state: RootState) => state.patients
  );

  // 이전 선택 날짜 참조
  const prevSelectedRef = useRef<string | null>(null);
  // 자동 선택 여부 추적
  const isAutoSelectingRef = useRef(false);

  useEffect(() => {
    dispatch(fetchPatientsData());
  }, [dispatch]);

  // ① doctorName 이 주어지면 해당 의사의 환자만 필터
  const patientsArr = useMemo(() => {
    return Object.values(patients).filter((p) =>
      doctorName ? p.doctor.name === doctorName : true
    );
  }, [patients, doctorName]);

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

  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const formattedSelected = selectedDate.format("YYYY-MM-DD");

  // doctorName이 변경될 때마다 처리
  useEffect(() => {
    // doctorName이 있고 일정이 있는 경우에만 자동 선택 로직 적용
    if (doctorName && highlightedDates.length > 0) {
      // 자동 선택 중임을 표시
      isAutoSelectingRef.current = true;

      try {
        // 일정이 있는 날짜들을 정렬
        const sortedDates = [...highlightedDates].sort();

        // 오늘 또는 미래의 첫 번째 일정 찾기
        const today = dayjs().format("YYYY-MM-DD");
        const futureDate = sortedDates.find((date) => date >= today);

        // 미래 일정이 있으면 그 날짜로, 없으면 가장 최근 일정으로 설정
        const newSelectedDate =
          futureDate || sortedDates[sortedDates.length - 1];

        if (newSelectedDate && prevSelectedRef.current !== newSelectedDate) {
          prevSelectedRef.current = newSelectedDate;
          setSelectedDate(dayjs(newSelectedDate));
        }
      } finally {
        // 자동 선택 완료
        isAutoSelectingRef.current = false;
      }
    }
  }, [doctorName, highlightedDates]);

  // 날짜 변경 핸들러 - useCallback으로 메모이제이션
  const handleDateChange = useCallback((date: Dayjs | null) => {
    // 자동 선택 중일 때는 사용자 클릭 무시
    if (isAutoSelectingRef.current) return;

    if (date) {
      const newDateFormatted = date.format("YYYY-MM-DD");

      // 이전과 같은 날짜면 중복 업데이트 방지
      if (prevSelectedRef.current === newDateFormatted) return;

      prevSelectedRef.current = newDateFormatted;
      setSelectedDate(date);
    }
  }, []);

  // 커스텀 렌더링을 위한 Day 컴포넌트 - 메모이제이션
  const CustomDay = React.memo(
    (props: PickersDayProps<Dayjs> & { highlightedDates?: string[] }) => {
      const {
        day,
        outsideCurrentMonth,
        highlightedDates = [],
        ...other
      } = props;
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
  );

  // 성능 최적화를 위해 displayName 설정
  CustomDay.displayName = "CustomDay";

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
            onChange={handleDateChange}
            slots={{ day: CustomDay }}
            slotProps={{ day: { highlightedDates } as any }}
            sx={{ width: "100%", maxWidth: 500 }}
            // 불필요한 재렌더링 방지를 위한 속성 추가
            disableHighlightToday={false}
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

export default React.memo(DoctorsCalendar);
