import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { AuthProps } from "../../App";
import userImage from "../../assets/user.png";
import adminImage from "../../assets/admin.png";
import DigitalClock from "../shared/DigitalClock";
import OnCallCareLogo from "../../assets/OnCallCare.png";
import Weather from "../shared/Weather";
import VariantButtonGroup from "../shared/ButtonGroup";
import { languageButtons, languageCodes } from "../../../src/utils";
import { useIntl } from "react-intl";

interface HeaderProps extends AuthProps {
  setLocale: (lang: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuthenticatedLS, setLocale }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [storedUserName] = useLocalStorage("username", "Guest");
  const [language, setLanguage] = useState("en");
  const intl = useIntl();

  const buttonStyles = languageCodes.map((code) => ({
    backgroundColor:
      language === code ? "var(--color-azure)" : "var(--color-light-silver)",
    color: language === code ? "var(--color-white)" : "var(--color-black)",
    "&:hover": { backgroundColor: "var(--color-azure)" },
  }));

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
    localStorage.removeItem("locale");
    navigate("/login");
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setLocale(lang);
    localStorage.setItem("locale", lang);
  };

  const onClickHandlers = languageCodes.map(
    (code) => () => handleLanguageChange(code)
  );

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
      <div className="flex items-center gap-8">
        <VariantButtonGroup
          buttonStyles={buttonStyles}
          buttons={languageButtons}
          onClickHandlers={onClickHandlers}
          variant="text"
          size="small"
        />
        <IconButton onClick={handleOpenMenu} onMouseEnter={handleOpenMenu}>
          <Avatar
            alt={intl.formatMessage(
              { id: "welcome" },
              { name: storedUserName }
            )}
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
            {intl.formatMessage({ id: "welcome" }, { name: storedUserName })}
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            {intl.formatMessage({ id: "logout" })}
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
