import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { regionNameMap } from "../../utils";

/* ───────────────────── Presentational Components ───────────────────── */
const RegionNode: React.FC<{
  name?: string;
  isActive?: boolean;
  isPast?: boolean;
  isNext?: boolean;
}> = ({ name = "—", isActive, isPast, isNext }) => {
  const getColor = () => {
    if (isActive) return "bg-blue-500";
    if (isPast) return "bg-gray-400";
    if (isNext) return "bg-green-400";
    return "bg-gray-200";
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${getColor()} text-white p-2 rounded-md w-24 flex items-center justify-center h-12 font-medium`}
      >
        {name}
      </div>
    </div>
  );
};

const Arrow: React.FC<{ isPast?: boolean }> = ({ isPast }) => (
  <div className="flex items-center mx-2">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={isPast ? "text-gray-400" : "text-green-400"}
    >
      <path fill="currentColor" d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" />
    </svg>
  </div>
);

/* ───────────────────── Container Component ───────────────────── */
interface NavigationDiagramProps {
  /** Patient ID stored in Redux */
  selectedId?: string | null;
  /** Pass a patient object directly (optional) */
  patientData?: {
    name?: string;
    location: {
      pastRegionId?: string;
      currentRegionId: string;
      nextRegionId?: string;
    };
  } | null;
}

const NavigationDiagram: React.FC<NavigationDiagramProps> = ({
  selectedId = null,
  patientData = null,
}) => {
  // 1️⃣ Prefer explicit patient data if provided
  const patientFromProp = patientData ?? null;

  const patientFromStore = useSelector(
    (state: RootState) => state.patients.patients[selectedId ?? ""] ?? null
  );

  const patient = patientFromProp || patientFromStore;

  if (!patient) {
    return (
      <div className="p-4 text-center text-gray-500">No patient selected</div>
    );
  }

  const patientName = patient.name ?? "Patient";
  const { pastRegionId, currentRegionId, nextRegionId } = patient.location;

  // const allDoctors = useSelector((state: RootState) => state.doctors.doctors);

  // const getDoctorByRegion = (regionId?: string) =>
  //   Object.values(allDoctors).find((doc) => doc.regionId === regionId)?.name ??
  //   "—";

  return (
    <div className="w-full p-4">
      {/* Header shows “Robert Williams's Route”, for example */}
      <div className="text-center mb-4 font-bold text-lg">
        {patientName}&apos;s Route
      </div>

      <div className="flex justify-center items-center">
        {/* Past location */}
        {pastRegionId && (
          <>
            <RegionNode name={regionNameMap[pastRegionId]} isPast />
            <Arrow isPast />
          </>
        )}

        {/* Current location */}
        <RegionNode name={regionNameMap[currentRegionId]} isActive />

        {/* Next location */}
        {nextRegionId && (
          <>
            <Arrow />
            <RegionNode name={regionNameMap[nextRegionId]} isNext />
          </>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center gap-4">
        <Legend color="bg-gray-400" label="Previous" />
        <Legend color="bg-blue-500" label="Current" />
        <Legend color="bg-green-400" label="Next" />
      </div>
      {/* Doctor Info Table (Transposed) */}
      <div className="mt-6 max-w-md mx-auto">
        <table className="table-auto w-full text-sm text-center border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 border">Role</th>
              <th className="px-3 py-2 border">Past</th>
              <th className="px-3 py-2 border">Current</th>
              <th className="px-3 py-2 border">Next</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2 border font-medium">Doctor</td>
              {/* <td className="px-3 py-2 border">
                {getDoctorByRegion(pastRegionId)}
              </td>
              <td className="px-3 py-2 border">
                {getDoctorByRegion(currentRegionId)}
              </td>
              <td className="px-3 py-2 border">
                {getDoctorByRegion(nextRegionId)}
              </td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Legend: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <div className="flex items-center">
    <div className={`w-3 h-3 ${color} rounded-full mr-2`} />
    <span className="text-sm">{label}</span>
  </div>
);

export default NavigationDiagram;
