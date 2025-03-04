import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { NavProvider } from "./context/NavContext";
import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/ui/Header";
import Nav from "./components/ui/Nav";
import Footer from "./components/ui/Footer";
import Main from "./components/ui/Main";
import Login from "./pages/login/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("isLoggedIn")
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("isLoggedIn"));
    };

    window.addEventListener("storage", checkAuth); // 다른 탭에서도 로그인 상태 유지

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <Provider store={store}>
      <NavProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {isAuthenticated && (
              <Header setIsAuthenticated={setIsAuthenticated} />
            )}
            <div className="flex flex-1">
              {isAuthenticated && <Nav />}
              <Routes>
                <Route
                  path="/login"
                  element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route
                  path="/*"
                  element={
                    isAuthenticated ? <Main /> : <Navigate to="/login" />
                  }
                />
              </Routes>
            </div>
            {isAuthenticated && <Footer />}
          </div>
        </Router>
      </NavProvider>
    </Provider>
  );
}

export default App;
