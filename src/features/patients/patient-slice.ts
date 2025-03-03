import { createSlice } from "@reduxjs/toolkit";
//import type { PayloadAction } from "@reduxjs/toolkit";

export interface Patients {
  id: string;
  name: string;
  age: number;
  reason: string;
  firstSignIn: string[];
  lastSignOut: string[];
  location: {
    pastRegionId: string;
    currentRegionId: string;
    nextRegionId: string;
  };
}

interface PatientsState {
  patients: { [id: string]: Patients };
}

const initialState: PatientsState = {
  patients: {},
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
});

export const {} = patientsSlice.actions;

export default patientsSlice.reducer;
