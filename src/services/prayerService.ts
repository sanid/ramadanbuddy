export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
    gregorian: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
      };
      year: string;
    };
  };
}

const BASE_URL = 'https://api.aladhan.com/v1';

export const getPrayerTimes = async (city: string, country: string, method: number = 2, school: number = 0): Promise<PrayerData> => {
  const response = await fetch(`${BASE_URL}/timingsByCity?city=${city}&country=${country}&method=${method}&school=${school}`);
  const data = await response.json();
  if (data.code === 200) {
    return data.data;
  }
  throw new Error('Failed to fetch prayer times');
};

export const getPrayerTimesByCoords = async (latitude: number, longitude: number, method: number = 2, school: number = 0): Promise<PrayerData> => {
  const response = await fetch(`${BASE_URL}/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`);
  const data = await response.json();
  if (data.code === 200) {
    return data.data;
  }
  throw new Error('Failed to fetch prayer times');
};
