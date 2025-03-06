import { configureStore } from "@reduxjs/toolkit";
import realtimeDataReducer from "../features/realtimeDashboard/realtime-slice";
import patientsReducer from "../features/patients/patient-slice";
import doctorsReducer from "../features/doctors/doctor-slice";
import alertsReducer from "../features/alerts/alert-slice";
import broadcastReducer from "../features/emergencyBroadcast/emergency-broadcast-slice";
import hospitalsReducer from "../features/hospitals/hosiptals-slice";
import realtimeHistoryReducer from "../features/realtimeDashboard/realtime-history-slice";

export const store = configureStore({
  reducer: {
    realtimeData: realtimeDataReducer,
    realtimeHistoryData: realtimeHistoryReducer,
    patients: patientsReducer,
    doctors: doctorsReducer,
    alerts: alertsReducer,
    broadcast: broadcastReducer,
    hospitals: hospitalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
