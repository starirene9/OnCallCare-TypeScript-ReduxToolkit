import { useState, useEffect } from "react";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface WeatherData {
  temp: number;
  description: string;
  name: string;
}

export const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

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

  return (
    <p className="text-[0.85rem]">
      {weather
        ? `${weather.name} ${weather.temp}°C, ${weather.description}`
        : "Loading..."}
    </p>
  );
};

export default Weather;
