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

const generateMockRealtimeData = (): GroupedRegions => {
  return {
    R1: {
      regionName: "Cardiology",
      regionCount: Math.floor(Math.random() * 30) + 1, // 1~30 랜덤
      regionDrCount: Math.floor(Math.random() * 10) + 1, // 1~10 랜덤
      polygon: ["37.1234", "127.5678"],
      timestamp: [new Date().toISOString()],
    },
    R2: {
      regionName: "Neurology",
      regionCount: Math.floor(Math.random() * 25) + 1, // 1~25 랜덤
      regionDrCount: Math.floor(Math.random() * 5) + 1, // 1~5 랜덤
      polygon: ["36.9876", "126.5432"],
      timestamp: [new Date().toISOString()],
    },
    R3: {
      regionName: "Emergency Room",
      regionCount: Math.floor(Math.random() * 40) + 1, // 1~40 랜덤
      regionDrCount: Math.floor(Math.random() * 15) + 1, // 1~15 랜덤
      polygon: ["37.7890", "127.4321"],
      timestamp: [new Date().toISOString()],
    },
    R4: {
      regionName: "Internal Medicine",
      regionCount: Math.floor(Math.random() * 35) + 1, // 1~35 랜덤
      regionDrCount: Math.floor(Math.random() * 8) + 1, // 1~8 랜덤
      polygon: ["37.4567", "127.8765"],
      timestamp: [new Date().toISOString()],
    },
  };
};

export const fetchRealtimeData = createAsyncThunk(
  "realtimeData/fetchRealtimeData",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockRealtimeData();
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
