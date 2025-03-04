import { Routes, Route } from "react-router-dom";
import { useNav } from "../../context/NavContext";
import RealtimeDashboard from "../../pages/realtimeDashboard/RealtimeDashboard";
import Patients from "../../pages/patients/Patients";
import Alerts from "../../pages/alerts/Alerts";
import Doctors from "../../pages/doctors/Doctors";

const Main = () => {
  const { isOpen } = useNav();

  return (
    <main
      className={`transition-all duration-300 mt-20 p-5 flex-1 overflow-y-auto bg-gray-100 ${
        isOpen ? "ml-44" : "ml-22"
      }`}
    >
      <Routes>
        <Route path="/" element={<RealtimeDashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>
    </main>
  );
};

export default Main;
