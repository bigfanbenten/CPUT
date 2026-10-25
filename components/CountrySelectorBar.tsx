import React from 'react';
import { CountryCode, COUNTRY_LIST } from '../countryConfig';
import { Globe } from 'lucide-react';

interface CountrySelectorBarProps {
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  className?: string;
}

export const CountrySelectorBar: React.FC<CountrySelectorBarProps> = ({
  selectedCountry,
  onSelectCountry,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 md:gap-1.5 p-1 rounded-full bg-stone-100/90 backdrop-blur-sm border border-stone-200/80 shadow-inner shrink-0 ${className}`}
      role="group"
      aria-label="Chọn quốc gia"
    >
      <div className="flex items-center gap-1 pl-1.5 pr-1 text-stone-500 shrink-0">
        <Globe size={13} className="text-amber-800 animate-pulse" />
        <span className="hidden lg:inline text-[9px] font-black uppercase tracking-wider text-stone-600">
          Quốc gia:
        </span>
      </div>

      <div className="flex items-center gap-1">
        {COUNTRY_LIST.map((country) => {
          const isActive = selectedCountry === country.code;
          return (
            <button
              key={country.code}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSelectCountry(country.code);
              }}
              title={`${country.name} (${country.nativeName}) - ${country.styleDescription}`}
              className={`group relative flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-full text-xs transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-amber-800 text-white font-black shadow-md scale-105 ring-1 ring-amber-600'
                  : 'bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 font-semibold border border-transparent hover:border-stone-200'
              }`}
            >
              <span className="text-sm md:text-base leading-none select-none transition-transform group-hover:scale-110">
                {country.flag}
              </span>
              <span className="text-[9px] md:text-[10px] tracking-tight uppercase whitespace-nowrap">
                <span className="md:hidden">{country.shortLabel}</span>
                <span className="hidden md:inline font-bold">{country.nativeName}</span>
              </span>
              {isActive && (
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-300 ml-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CountrySelectorBar;
