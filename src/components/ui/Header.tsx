import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton, Button, ButtonGroup } from "@mui/material";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface WeatherData {
  temp: number;
  description: string;
  name: string;
}

const Header = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (auth: boolean) => void;
}) => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [language, setLanguage] = useState("Kor");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 60000); // 1분마다 갱신

    return () => clearInterval(weatherInterval);
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Seoul&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      setWeather({
        temp: data?.main?.temp,
        description: data?.weather[0]?.description,
        name: data?.name,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "Kor" ? "Eng" : "Kor"));
    // console.log(`Language switched to: ${language}`);
    // 다국어 라이브러리 (i18next 등) 적용 가능
  };

  return (
    <header className="bg-blue-600 p-4 text-white fixed w-full top-0 h-20 flex items-center justify-between px-6">
      <div className="left-22">
        <h1 className="text-lg font-bold">OnCall Care</h1>
        <p className="text-sm">
          {timestamp} |{" "}
          {weather
            ? `${weather.name} ${weather.temp}°C, ${weather.description}`
            : "Loading..."}
        </p>
      </div>
      <div className="flex items-center gap-4">
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
            src="https://via.placeholder.com/150"
            sx={{ width: 40, height: 40 }}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          onMouseLeave={handleCloseMenu}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
