import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

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
  /* R001 ─────────────────────────────────────────────── */
  D005: {
    id: "D005",
    name: "Dr. Karen Lee",
    specialty: "Emergency_Medicine",
    onCall: true,
    contactInfo: "karen.lee@hospital.org",
    regionId: "R001", // Emergency Room
  },

  /* R002 ─────────────────────────────────────────────── */
  D001: {
    id: "D001",
    name: "Dr. Sarah Johnson",
    specialty: "Neurology",
    onCall: true,
    contactInfo: "sarah.johnson@hospital.org",
    regionId: "R002", // Neurology Ward
  },

  /* R003 ─────────────────────────────────────────────── */
  D006: {
    id: "D006",
    name: "Dr. Robert Green",
    specialty: "Postoperative_Care",
    onCall: false,
    contactInfo: "robert.green@hospital.org",
    regionId: "R003", // Recovery Room
  },

  /* R004 ─────────────────────────────────────────────── */
  D007: {
    id: "D007",
    name: "Dr. Anika Patel",
    specialty: "Critical_Care",
    onCall: true,
    contactInfo: "anika.patel@hospital.org",
    regionId: "R004", // Intensive Care Unit
  },

  /* R005 ─────────────────────────────────────────────── */
  D002: {
    id: "D002",
    name: "Dr. Michael Chen",
    specialty: "Emergency_Medicine",
    onCall: false,
    contactInfo: "michael.chen@hospital.org",
    regionId: "R005", // Triage Area
  },

  /* R006 ─────────────────────────────────────────────── */
  D008: {
    id: "D008",
    name: "Dr. David Park",
    specialty: "Cardiology",
    onCall: false,
    contactInfo: "david.park@hospital.org",
    regionId: "R006", // Cardiology Ward A
  },

  /* R007 ─────────────────────────────────────────────── */
  D003: {
    id: "D003",
    name: "Dr. Lisa Rodriguez",
    specialty: "Cardiology",
    onCall: true,
    contactInfo: "lisa.rodriguez@hospital.org",
    regionId: "R007", // Cardiac Monitor Room
  },

  /* R008 ─────────────────────────────────────────────── */
  D009: {
    id: "D009",
    name: "Dr. Olivia Kim",
    specialty: "Hospitalist",
    onCall: true,
    contactInfo: "olivia.kim@hospital.org",
    regionId: "R008", // Discharge Lounge
  },

  /* R009 ─────────────────────────────────────────────── */
  D004: {
    id: "D004",
    name: "Dr. James Wilson",
    specialty: "Internal_Medicine",
    onCall: false,
    contactInfo: "james.wilson@hospital.org",
    regionId: "R009", // Internal Medicine
  },

  /* R010 ─────────────────────────────────────────────── */
  D010: {
    id: "D010",
    name: "Dr. William Harris",
    specialty: "Cardiology",
    onCall: false,
    contactInfo: "william.harris@hospital.org",
    regionId: "R010", // Heart Check Zone
  },

  /* R011 ─────────────────────────────────────────────── */
  D011: {
    id: "D011",
    name: "Dr. Emily Davis",
    specialty: "Internal_Medicine",
    onCall: true,
    contactInfo: "emily.davis@hospital.org",
    regionId: "R011", // Observation Room 7
  },

  /* R012 ─────────────────────────────────────────────── */
  D012: {
    id: "D012",
    name: "Dr. Benjamin Nguyen",
    specialty: "Surgery",
    onCall: false,
    contactInfo: "ben.nguyen@hospital.org",
    regionId: "R012", // Post‑Op Observation
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

// 해당 병동(regionId)에 있는 의사 찾기
export const selectDoctorByRegion = (regionId: string) => (state: RootState) =>
  Object.values(state.doctors.doctors).find(
    (doctor) => doctor.regionId === regionId
  );

// 전체 의사 리스트
export const selectAllDoctors = (state: RootState) =>
  Object.values(state.doctors.doctors);

// 선택된 의사
export const selectSelectedDoctor = (state: RootState) =>
  state.doctors.selectedDoctorId
    ? state.doctors.doctors[state.doctors.selectedDoctorId]
    : null;
