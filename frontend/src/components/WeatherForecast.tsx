import { useEffect, useState } from 'react';
import { fetchWeather, WeatherData } from '@/services/weather';

export function WeatherForecast() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather()
      .then(setWeather)
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  if (!weather) {
    return <div className="card p-5 font-sans text-sm text-ink/50">Chargement de la météo...</div>;
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between border-b border-indigo/10 pb-3.5">
        <span className="font-display text-lg font-semibold text-indigo">Météo à Garoua</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{weather.icon}</span>
          <span className="font-display text-2xl font-semibold text-indigo">{weather.currentTemp}°</span>
        </div>
      </div>

      <div className="mt-3.5 flex gap-1.5 overflow-x-auto">
        {weather.days.map((day, i) => (
          <div
            key={day.date}
            className={`min-w-[64px] flex-1 rounded-2xl px-1 py-2.5 text-center ${i === 0 ? 'bg-sable' : ''}`}
          >
            <p className="font-mono text-[10px] uppercase text-ink/50">{day.dayLabel}</p>
            <p className="my-1.5 text-lg">{day.icon}</p>
            <p className="font-sans text-sm font-bold text-ink">{day.high}°</p>
            <p className="font-sans text-xs text-ink/40">{day.low}°</p>
            <p className="mt-0.5 font-mono text-[10px] text-benoue">{day.precipitationChance}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}