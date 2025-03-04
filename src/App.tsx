import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./App.css";

import Header from "./components/ui/Header";
import Nav from "./components/ui/Nav";
import Footer from "./components/ui/Footer";

// 페이지 컴포넌트
import RealtimeDashboard from "./pages/realtimeDashboard/RealtimeDashboard";
import Patients from "./pages/patients/patients";
import Alerts from "./pages/alerts/alerts";
import Doctors from "./pages/doctors/doctors";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1">
            <Nav />
            <main className="ml-44 mt-20 p-5 flex-1 overflow-y-auto h-[calc(100vh-120px)]">
              <Routes>
                <Route path="/" element={<RealtimeDashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/doctors" element={<Doctors />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}
export default App;
