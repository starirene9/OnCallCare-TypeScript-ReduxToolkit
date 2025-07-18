import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CampaignIcon from "@mui/icons-material/Campaign";
import MapIcon from "@mui/icons-material/Map";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNav } from "../../context/NavContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useIntl } from "react-intl";
import ScienceIcon from "@mui/icons-material/Science";

const Nav = () => {
  const { isOpen, setIsOpen } = useNav();
  const location = useLocation(); // 현재 URL 경로 가져오기
  const [storedValue] = useLocalStorage("username", "");
  const intl = useIntl();

  let navItems = [];

  storedValue === "admin"
    ? (navItems = [
        {
          to: "/",
          icon: <DashboardIcon />,
          label: intl.formatMessage({ id: "dashboard" }),
        },
        {
          to: "/patients",
          icon: <PeopleIcon />,
          label: intl.formatMessage({ id: "patients_menu" }),
        },
        {
          to: "/doctors",
          icon: <LocalHospitalIcon />,
          label: intl.formatMessage({ id: "doctors" }),
        },
        {
          to: "/alerts",
          icon: <NotificationsActiveIcon />,
          label: intl.formatMessage({ id: "alerts" }),
        },
        {
          to: "/ai-imaging-lab",
          icon: <ScienceIcon />,
          label: intl.formatMessage({ id: "ai_imaging_lab" }),
        },
        {
          to: "/emergency-broadcast",
          icon: <CampaignIcon />,
          label: intl.formatMessage({ id: "emergency_broadcast" }),
        },
        {
          to: "/nearby-hospitals",
          icon: <MapIcon />,
          label: intl.formatMessage({ id: "nearby_hospitals" }),
        },
      ])
    : (navItems = [
        {
          to: "/",
          icon: <DashboardIcon />,
          label: intl.formatMessage({ id: "dashboard" }),
        },
        {
          to: "/patients",
          icon: <PeopleIcon />,
          label: intl.formatMessage({ id: "patients_menu" }),
        },
        {
          to: "/doctors",
          icon: <LocalHospitalIcon />,
          label: intl.formatMessage({ id: "doctors" }),
        },
        {
          to: "/alerts",
          icon: <NotificationsActiveIcon />,
          label: intl.formatMessage({ id: "alerts" }),
        },
      ]);

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
404;
