import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getPrayerTimes, type PrayerData } from '../services/prayerService';
import { format, differenceInSeconds } from 'date-fns';

const Dashboard: React.FC = () => {
  const { settings, quranProgress, habits } = useApp();
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [countdown, setCountdown] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const data = await getPrayerTimes(settings.location.city, settings.location.country);
        setPrayerData(data);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };
    fetchPrayers();
  }, [settings.location]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center p-4 justify-between bg-transparent">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <span className="material-symbols-outlined">bedtime</span>
        </div>
        <div className="flex-1 px-3">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Ramadan Buddy</h1>
          <p className="text-xs text-primary font-medium">{prayerData?.date.hijri.day} {prayerData?.date.hijri.month.en} {prayerData?.date.hijri.year} AH</p>
        </div>
        <div className="flex gap-2">
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-primary mb-4 uppercase tracking-widest">Countdown to Iftar</p>
          <div className="flex gap-4 justify-center">
            <TimeUnit value={countdown.h} label="Hours" />
            <div className="text-2xl font-bold flex items-center pt-2 text-primary">:</div>
            <TimeUnit value={countdown.m} label="Minutes" />
            <div className="text-2xl font-bold flex items-center pt-2 text-primary">:</div>
            <TimeUnit value={countdown.s} label="Seconds" />
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
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          Quran Progress
        </h3>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1b3a31] to-[#10221c] p-5 border border-white/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-primary font-medium uppercase tracking-wide">Overall Progress</p>
              <h4 className="text-2xl font-bold text-white">{quranProgress.completedPages} / {quranProgress.totalPages} Pages</h4>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
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
            <span>Continue where you left off</span>
            <button className="text-primary font-bold flex items-center uppercase">Continue <span className="material-symbols-outlined text-sm ml-1">chevron_right</span></button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-primary">task_alt</span>
          Daily Habits
        </h3>
        <div className="space-y-3">
          {habits.slice(0, 3).map(habit => (
            <HabitItem key={habit.id} habit={habit} isCompleted={habit.completedDays.includes(today)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
    <p className="text-[10px] uppercase font-semibold text-slate-400">{label}</p>
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
        <p className="text-xs text-slate-400">{isCompleted ? 'Completed' : 'Pending'}</p>
      </div>
    </div>
    <div className={`size-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary' : 'border-2 border-slate-600'}`}>
      {isCompleted && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
    </div>
  </div>
);

export default Dashboard;
