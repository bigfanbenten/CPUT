/**
 * CPUT INTERNATIONAL - COUNTRY CONFIGURATION
 * Hệ thống cấu hình quốc gia cho Cơm Phần Út Trinh
 */

export type CountryCode = 'VN' | 'KR' | 'JP' | 'US';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  nativeName: string;
  flag: string;
  shortLabel: string;
  editionName: string;
  styleDescription: string;
}

export const COUNTRIES: Record<CountryCode, CountryInfo> = {
  VN: {
    code: 'VN',
    name: 'Việt Nam',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    shortLabel: 'VN',
    editionName: 'Bản Gốc Việt Nam',
    styleDescription: 'Cơm Nhà Truyền Thống chuẩn vị Út Trinh',
  },
  KR: {
    code: 'KR',
    name: 'Korea',
    nativeName: '한국어',
    flag: '🇰🇷',
    shortLabel: 'KR',
    editionName: 'K-Food Cute Edition',
    styleDescription: 'Homepage phong cách K-Food Cute',
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    nativeName: '日本語',
    flag: '🇯🇵',
    shortLabel: 'JP',
    editionName: 'Modern Washoku Edition',
    styleDescription: 'Homepage phong cách Modern Washoku (Đang chuẩn bị)',
  },
  US: {
    code: 'US',
    name: 'USA',
    nativeName: 'English',
    flag: '🇺🇸',
    shortLabel: 'US',
    editionName: 'Premium American Dining Edition',
    styleDescription: 'Homepage phong cách Premium American Dining',
  },
};

export const COUNTRY_LIST: CountryInfo[] = [
  COUNTRIES.VN,
  COUNTRIES.KR,
  COUNTRIES.JP,
  COUNTRIES.US,
];

export const hasStoredCountry = (): boolean => {
  try {
    const saved = localStorage.getItem(CPUT_COUNTRY_STORAGE_KEY);
    return saved === 'VN' || saved === 'KR' || saved === 'JP' || saved === 'US';
  } catch {
    return false;
  }
};

export const getUrlCountryParam = (): CountryCode | null => {
  try {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const country = (params.get('country') || params.get('lang'))?.toUpperCase();
    if (country === 'VN' || country === 'KR' || country === 'JP' || country === 'US') {
      return country as CountryCode;
    }
  } catch {
    // ignore
  }
  return null;
};

export const getStoredCountry = (): CountryCode => {
  try {
    // Check URL parameter first if present
    const urlCountry = getUrlCountryParam();
    if (urlCountry) {
      return urlCountry;
    }
    const saved = localStorage.getItem(CPUT_COUNTRY_STORAGE_KEY);
    if (saved === 'KR' || saved === 'JP' || saved === 'US') {
      return saved;
    }
    return 'VN';
  } catch {
    return 'VN';
  }
};

export const setStoredCountry = (code: CountryCode): void => {
  try {
    localStorage.setItem(CPUT_COUNTRY_STORAGE_KEY, code);
  } catch (e) {
    console.warn('Cannot write country to localStorage:', e);
  }
};

