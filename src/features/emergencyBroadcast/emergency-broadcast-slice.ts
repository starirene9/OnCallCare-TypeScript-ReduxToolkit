import { createSlice } from "@reduxjs/toolkit";
//import type { PayloadAction } from "@reduxjs/toolkit";

export interface BroadCast {
  id: string;
  name: string;
  specialty: string;
  onCall: boolean;
  contactInfo: string;
  firstCheckIn: string[];
  regionId: string;
}

interface BroadCastState {
  broadCast: { [id: string]: BroadCast };
}

const initialState: BroadCastState = {
  broadCast: {},
};

export const broadCastSlice = createSlice({
  name: "broadCast",
  initialState,
  reducers: {},
});

export const {} = broadCastSlice.actions;

export default broadCastSlice.reducer;
