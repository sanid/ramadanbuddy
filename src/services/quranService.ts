const BASE_URL = 'https://api.alquran.cloud/v1';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio?: string;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export const getSurahs = async (): Promise<Surah[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  const data = await response.json();
  return data.data;
};

export const getSurahDetail = async (surahNumber: number, edition: string = 'quran-uthmani'): Promise<any> => {
  const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${edition}`);
  const data = await response.json();
  return data.data;
};

export const getSurahWithTranslation = async (surahNumber: number, audioEdition: string = 'ar.alafasy', translationEdition: string = 'de.aburida'): Promise<any> => {
  const response = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${translationEdition},${audioEdition}`);
  const data = await response.json();
  return data.data; // This returns an array of editions
};
