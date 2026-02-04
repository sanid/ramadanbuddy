import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, eachDayOfInterval, isSameDay, addDays, subDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '../utils/cn';

const Tracker: React.FC = () => {
  const { habits, prayerCompletion, toggleHabit, togglePrayer, addHabit } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('favorite');

  const availableIcons = [
    'favorite', 'menu_book', 'restaurant_menu', 'nights_stay',
    'auto_awesome', 'volunteer_activism', 'water_drop', 'fitness_center',
    'self_improvement', 'psychology', 'schedule', 'edit_note'
  ];

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit({
        id: Date.now().toString(),
        name: newHabitName,
        icon: newHabitIcon,
        color: 'primary',
      });
      setNewHabitName('');
      setIsAddingHabit(false);
    }
  };

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const todayPrayers = prayerCompletion[dateKey] || {};

  const prayers = [
    { name: 'Fajr', icon: 'wb_twilight', time: '04:42 AM' },
    { name: 'Dhuhr', icon: 'light_mode', time: '12:15 PM' },
    { name: 'Asr', icon: 'partly_cloudy_day', time: '03:45 PM' },
    { name: 'Maghrib', icon: 'wb_shade', time: '06:32 PM' },
    { name: 'Isha', icon: 'bedtime', time: '08:05 PM' },
  ];

  const days = eachDayOfInterval({
    start: subDays(selectedDate, 3),
    end: addDays(selectedDate, 3),
  });

  const completedPrayersCount = Object.values(todayPrayers).filter(Boolean).length;

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col pb-24">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center p-4 justify-between">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">mosque</span>
          </div>
          <h1 className="text-base font-bold leading-tight tracking-tight flex-1 text-center">Habit & Gebet</h1>
          <div className="flex w-10 items-center justify-end">
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <section className="p-4">
          <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedDate(subDays(selectedDate, 7))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-0.5">Ramadan 1445</p>
                <p className="text-sm font-bold">{format(selectedDate, 'MMMM yyyy', { locale: de })}</p>
              </div>
              <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "h-12 flex flex-col items-center justify-center rounded-xl transition-all",
                    isSameDay(day, selectedDate)
                      ? "bg-primary text-slate-950 font-bold shadow-lg shadow-primary/20 ring-2 ring-primary/20"
                      : "hover:bg-primary/10"
                  )}
                >
                  <span className="text-[10px] uppercase opacity-60">{format(day, 'eee').charAt(0)}</span>
                  <span className="text-xs">{format(day, 'd')}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-base font-bold tracking-tight">Salah Tracker</h2>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-tight">
              {completedPrayersCount} / 5 Erledigt
            </span>
          </div>
          <div className="space-y-3">
            {prayers.map((prayer) => (
              <label
                key={prayer.name}
                className={cn(
                  "flex items-center justify-between p-3.5 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm active:scale-[0.98] transition-transform",
                  todayPrayers[prayer.name] && "border-primary/30 ring-1 ring-primary/10"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center transition-colors",
                    todayPrayers[prayer.name] ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}>
                    <span className="material-symbols-outlined text-xl">{prayer.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{prayer.name}</p>
                    <p className={cn("text-[10px] font-medium", todayPrayers[prayer.name] ? "text-primary" : "text-slate-500")}>
                      {todayPrayers[prayer.name] ? 'Erledigt' : prayer.time}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!!todayPrayers[prayer.name]}
                  onChange={() => togglePrayer(dateKey, prayer.name)}
                  className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-transparent checked:bg-primary checked:border-primary text-slate-950 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="px-4 py-6 mb-12">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-base font-bold tracking-tight">Eigene Habits</h2>
            <button
              onClick={() => setIsAddingHabit(!isAddingHabit)}
              className="text-primary text-[11px] font-bold flex items-center gap-1 uppercase tracking-tight"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span> {isAddingHabit ? 'Abbrechen' : 'Neu hinzufügen'}
            </button>
          </div>

          {isAddingHabit && (
            <div className="mb-6 p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-primary/20 shadow-lg">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Habit Name"
                className="w-full mb-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent p-2 text-sm focus:ring-primary"
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Icon wählen</p>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {availableIcons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewHabitIcon(icon)}
                    className={cn(
                      "size-10 rounded-lg flex items-center justify-center transition-all",
                      newHabitIcon === icon ? "bg-primary text-background-dark shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddHabit}
                className="w-full bg-primary text-background-dark py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
              >
                Habit speichern
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3">
            {habits.map((habit) => {
              const isCompleted = habit.completedDays.includes(dateKey);
              const colorClasses: Record<string, string> = {
                'primary': 'bg-primary/10 text-primary',
                'orange-500': 'bg-orange-500/10 text-orange-500',
                'blue-500': 'bg-blue-500/10 text-blue-500',
                'purple-500': 'bg-purple-500/10 text-purple-500',
                'accent-gold': 'bg-accent-gold/10 text-accent-gold',
              };
              return (
                <div key={habit.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/60">
                  <div className={cn("size-10 rounded-xl flex items-center justify-center", colorClasses[habit.color] || 'bg-primary/10 text-primary')}>
                    <span className="material-symbols-outlined">{habit.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-bold text-sm transition-all", isCompleted && "line-through opacity-60 text-primary")}>
                      {habit.name}
                    </p>
                    {habit.description && <p className="text-[10px] text-slate-500 font-medium">{habit.description}</p>}
                  </div>
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleHabit(habit.id, dateKey)}
                    className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-transparent checked:bg-primary checked:border-primary text-slate-950 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Tracker;
