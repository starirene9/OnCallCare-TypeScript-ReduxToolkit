import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//import type { PayloadAction } from "@reduxjs/toolkit";

export interface GroupedRegions {
  [regionId: string]: {
    regionName: string;
    regionCount: number;
    regionDrCount: number;
    polygon: [string, string];
    timestamp: string[];
  };
}

interface realtimeDataState {
  realtimeData: GroupedRegions;
  loading: boolean;
  error: string | null;
}

const initialState: realtimeDataState = {
  realtimeData: {},
  loading: false,
  error: null,
};

const fetchRealtimeData = createAsyncThunk(
  "realtimeData/fetchRealtimeData",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockRealtimeData: GroupedRegions = {
      R1: {
        regionName: "Cardiology Ward",
        regionCount: 20,
        regionDrCount: 5,
        polygon: ["37.1234", "127.5678"],
        timestamp: ["2025-03-03T12:00:00Z", "2025-03-03T12:30:00Z"],
      },
      R2: {
        regionName: "Neurology Ward",
        regionCount: 15,
        regionDrCount: 3,
        polygon: ["36.9876", "126.5432"],
        timestamp: ["2025-03-03T13:00:00Z"],
      },
      R3: {
        regionName: "Emergency Room",
        regionCount: 30,
        regionDrCount: 10,
        polygon: ["37.7890", "127.4321"],
        timestamp: ["2025-03-03T14:00:00Z"],
      },
    };
    return mockRealtimeData;
  }
);

export const realtimeDataSlice = createSlice({
  name: "realtimeData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealtimeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRealtimeData.fulfilled, (state, action) => {
        state.loading = false;
        state.realtimeData = action.payload;
      })
      .addCase(fetchRealtimeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export const {} = realtimeDataSlice.actions;

export default realtimeDataSlice.reducer;
