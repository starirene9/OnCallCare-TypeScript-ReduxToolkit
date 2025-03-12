import { Routes, Route } from "react-router-dom";
import { useNav } from "../../context/NavContext";
import RealtimeDashboard from "../../pages/realtimeDashboard/RealtimeDashboard";
import Patients from "../../pages/patients/Patients";
import Alerts from "../../pages/alerts/Alerts";
import Doctors from "../../pages/doctors/Doctors";
import EmergencyBroadcast from "../../pages/emergencyBroadcast/EmergencyBroadcast";
import Hospitals from "../../pages/hospitals/Hospitals";
import PrivateRoute from "../../rotues/PrivateRoute";
import PageNotFound from "./PageNotFound";

const Main = () => {
  const { isOpen } = useNav();

  return (
    <main
      className={`transition-all duration-300 mt-20 p-3 flex-1 overflow-y-auto h-[calc(100vh-128px)] bg-gray-100 ${
        isOpen ? "ml-44" : "ml-22"
      }`}
    >
      <Routes>
        <Route path="/" element={<RealtimeDashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route element={<PrivateRoute />}>
          <Route path="/emergency-broadcast" element={<EmergencyBroadcast />} />
          <Route path="/nearby-hospitals" element={<Hospitals />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </main>
  );
};

export default Main;
