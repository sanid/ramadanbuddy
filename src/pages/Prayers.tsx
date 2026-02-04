import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getPrayerTimes, getPrayerTimesByCoords, type PrayerData } from '../services/prayerService';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const Prayers: React.FC = () => {
  const { settings, setSettings } = useApp();
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        let data;
        if (settings.location.lat && settings.location.lng && !settings.location.isManual) {
          data = await getPrayerTimesByCoords(settings.location.lat, settings.location.lng, 2, settings.school);
        } else {
          data = await getPrayerTimes(settings.location.city, settings.location.country, 2, settings.school);
        }
        setPrayerData(data);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };
    fetchPrayers();
  }, [settings.location, settings.school]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextPrayer = () => {
    if (!prayerData) return null;
    const now = format(currentTime, 'HH:mm');
    const timings = prayerData.timings;
    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const name of prayerNames) {
       if (timings[name as keyof typeof timings] > now) {
          return { name, time: timings[name as keyof typeof timings] };
       }
    }
    return { name: 'Fajr', time: timings.Fajr }; // Next day's Fajr
  };

  const nextPrayer = getNextPrayer();

  const prayerList = [
    { name: 'Fajr', sub: 'Dämmerung', icon: 'wb_twilight', color: 'blue-500' },
    { name: 'Sunrise', sub: 'Schuruq', icon: 'light_mode', color: 'orange-500', isPassive: true, label: 'Sonnenaufgang' },
    { name: 'Dhuhr', sub: 'Mittag', icon: 'sunny', color: 'primary' },
    { name: 'Asr', sub: 'Nachmittag', icon: 'partly_cloudy_day', color: 'yellow-600' },
    { name: 'Maghrib', sub: 'Iftar Zeit', icon: 'clear_night', color: 'red-500' },
    { name: 'Isha', sub: 'Nacht', icon: 'bedtime', color: 'purple-500' },
  ];

  const handleAutoDetect = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Ideally we would reverse geocode here, but for now we just save coords
        setSettings({
          ...settings,
          location: {
            ...settings.location,
            lat: latitude,
            lng: longitude,
            isManual: false
          }
        });
      }, (error) => {
        alert("Standort konnte nicht ermittelt werden: " + error.message);
      });
    } else {
      alert("Geolokalisierung wird von diesem Browser nicht unterstützt.");
    }
  };

  const [showManual, setShowManual] = useState(false);
  const [manualCity, setManualCity] = useState(settings.location.city);
  const [manualCountry, setManualCountry] = useState(settings.location.country);

  const handleManualSave = () => {
    setSettings({
      ...settings,
      location: {
        city: manualCity,
        country: manualCountry,
        isManual: true
      }
    });
    setShowManual(false);
  };

  return (
    <div className="flex flex-col flex-1 pb-32">
      <header className="flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between sticky top-0 z-50">
        <div className="text-[#111816] dark:text-white flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
        </div>
        <h2 className="text-[#111816] dark:text-white text-lg font-bold leading-tight flex-1 text-center">Gebetszeiten</h2>
        <div className="flex w-12 items-center justify-end">
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
        <div className="mb-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Ramadan Tag {prayerData?.date.hijri.day || '--'}
        </div>
        <h1 className="text-[#111816] dark:text-white tracking-tight text-[52px] font-bold leading-tight">
          {format(currentTime, 'HH:mm')}
          <span className="text-xl ml-1 font-medium opacity-60">{format(currentTime, 'ss')}</span>
        </h1>
        {nextPrayer && (
          <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-primary">
            <span className="material-symbols-outlined">schedule</span>
            <span>{nextPrayer.name} at {nextPrayer.time}</span>
          </div>
        )}
        <p className="text-[#111816]/60 dark:text-white/60 text-sm mt-1 italic">
          Imsak: {prayerData?.timings.Imsak} • Iftar: {prayerData?.timings.Maghrib}
        </p>
      </div>

      <div className="px-4 mb-6">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#3b544b] bg-white dark:bg-[#111816] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <p className="text-[#111816] dark:text-white text-base font-bold leading-tight">
                  {settings.location.city}, {settings.location.country}
                </p>
              </div>
              <p className="text-[#111816]/60 dark:text-[#9db9b0] text-sm font-normal leading-normal ml-6">Basierend auf Einstellungen</p>
            </div>
            <button className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAutoDetect}
              className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold"
            >
              <span>Auto-Erkennung</span>
            </button>
            <button
              onClick={() => setShowManual(!showManual)}
              className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-100 dark:bg-white/10 text-[#111816] dark:text-white text-sm font-bold border border-gray-200 dark:border-transparent"
            >
              <span>Manuell</span>
            </button>
          </div>
          {showManual && (
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder="Stadt"
                className="rounded-lg border border-gray-200 dark:border-white/10 bg-transparent p-2 text-sm"
              />
              <input
                type="text"
                value={manualCountry}
                onChange={(e) => setManualCountry(e.target.value)}
                placeholder="Land"
                className="rounded-lg border border-gray-200 dark:border-white/10 bg-transparent p-2 text-sm"
              />
              <button
                onClick={handleManualSave}
                className="bg-primary text-background-dark rounded-lg py-2 font-bold text-sm"
              >
                Speichern
              </button>
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="hanafi"
              checked={settings.school === 1}
              onChange={(e) => setSettings({...settings, school: e.target.checked ? 1 : 0})}
              className="rounded text-primary focus:ring-primary"
            />
            <label htmlFor="hanafi" className="text-xs text-[#111816]/60 dark:text-[#9db9b0]">Hanafi Asr Zeit verwenden</label>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[#111816] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Heutiger Zeitplan</h3>
          <div className="flex items-center gap-1 text-primary text-sm font-medium">
            <span>Hijri: {prayerData?.date.hijri.day}. {prayerData?.date.hijri.month.ar} {prayerData?.date.hijri.year}</span>
          </div>
        </div>
        <div className="space-y-3">
          {prayerList.map((p) => {
            const isNext = nextPrayer?.name === p.name;
            const time = prayerData?.timings[p.name as keyof typeof prayerData.timings] || '--:--';
            const colorClasses: Record<string, string> = {
              'blue-500': 'bg-blue-500/10 text-blue-500',
              'orange-500': 'bg-orange-500/10 text-orange-500',
              'primary': 'bg-primary/10 text-primary',
              'yellow-600': 'bg-yellow-600/10 text-yellow-600',
              'red-500': 'bg-red-500/10 text-red-500',
              'purple-500': 'bg-purple-500/10 text-purple-500',
            };
            const iconColorClasses: Record<string, string> = {
              'blue-500': 'text-blue-500',
              'orange-500': 'text-orange-500',
              'primary': 'text-primary',
              'yellow-600': 'text-yellow-600',
              'red-500': 'text-red-500',
              'purple-500': 'text-purple-500',
            };

            return (
              <div
                key={p.name}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all",
                  isNext
                    ? "bg-primary/10 dark:bg-primary/20 border-primary shadow-lg shadow-primary/5"
                    : "bg-white dark:bg-[#111816]/50 border-gray-100 dark:border-white/5",
                  p.isPassive && "opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("size-10 rounded-full flex items-center justify-center", isNext ? "bg-primary" : (colorClasses[p.color] || 'bg-primary/10'))}>
                    <span className={cn("material-symbols-outlined", isNext ? "text-background-dark" : (iconColorClasses[p.color] || 'text-primary'))}>{p.icon}</span>
                  </div>
                  <div>
                    <p className={cn("font-bold", isNext ? "text-[#111816] dark:text-white" : "")}>{(p as any).label || p.name}</p>
                    <p className={cn("text-xs", isNext ? "text-primary font-medium" : "text-[#111816]/40 dark:text-white/40")}>
                      {isNext ? 'Nächstes Gebet' : p.sub}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-bold", isNext ? "text-[#111816] dark:text-white text-xl" : "")}>{time}</p>
                  <span className={cn("material-symbols-outlined text-lg", isNext ? "text-primary" : "text-[#111816]/20 dark:text-white/20")}>
                    {isNext ? 'notifications_active' : 'notifications'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Prayers;
