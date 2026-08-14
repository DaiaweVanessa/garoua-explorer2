const GAROUA_LAT = 9.3017;
const GAROUA_LNG = 13.3921;

export interface WeatherDay {
  date: string;
  dayLabel: string;
  high: number;
  low: number;
  precipitationChance: number;
  icon: string;
  condition: string;
}

export interface WeatherData {
  currentTemp: number;
  icon: string;
  condition: string;
  days: WeatherDay[];
}

// Table de correspondance des codes météo WMO (standard Open-Meteo)
function describeWeatherCode(code: number): { icon: string; condition: string } {
  if (code === 0) return { icon: '☀️', condition: 'Ciel dégagé' };
  if (code === 1) return { icon: '🌤️', condition: 'Peu nuageux' };
  if (code === 2) return { icon: '⛅', condition: 'Ciel voilé' };
  if (code === 3) return { icon: '☁️', condition: 'Couvert' };
  if (code === 45 || code === 48) return { icon: '🌫️', condition: 'Brumeux' };
  if ([51, 53, 55].includes(code)) return { icon: '🌦️', condition: 'Bruine' };
  if ([61, 63, 65].includes(code)) return { icon: '🌧️', condition: 'Pluie' };
  if ([80, 81, 82].includes(code)) return { icon: '🌧️', condition: 'Averses' };
  if ([95, 96, 99].includes(code)) return { icon: '⛈️', condition: 'Orage' };
  return { icon: '⛅', condition: 'Variable' };
}

const dayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });

export async function fetchWeather(): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(GAROUA_LAT));
  url.searchParams.set('longitude', String(GAROUA_LNG));
  url.searchParams.set('current', 'temperature_2m,weather_code');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('timezone', 'Africa/Lagos');
  url.searchParams.set('forecast_days', '7');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Impossible de récupérer la météo');
  const data = await res.json();

  const current = describeWeatherCode(data.current.weather_code);

  const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => {
    const desc = describeWeatherCode(data.daily.weather_code[i]);
    return {
      date,
      dayLabel: i === 0 ? "Auj." : dayFormatter.format(new Date(date)),
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      precipitationChance: data.daily.precipitation_probability_max[i],
      icon: desc.icon,
      condition: desc.condition,
    };
  });

  return {
    currentTemp: Math.round(data.current.temperature_2m),
    icon: current.icon,
    condition: current.condition,
    days,
  };
}