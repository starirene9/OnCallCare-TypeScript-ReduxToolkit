import { createSlice } from "@reduxjs/toolkit";
//import type { PayloadAction } from "@reduxjs/toolkit";

export interface Doctors {
  id: string;
  name: string;
  specialty: string;
  onCall: boolean;
  contactInfo: string;
  firstCheckIn: string[];
  regionId: string;
}

interface DoctorsState {
  doctors: { [id: string]: Doctors };
}

const initialState: DoctorsState = {
  doctors: {},
};

export const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
});

export const {} = doctorsSlice.actions;

export default doctorsSlice.reducer;
