import { Search, ChevronDown } from "lucide-react";

interface SearchInputsProps {
  searchValue: string;
  setSearchValue: (val: string) => void;
  onSearch: () => void;
}

export function SearchInputs({ searchValue, setSearchValue, onSearch }: SearchInputsProps) {
  return (
    <div className="bg-white rounded-2xl rounded-tl-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 flex flex-col lg:flex-row items-stretch gap-2 border border-white">
      
      {/* 1. Destination Input */}
      <div className="flex-[1.2] px-4 py-2 border border-slate-200 rounded-lg group hover:border-blue-400 transition-colors cursor-text">
        <label className="text-[11px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wide">
          Destination
        </label>
        <input 
          type="text" 
          placeholder="City, airport, region, or tutor name" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full text-[15px] font-bold text-[#0F294D] outline-none bg-transparent placeholder:text-slate-300 placeholder:font-medium"
        />
      </div>

      {/* 2. Date Range Group (Check-in / Out) */}
      <div className="flex-1 flex border border-slate-200 rounded-lg overflow-hidden group hover:border-blue-400 transition-colors">
        <div className="flex-1 px-4 py-2 hover:bg-slate-50 cursor-pointer border-r border-slate-100 transition-colors">
          <p className="text-[11px] text-slate-400 font-bold mb-0.5 uppercase tracking-wide">Check-in</p>
          <span className="text-[15px] font-bold text-[#0F294D]">Thu, Apr 2</span>
        </div>
        
        {/* Floating Night Indicator */}
        <div className="flex items-center justify-center px-1 bg-white relative z-10">
          <span className="text-[10px] text-slate-500 font-semibold bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 whitespace-nowrap">
            1 night
          </span>
        </div>

        <div className="flex-1 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors">
          <p className="text-[11px] text-slate-400 font-bold mb-0.5 uppercase tracking-wide">Check-out</p>
          <span className="text-[15px] font-bold text-[#0F294D]">Fri, Apr 3</span>
        </div>
      </div>

      {/* 3. Guests Selector */}
      <div className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-slate-50 cursor-pointer group transition-all">
        <p className="text-[11px] text-slate-400 font-bold mb-0.5 uppercase tracking-wide">Rooms and guests</p>
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#0F294D]">1 room, 2 adults, 0 children</span>
          <ChevronDown size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* 4. The Action Button (Primary Trip.com Style) */}
      <div className="flex items-center pl-2 pr-1">
        <button 
          onClick={onSearch}
          className="h-full min-h-[52px] bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center justify-center gap-2 px-10 py-3 rounded-lg font-bold transition-all shadow-md active:scale-95 min-w-[140px]"
        >
          <Search size={22} strokeWidth={2.5} />
          <span className="text-lg">Search</span>
        </button>
      </div>
    </div>
  );
}