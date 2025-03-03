import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav
      className={`bg-gray-800 text-white fixed left-0 top-20 h-[calc(100vh-5rem)] p-6 flex flex-col space-y-4 transition-all duration-300 z-50  ${
        isOpen ? "w-44" : "w-22"
      }`}
    >
      <Link
        to="/"
        className="py-2 px-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
      >
        <DashboardIcon />
        {isOpen && <span>Dashboard</span>}
      </Link>
      <Link
        to="/patients"
        className="py-2 px-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
      >
        <PeopleIcon />
        {isOpen && <span>Patients</span>}
      </Link>
      <Link
        to="/alerts"
        className="py-2 px-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
      >
        <NotificationsActiveIcon />
        {isOpen && <span>Alerts</span>}
      </Link>
      <Link
        to="/doctors"
        className="py-2 px-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
      >
        <LocalHospitalIcon />
        {isOpen && <span>Doctors</span>}
      </Link>
      <button
        className="mt-auto mb-4 p-2 rounded-md hover:bg-gray-700 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </button>
    </nav>
  );
};

export default Nav;
