import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

// Sample data for initial state
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
    nextAppointment: "March 21, 2025, 10:30 AM",
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
    nextAppointment: "March 20, 2025, 9:00 AM",
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
    nextAppointment: "March 22, 2025, 2:15 PM",
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
    nextAppointment: "March 25, 2025, 11:00 AM",
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
    nextAppointment: "March 23, 2025, 3:30 PM",
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

export const patientsSlice = createSlice({
  name: "patients",
  initialState: {
    ...initialState,
    patients: samplePatients, // Pre-populate with sample data
  },
  reducers: {
    fetchPatientsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess(
      state,
      action: PayloadAction<{ [id: string]: Patient }>
    ) {
      state.patients = action.payload;
      state.loading = false;
    },
    fetchPatientsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
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
});

export const {
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  addPatient,
  updatePatient,
  deletePatient,
  selectPatient,
  updatePatientLocation,
  updatePatientSignInOut,
} = patientsSlice.actions;

export default patientsSlice.reducer;
