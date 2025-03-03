import { createSlice } from "@reduxjs/toolkit";
//import type { PayloadAction } from "@reduxjs/toolkit";

export interface Alerts {
  regionId: string;
  regionDoctors: string[];
  regionPatients: string[];
}

interface AlertsState {
  alerts: { [regionId: string]: Alerts };
}

const initialState: AlertsState = {
  alerts: {},
};

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {},
});

export const {} = alertsSlice.actions;

export default alertsSlice.reducer;
