import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomFutureDate } from "../../utils";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  photo: string;
  admissionReason: string;
  doctor: {
    name: string;
    specialty: string;
  };
  nextAppointment: string;
  status: string;
  firstSignIn: string[];
  lastSignOut: string[];
  location: {
    pastRegionId: string;
    currentRegionId: string;
    nextRegionId: string;
  };
}

interface PatientsState {
  patients: { [id: string]: Patient };
  loading: boolean;
  error: string | null;
  selectedPatientId: string | null;
}

const initialState: PatientsState = {
  patients: {},
  loading: false,
  error: null,
  selectedPatientId: null,
};

const samplePatients: { [id: string]: Patient } = {
  P001: {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    photo: "/api/placeholder/100/100",
    admissionReason: "Post-surgical recovery",
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Orthopedic Surgeon",
    },
    nextAppointment: getRandomFutureDate(),
    status: "Admitted",
    firstSignIn: ["2025-03-15T08:30:00"],
    lastSignOut: [],
    location: {
      pastRegionId: "R001",
      currentRegionId: "R002",
      nextRegionId: "R003",
    },
  },
  P002: {
    id: "P002",
    name: "Emily Johnson",
    age: 32,
    gender: "Female",
    photo: "/api/placeholder/100/100",
    admissionReason: "Pneumonia",
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "Pulmonologist",
    },
    nextAppointment: getRandomFutureDate(),
    status: "Critical",
    firstSignIn: ["2025-03-16T10:15:00"],
    lastSignOut: [],
    location: {
      pastRegionId: "R004",
      currentRegionId: "R005",
      nextRegionId: "",
    },
  },
  P003: {
    id: "P003",
    name: "Robert Williams",
    age: 58,
    gender: "Male",
    photo: "/api/placeholder/100/100",
    admissionReason: "Cardiac monitoring",
    doctor: {
      name: "Dr. Lisa Rodriguez",
      specialty: "Cardiologist",
    },
    nextAppointment: getRandomFutureDate(),
    status: "Stable",
    firstSignIn: ["2025-03-14T15:45:00"],
    lastSignOut: [],
    location: {
      pastRegionId: "R006",
      currentRegionId: "R007",
      nextRegionId: "R008",
    },
  },
  P004: {
    id: "P004",
    name: "Sophia Garcia",
    age: 29,
    gender: "Female",
    photo: "/api/placeholder/100/100",
    admissionReason: "Childbirth",
    doctor: {
      name: "Dr. James Wilson",
      specialty: "OB/GYN",
    },
    nextAppointment: getRandomFutureDate(),
    status: "Discharged",
    firstSignIn: ["2025-03-17T13:20:00"],
    lastSignOut: ["2025-03-19T09:30:00"],
    location: {
      pastRegionId: "R009",
      currentRegionId: "",
      nextRegionId: "",
    },
  },
  P005: {
    id: "P005",
    name: "David Kim",
    age: 67,
    gender: "Male",
    photo: "/api/placeholder/100/100",
    admissionReason: "Hip replacement",
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Orthopedic Surgeon",
    },
    nextAppointment: getRandomFutureDate(),
    status: "Stable",
    firstSignIn: ["2025-03-12T11:00:00"],
    lastSignOut: [],
    location: {
      pastRegionId: "R010",
      currentRegionId: "R011",
      nextRegionId: "R012",
    },
  },
};

export const fetchPatientsData = createAsyncThunk(
  "patientsData/fetchpatientsData",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return samplePatients;
  }
);

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    addPatient(state, action: PayloadAction<Patient>) {
      state.patients[action.payload.id] = action.payload;
    },
    updatePatient(state, action: PayloadAction<Patient>) {
      state.patients[action.payload.id] = {
        ...state.patients[action.payload.id],
        ...action.payload,
      };
    },
    deletePatient(state, action: PayloadAction<string>) {
      delete state.patients[action.payload];
    },
    selectPatient(state, action: PayloadAction<string>) {
      state.selectedPatientId = action.payload;
    },
    updatePatientLocation(
      state,
      action: PayloadAction<{
        patientId: string;
        location: {
          pastRegionId?: string;
          currentRegionId?: string;
          nextRegionId?: string;
        };
      }>
    ) {
      const { patientId, location } = action.payload;
      if (state.patients[patientId]) {
        state.patients[patientId].location = {
          ...state.patients[patientId].location,
          ...location,
        };
      }
    },
    updatePatientSignInOut(
      state,
      action: PayloadAction<{
        patientId: string;
        signInTime?: string;
        signOutTime?: string;
      }>
    ) {
      const { patientId, signInTime, signOutTime } = action.payload;
      if (state.patients[patientId]) {
        if (signInTime) {
          state.patients[patientId].firstSignIn.push(signInTime);
        }
        if (signOutTime) {
          state.patients[patientId].lastSignOut.push(signOutTime);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsData.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatientsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export const {
  addPatient,
  updatePatient,
  deletePatient,
  selectPatient,
  updatePatientLocation,
  updatePatientSignInOut,
} = patientsSlice.actions;

export default patientsSlice.reducer;
