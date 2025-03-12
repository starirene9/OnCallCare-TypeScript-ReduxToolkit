import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Button, ButtonGroup } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { AuthProps } from "../../App";
import userImage from "../../assets/user.png";
import adminImage from "../../assets/admin.png";
import DigitalClock from "../shared/DigitalClock";
import OnCallCareLogo from "../../assets/OnCallCare.png";
import Weather from "../shared/Weather";

const Header: React.FC<AuthProps> = ({ setIsAuthenticatedLS }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [storedUserName] = useLocalStorage("username", "Guest");
  const [language, setLanguage] = useState("Eng");
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsAuthenticatedLS(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "Kor" ? "Eng" : "Kor"));
    // console.log(`Language switched to: ${language}`);
    // 다국어 라이브러리 (i18next 등) 적용 가능
  };

  return (
    <header className="bg-blue-800 p-4 text-white fixed w-full top-0 h-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="left-22">
          <img src={OnCallCareLogo} alt="OnCall Care" className="w-32 h-16" />
        </div>
        <div className="flex flex-col">
          <DigitalClock />
          <Weather />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ButtonGroup variant="contained" size="small">
          <Button
            onClick={() => setLanguage("Kor")}
            sx={{
              backgroundColor: language === "Kor" ? "#1976d2" : "#ddd",
              color: language === "Kor" ? "#fff" : "#000",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Kor
          </Button>
          <Button
            onClick={() => setLanguage("Eng")}
            sx={{
              backgroundColor: language === "Eng" ? "#1976d2" : "#ddd",
              color: language === "Eng" ? "#fff" : "#000",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Eng
          </Button>
        </ButtonGroup>
        <IconButton onClick={handleOpenMenu} onMouseEnter={handleOpenMenu}>
          <Avatar
            alt="User Profile"
            src={storedUserName === "admin" ? adminImage : userImage}
            sx={{
              width: 60,
              height: 60,
              border: "1px solid gray",
            }}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          onMouseLeave={handleCloseMenu}
        >
          <MenuItem
            onClick={(e) => e.preventDefault()}
            sx={{ pointerEvents: "none" }}
          >
            Hello, {storedUserName} 👋
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
