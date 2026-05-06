/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { ChevronDown, } from "lucide-react";
import GlobeIcon from "../../../../public/svgs/leaderBoard/GlobeIcon";
const COUNTRIES = [
  { name: "All Countries", code: null },
  { name: "United States", code: "us" },
  { name: "Brazil", code: "br" },
  { name: "Japan", code: "jp" },
  { name: "Italy", code: "it" },
  { name: "United Kingdom", code: "gb" },
  { name: "Spain", code: "es" },
];

export default function CountryDropdown() {
  const [country, setCountry] = useState("All Countries");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCountryData = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];

  return (
    <div className="relative w-full sm:w-max sm:mt-0" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex w-full sm:w-max  px-4 py-3 items-center gap-2 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-3">
          {/* Main Button Icon Logic */}
          {selectedCountryData.code ? (
            <img
              src={`https://flagcdn.com/w20/${selectedCountryData.code}.png`}
              srcSet={`https://flagcdn.com/w40/${selectedCountryData.code}.png 2x`}
              alt={selectedCountryData.name}
              className="w-5 h-5 object-cover rounded-full drop-shadow-sm"
            />
          ) : (
            <GlobeIcon />
          )}

          <span className="truncate  dark:text-black">{country}</span>
        </div>
        <span
          className={`text-neutral-05 text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""
            }`}
        >
          <ChevronDown size={24} />
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0  top-14  w-[185px] bg-white border border-gray-100 rounded-lg shadow-lg  z-50 max-h-80 overflow-y-auto">
          {COUNTRIES.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setCountry(c.name);
                setIsDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${country === c.name
                  ? "bg-blue-50 text-[#385DFC] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {/* Dropdown Menu Icon Logic */}
              {c.code ? (
                <img
                  src={`https://flagcdn.com/w20/${c.code}.png`}
                  srcSet={`https://flagcdn.com/w40/${c.code}.png 2x`}
                  alt={c.name}
                  className="w-5 h-5 object-cover rounded-full drop-shadow-sm"
                />
              ) : (
                <GlobeIcon className="w-5 h-5 text-gray-500" />
              )}

              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}