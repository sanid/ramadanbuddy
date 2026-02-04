import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getSurahs, getSurahWithTranslation, type Surah } from '../services/quranService';
import { cn } from '../utils/cn';

const Quran: React.FC = () => {
  const { quranProgress } = useApp();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<{ surah: Surah, ayahs: any[], translation: any[], audio: any[] } | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audio] = useState(new Audio());

  useEffect(() => {
    getSurahs().then(setSurahs);
  }, []);

  useEffect(() => {
    if (selectedSurah) {
      getSurahWithTranslation(selectedSurah).then(data => {
        setSurahData({
          surah: data[0],
          ayahs: data[0].ayahs,
          translation: data[1].ayahs,
          audio: data[2].ayahs
        });
      });
    }
  }, [selectedSurah]);

  const handlePlayAudio = (url: string, index: number) => {
    if (playingAyah === index) {
      audio.pause();
      setPlayingAyah(null);
    } else {
      audio.src = url;
      audio.play();
      setPlayingAyah(index);
      audio.onended = () => setPlayingAyah(null);
    }
  };

  const quranPercent = Math.round((quranProgress.completedPages / quranProgress.totalPages) * 100);

  if (selectedSurah && surahData) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedSurah(null)} className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
            </button>
            <div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{surahData.surah.name}</h2>
              <p className="text-xs text-slate-500 dark:text-[#9db9b0]">{surahData.surah.revelationType} • {surahData.surah.numberOfAyahs} Ayah</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-slate-900 dark:text-white text-[22px]">search</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col p-4 gap-8 pb-48">
          {surahData.ayahs.map((ayah, index) => (
            <div key={ayah.number} className="flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 flex-shrink-0">
                  {ayah.numberInSurah}
                </div>
                <div className="flex-grow">
                  <p className="text-right text-2xl leading-loose font-serif text-slate-900 dark:text-white" dir="rtl">{ayah.text}</p>
                </div>
              </div>
              <div className="pl-12">
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">{surahData.translation[index].text}</p>
              </div>
              <div className="flex gap-4 pl-12 pt-2">
                <span
                  className={cn("material-symbols-outlined text-slate-400 text-xl cursor-pointer hover:text-primary", playingAyah === index && "text-primary fill-1")}
                  onClick={() => handlePlayAudio(surahData.audio[index].audio, index)}
                >
                  {playingAyah === index ? 'pause_circle' : 'play_circle'}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-xl cursor-pointer hover:text-primary">bookmark</span>
              </div>
            </div>
          ))}
        </div>

        {playingAyah !== null && (
          <div className="fixed bottom-24 left-0 right-0 z-50 px-4">
             <div className="bg-primary text-background-dark p-3 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <span className="material-symbols-outlined animate-spin">music_note</span>
                   <p className="text-xs font-bold">Playing Surah {surahData.surah.englishName}, Ayah {playingAyah + 1}</p>
                </div>
                <button onClick={() => { audio.pause(); setPlayingAyah(null); }}>
                   <span className="material-symbols-outlined">close</span>
                </button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">The Noble Quran</h1>
      </header>

      <div className="flex flex-col gap-3 p-4 bg-primary/5 dark:bg-primary/10">
        <div className="flex gap-6 justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">auto_stories</span>
            <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Ramadan Goal</p>
          </div>
          <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">{quranPercent}%</p>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-[#3b544b] overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${quranPercent}%` }}></div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 dark:text-[#9db9b0] text-sm font-normal">Last read: Surah {quranProgress.lastSurah}</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 gap-3">
        {surahs.map(surah => (
          <button
            key={surah.number}
            onClick={() => setSelectedSurah(surah.number)}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-primary/10 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                {surah.number}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{surah.englishName}</p>
                <p className="text-xs text-slate-500">{surah.englishNameTranslation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-serif text-primary" dir="rtl">{surah.name}</p>
              <p className="text-[10px] text-slate-500">{surah.numberOfAyahs} Ayahs</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quran;
