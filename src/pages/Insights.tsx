import React from 'react';
import insightsData from '../data/insights.json';

const Insights: React.FC = () => {
  // For demonstration, we'll pick the insight for day 12 as per design,
  // or the first one if not available.
  const insight = insightsData.find(i => i.day === 12) || insightsData[0];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <div className="text-primary flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-3xl">mosque</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Daily Insights</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6 pb-24">
        {/* Verse of the Day */}
        <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="w-full bg-center bg-no-repeat aspect-[21/9] bg-cover bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800')]">
          </div>
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Verse of the Day</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-900 dark:text-white text-xl font-bold">{insight.verse.reference}</p>
              <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed text-right font-serif" dir="rtl">
                {insight.verse.arabic}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm italic border-l-2 border-primary/30 pl-3">
                "{insight.verse.translation}"
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
              <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-xl">bookmark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hadith of the Day */}
        <div className="p-5 rounded-xl bg-primary/10 border border-primary/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">chat_bubble</span>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Hadith of the Day</p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-primary/20 text-primary">{insight.hadith.source}</span>
          </div>
          <p className="text-slate-900 dark:text-white text-lg font-medium leading-snug italic">
            "{insight.hadith.text}"
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-xs">{insight.hadith.narrator}</p>
        </div>

        {/* Historical Event */}
        <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="w-full bg-center bg-no-repeat aspect-video bg-cover bg-[url('https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=800')]">
          </div>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">history</span>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Historical Event</p>
            </div>
            <p className="text-slate-900 dark:text-white text-lg font-bold">{insight.historicalEvent.title}</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {insight.historicalEvent.description}
            </p>
          </div>
        </div>

        {/* Islamic Figure */}
        <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Islamic Figure</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="size-20 shrink-0 rounded-full bg-primary/20 overflow-hidden border-2 border-primary/30">
                <div className="w-full h-full bg-center bg-cover bg-[url('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200')]"></div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{insight.figure.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{insight.figure.period}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug">
                  {insight.figure.description}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold flex items-center justify-center gap-2">
                Read Biography
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
