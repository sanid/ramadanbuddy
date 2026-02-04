import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getPrayerTimes, getPrayerTimesByCoords, type PrayerData } from '../services/prayerService';
import { format, differenceInSeconds } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import dailyInsights from '../data/daily_insights.json';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { settings, quranProgress, habits } = useApp();
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [countdown, setCountdown] = useState({ h: '00', m: '00', s: '00' });

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
    if (!prayerData) return;

    const timer = setInterval(() => {
      const now = new Date();
      const maghribStr = prayerData.timings.Maghrib;
      const [hours, minutes] = maghribStr.split(':').map(Number);
      let maghribTime = new Date();
      maghribTime.setHours(hours, minutes, 0);

      if (maghribTime < now) {
        // If Maghrib has passed, show countdown to next day's Maghrib or just 00:00:00
        setCountdown({ h: '00', m: '00', s: '00' });
        return;
      }

      const totalSeconds = differenceInSeconds(maghribTime, now);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      setCountdown({
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerData]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const quranPercent = Math.round((quranProgress.completedPages / quranProgress.totalPages) * 100);

  const hijriDay = prayerData ? parseInt(prayerData.date.hijri.day) : 1;
  const todayInsight = dailyInsights.find(i => i.day === hijriDay) || dailyInsights[0];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center p-4 justify-between bg-transparent">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <span className="material-symbols-outlined">bedtime</span>
        </div>
        <div className="flex-1 px-3">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Ramadan Buddy</h1>
          <p className="text-xs text-primary font-medium">{prayerData?.date.hijri.day} {prayerData?.date.hijri.month.ar} {prayerData?.date.hijri.year} AH</p>
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-primary mb-3 uppercase tracking-widest">Countdown bis Iftar</p>
          <div className="flex gap-3 justify-center">
            <TimeUnit value={countdown.h} label="Std" />
            <div className="text-xl font-bold flex items-center pt-2 text-primary">:</div>
            <TimeUnit value={countdown.m} label="Min" />
            <div className="text-xl font-bold flex items-center pt-2 text-primary">:</div>
            <TimeUnit value={countdown.s} label="Sek" />
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <p>{settings.location.city}, {settings.location.country}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-8">
        <div className="grid grid-cols-5 gap-2">
          <PrayerTimeSmall label="Fajr" time={prayerData?.timings.Fajr} />
          <PrayerTimeSmall label="Dhuhr" time={prayerData?.timings.Dhuhr} />
          <PrayerTimeSmall label="Asr" time={prayerData?.timings.Asr} />
          <PrayerTimeSmall label="Maghrib" time={prayerData?.timings.Maghrib} active />
          <PrayerTimeSmall label="Isha" time={prayerData?.timings.Isha} />
        </div>
      </div>

      <div className="px-4 mb-8">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          Quran Fortschritt
        </h3>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1b3a31] to-[#10221c] p-4 border border-white/10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] text-primary font-medium uppercase tracking-wide">Gesamtfortschritt</p>
              <h4 className="text-xl font-bold text-white">{quranProgress.completedPages} / {quranProgress.totalPages} Seiten</h4>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
              <svg className="absolute -rotate-90 w-12 h-12">
                <circle className="text-primary" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - quranPercent / 100)} strokeWidth="4"></circle>
              </svg>
              <span className="text-[10px] font-bold text-white">{quranPercent}%</span>
            </div>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${quranPercent}%` }}></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>Lesen fortsetzen</span>
            <button
              onClick={() => navigate(`/quran?surah=${quranProgress.lastSurah}`)}
              className="text-primary font-bold flex items-center uppercase"
            >
              Weiter <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-primary">task_alt</span>
          Tägliche Habits
        </h3>
        <div className="space-y-3">
          {habits.slice(0, 3).map(habit => (
            <HabitItem key={habit.id} habit={habit} isCompleted={habit.completedDays.includes(today)} />
          ))}
        </div>
      </div>

      <div className="px-4 space-y-6">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-primary">volunteer_activism</span>
          Daily Insights
        </h3>

        {/* Verse of the Day */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
            <p className="text-primary text-xs font-bold uppercase tracking-widest">Vers des Tages</p>
          </div>
          <p className="text-slate-900 dark:text-white text-lg font-bold mb-2">{todayInsight.verse.reference}</p>
          <p className="text-slate-800 dark:text-slate-200 text-xl text-right font-serif mb-2" dir="rtl">{todayInsight.verse.arabic}</p>
          <p className="text-slate-600 dark:text-slate-400 text-sm italic border-l-2 border-primary/30 pl-3">{todayInsight.verse.german}</p>
        </div>

        {/* Hadith of the Day */}
        <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">chat_bubble</span>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Hadith des Tages</p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-primary/20 text-primary">{todayInsight.hadith.source}</span>
          </div>
          <p className="text-slate-900 dark:text-white text-lg font-medium italic mb-2">"{todayInsight.hadith.text}"</p>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Überliefert von {todayInsight.hadith.narrator}</p>
        </div>

        {/* Historical Event */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-sm">history</span>
            <p className="text-primary text-xs font-bold uppercase tracking-widest">Historisches Ereignis</p>
          </div>
          <p className="text-slate-900 dark:text-white text-lg font-bold">{todayInsight.historicalEvent.title}</p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{todayInsight.historicalEvent.description}</p>
        </div>
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
    <p className="text-[8px] uppercase font-semibold text-slate-400">{label}</p>
  </div>
);

const PrayerTimeSmall = ({ label, time, active }: { label: string, time?: string, active?: boolean }) => (
  <div className={`flex flex-col items-center p-2 rounded-lg border ${active ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'}`}>
    <p className={`text-[10px] mb-1 ${active ? 'text-primary' : 'text-slate-400'}`}>{label}</p>
    <p className={`text-xs font-bold ${active ? 'text-primary' : ''}`}>{time || '--:--'}</p>
  </div>
);

const HabitItem = ({ habit, isCompleted }: { habit: any, isCompleted: boolean }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{habit.icon}</span>
      </div>
      <div>
        <p className="font-bold">{habit.name}</p>
        <p className="text-xs text-slate-400">{isCompleted ? 'Erledigt' : 'Offen'}</p>
      </div>
    </div>
    <div className={`size-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary' : 'border-2 border-slate-600'}`}>
      {isCompleted && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
    </div>
  </div>
);

export default Dashboard;
