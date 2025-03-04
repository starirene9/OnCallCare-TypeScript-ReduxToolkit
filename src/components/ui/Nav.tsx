import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); // 현재 URL 경로 가져오기

  const navItems = [
    { to: "/", icon: <DashboardIcon />, label: "Dashboard" },
    { to: "/patients", icon: <PeopleIcon />, label: "Patients" },
    { to: "/alerts", icon: <NotificationsActiveIcon />, label: "Alerts" },
    { to: "/doctors", icon: <LocalHospitalIcon />, label: "Doctors" },
  ];

  return (
    <nav
      className={`bg-gray-800 text-white fixed left-0 top-20 h-[calc(100vh-5rem)] p-6 flex flex-col space-y-4 transition-all duration-300 z-50 ${
        isOpen ? "w-44" : "w-22"
      }`}
    >
      {navItems.map(({ to, icon, label }) => (
        <Tooltip key={label} title={!isOpen ? label : ""} placement="right">
          <Link
            to={to}
            className={`py-2 px-2 rounded-md flex items-center space-x-2 transition-all duration-200
              ${
                location.pathname === to ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
          >
            {icon}
            {isOpen && <span>{label}</span>}
          </Link>
        </Tooltip>
      ))}
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
