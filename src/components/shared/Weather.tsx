import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface WeatherData {
  temp: number;
  description: string;
  name: string;
}

export const Weather = () => {
  const intl = useIntl();
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
        description: data?.weather[0]?.description
          .toLowerCase()
          .replace(/\s/g, "_"),
        name: data?.name.toLowerCase(),
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <p className="text-[0.85rem]">
      {weather
        ? intl.formatMessage(
            { id: "weather_in" },
            {
              city: intl.formatMessage({ id: weather.name }), // ✅ 지역(도시)도 다국어 적용
              temp: weather.temp,
              description: intl.formatMessage({ id: weather.description }), // ✅ 날씨 상태 다국어 적용
            }
          )
        : intl.formatMessage({ id: "loading" })}
    </p>
  );
};

export default Weather;
