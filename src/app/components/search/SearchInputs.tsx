import { Search, ChevronDown } from "lucide-react";

interface SearchInputsProps {
  searchValue: string;
  setSearchValue: (val: string) => void;
  onSearch: () => void;
}

export function SearchInputs({ searchValue, setSearchValue, onSearch }: SearchInputsProps) {
  return (
    <div className="bg-white rounded-xl rounded-tl-none shadow-lg p-1.5 flex flex-col lg:flex-row items-stretch gap-1.5 border border-white">
      
      {/* 1. Destination Input - Slimmer Padding */}
      <div className="flex-[1.4] px-3 py-1.5 border border-slate-100 rounded-lg group hover:border-blue-400 transition-colors cursor-text">
        <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">
          Destination
        </label>
        <input 
          type="text" 
          placeholder="Where to learn?" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full text-[14px] font-bold text-[#0F294D] outline-none bg-transparent placeholder:text-slate-300 placeholder:font-medium"
        />
      </div>

      {/* 2. Date Range Group - Fixed layout, no floating badges */}
      <div className="flex-1 flex border border-slate-100 rounded-lg overflow-hidden group hover:border-blue-400 transition-colors">
        <div className="flex-1 px-3 py-1.5 hover:bg-slate-50 cursor-pointer border-r border-slate-50 transition-colors">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Check-in</p>
          <span className="text-[14px] font-bold text-[#0F294D] whitespace-nowrap">Apr 2</span>
        </div>
        
        <div className="flex-1 px-3 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Check-out</p>
          <span className="text-[14px] font-bold text-[#0F294D] whitespace-nowrap">Apr 3</span>
        </div>
      </div>

      {/* 3. Guests Selector - Tighter text */}
      <div className="flex-1 px-3 py-1.5 border border-slate-100 rounded-lg hover:border-blue-400 hover:bg-slate-50 cursor-pointer group transition-all">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Guests</p>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[14px] font-bold text-[#0F294D] truncate">1 room, 2 adults</span>
          <ChevronDown size={14} className="text-slate-400 shrink-0" />
        </div>
      </div>

      {/* 4. Action Button - Scaled to match input height */}
      <div className="flex items-center">
        <button 
          onClick={onSearch}
          className="h-full bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-bold transition-all active:scale-[0.98] min-w-[120px]"
        >
          <Search size={18} strokeWidth={3} />
          <span className="text-[15px]">Search</span>
        </button>
      </div>
    </div>
  );
}