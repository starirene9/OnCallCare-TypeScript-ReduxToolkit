import { createSlice } from "@reduxjs/toolkit";
//import type { PayloadAction } from "@reduxjs/toolkit";

export interface Hospitals {
  id: string;
  name: string;
  specialty: string;
  onCall: boolean;
  contactInfo: string;
  firstCheckIn: string[];
  regionId: string;
}

interface HospitalsState {
  hospitals: { [id: string]: Hospitals };
}

const initialState: HospitalsState = {
  hospitals: {},
};

export const hospitalsSlice = createSlice({
  name: "hospitals",
  initialState,
  reducers: {},
});

export const {} = hospitalsSlice.actions;

export default hospitalsSlice.reducer;
