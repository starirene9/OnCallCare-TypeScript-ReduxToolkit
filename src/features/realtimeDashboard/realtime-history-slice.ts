import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface GroupedRegions {
  [regionId: string]: {
    regionId: number;
    regionName: string;
    regionCount: number[];
    polygon: string[];
    timestamp: string[];
    time_interval: number;
  };
}

interface realtimeHistoryDataState {
  realtimeHistoryData: GroupedRegions;
  loading: boolean;
  error: string | null;
}

const initialState: realtimeHistoryDataState = {
  realtimeHistoryData: {},
  loading: false,
  error: null,
};

const generateMockRealtimeHistoryData = () => {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60000);

  const toKST = (date: Date) => {
    return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString();
  };

  const timestamps = Array.from(
    { length: 30 },
    (_, i) => toKST(new Date(thirtyMinutesAgo.getTime() + i * 60000)) // Adjust to KST
  );

  const generateCounts = () =>
    Array.from({ length: timestamps.length }, () =>
      Math.floor(Math.random() * 15)
    );

  return {
    R1: {
      regionId: 1,
      regionName: "Cardiology",
      regionCount: generateCounts(),
      polygon: ["37.1234", "127.5678"],
      timestamp: [timestamps[0], timestamps[timestamps.length - 1]],
      time_interval: 1,
    },
    R2: {
      regionId: 2,
      regionName: "Neurology",
      regionCount: generateCounts(),
      polygon: ["36.9876", "126.5432"],
      timestamp: [timestamps[0], timestamps[timestamps.length - 1]],
      time_interval: 1,
    },
    R3: {
      regionId: 3,
      regionName: "Emergency_Room",
      regionCount: generateCounts(),
      polygon: ["37.7890", "127.4321"],
      timestamp: [timestamps[0], timestamps[timestamps.length - 1]],
      time_interval: 1,
    },
    R4: {
      regionId: 4,
      regionName: "Internal_Medicine",
      regionCount: generateCounts(),
      polygon: ["37.4567", "127.8765"],
      timestamp: [timestamps[0], timestamps[timestamps.length - 1]],
      time_interval: 1,
    },
  };
};

export const fetchRealtimeHistoryData = createAsyncThunk(
  "realtimeHistoryData/fetchRealtimeHistoryData",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockRealtimeHistoryData();
  }
);

export const realtimeHistoryDataSlice = createSlice({
  name: "realtimeHistoryData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealtimeHistoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRealtimeHistoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.realtimeHistoryData = action.payload;
      })
      .addCase(fetchRealtimeHistoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export const {} = realtimeHistoryDataSlice.actions;

export default realtimeHistoryDataSlice.reducer;
