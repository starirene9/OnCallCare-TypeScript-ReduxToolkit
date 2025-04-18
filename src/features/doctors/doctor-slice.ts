import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  onCall: boolean;
  contactInfo: string;
  regionId: string;
}

interface DoctorsState {
  doctors: { [id: string]: Doctor };
  loading: boolean;
  error: string | null;
  selectedDoctorId: string | null;
}

// 🚀 Dummy doctors for prototyping
const sampleDoctors: { [id: string]: Doctor } = {
  D001: {
    id: "D001",
    name: "Dr. Sarah Johnson",
    specialty: "Neurology",
    onCall: true,
    contactInfo: "sarah.johnson@hospital.org",
    regionId: "R002",
  },
  D002: {
    id: "D002",
    name: "Dr. Michael Chen",
    specialty: "Emergency_Room",
    onCall: false,
    contactInfo: "michael.chen@hospital.org",
    regionId: "R005",
  },
  D003: {
    id: "D003",
    name: "Dr. Lisa Rodriguez",
    specialty: "Cardiology",
    onCall: true,
    contactInfo: "lisa.rodriguez@hospital.org",
    regionId: "R007",
  },
  D004: {
    id: "D004",
    name: "Dr. James Wilson",
    specialty: "Internal_Medicine",
    onCall: false,
    contactInfo: "james.wilson@hospital.org",
    regionId: "R009",
  },
};

// 🌐 Async thunk to simulate server fetch
export const fetchDoctorsData = createAsyncThunk(
  "doctors/fetchDoctorsData",
  async () => {
    // simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return sampleDoctors;
  }
);

const initialState: DoctorsState = {
  doctors: {},
  loading: false,
  error: null,
  selectedDoctorId: null,
};

export const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    addDoctor(state, action: PayloadAction<Doctor>) {
      state.doctors[action.payload.id] = action.payload;
    },
    updateDoctor(
      state,
      action: PayloadAction<Partial<Doctor> & { id: string }>
    ) {
      const { id, ...updates } = action.payload;
      const existing = state.doctors[id];
      if (existing) {
        state.doctors[id] = { ...existing, ...updates };
      }
    },
    deleteDoctor(state, action: PayloadAction<string>) {
      delete state.doctors[action.payload];
    },
    selectDoctor(state, action: PayloadAction<string>) {
      state.selectedDoctorId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsData.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctorsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch doctors";
      });
  },
});

export const { addDoctor, updateDoctor, deleteDoctor, selectDoctor } =
  doctorsSlice.actions;

export default doctorsSlice.reducer;
