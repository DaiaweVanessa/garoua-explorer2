import { useEffect, useState } from 'react';
import { fetchWeather, WeatherData } from '@/services/weather';

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather()
      .then(setWeather)
      .catch(() => setError(true));
  }, []);

  if (error || !weather) return null;

  const today = weather.days[0];

  return (
    <div className="mx-auto w-full max-w-xs rounded-3xl bg-gradient-to-br from-indigo to-indigo-dark p-5 text-sable-light shadow-card">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-semibold">📍 Garoua</span>
        <span className="font-mono text-[10px] text-sable-light/50">à l'instant</span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <span className="text-4xl">{weather.icon}</span>
        <div>
          <p className="font-display text-3xl font-semibold leading-none">{weather.currentTemp}°</p>
          <p className="mt-1 text-xs text-sable-light/75">{weather.condition}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-4 font-mono text-xs text-sable-light/80">
        <span>
          Min <b className="font-semibold text-savane">{today.low}°</b>
        </span>
        <span>
          Max <b className="font-semibold text-savane">{today.high}°</b>
        </span>
      </div>

      {today.precipitationChance > 0 && (
        <p className="mt-2 text-xs text-sable-light/65">
          🌧️ {today.precipitationChance}% de chance de pluie aujourd'hui
        </p>
      )}
    </div>
  );
}