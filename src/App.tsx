import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { NavProvider } from "./context/NavContext";
import { useEffect } from "react";
import "./App.css";

import Header from "./components/ui/Header";
import Nav from "./components/ui/Nav";
import Footer from "./components/ui/Footer";
import Main from "./components/ui/Main";
import Login from "./pages/login/Login";
import useLocalStorage from "./hooks/useLocalStorage";

export interface AuthProps {
  isAuthenticatedLS?: boolean;
  setIsAuthenticatedLS: (auth: boolean) => void;
}

function App() {
  const [isAuthenticatedLS, setIsAuthenticatedLS] = useLocalStorage(
    "isLoggedIn",
    false
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticatedLS(!!localStorage.getItem("isLoggedIn"));
    };

    window.addEventListener("storage", checkAuth); // 다른 탭에서도 로그인 상태 유지

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [setIsAuthenticatedLS]);

  return (
    <Provider store={store}>
      <NavProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {isAuthenticatedLS && (
              <Header setIsAuthenticatedLS={setIsAuthenticatedLS} />
            )}
            <div className="flex flex-1">
              {isAuthenticatedLS && <Nav />}
              <Routes>
                <Route
                  path="/login"
                  element={
                    <Login setIsAuthenticatedLS={setIsAuthenticatedLS} />
                  }
                />
                <Route
                  path="/*"
                  element={
                    isAuthenticatedLS ? <Main /> : <Navigate to="/login" />
                  }
                />
              </Routes>
            </div>
            {isAuthenticatedLS && <Footer />}
          </div>
        </Router>
      </NavProvider>
    </Provider>
  );
}

export default App;
