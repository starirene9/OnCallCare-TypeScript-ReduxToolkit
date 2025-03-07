import { Navigate, Outlet } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const PrivateRoute = () => {
  const [storedValue] = useLocalStorage("username", "");
  return storedValue === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
