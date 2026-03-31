import { useState, useMemo } from 'react';
import { X, Search, Sparkles, Check, ChevronLeft, ArrowRight, BookOpen } from 'lucide-react';

export function FullScreenSubjectExplorer({ subjects, isOpen, onClose, onSelect, currentSelection }: any) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<any | null>(null);

  // Determine what to show: Sub-subjects or Main Categories
  const displayItems = useMemo(() => {
    const list = activeCategory ? activeCategory.subSubjects : subjects;
    return list.filter((item: any) => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, subjects, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Header with Navigation */}
      <div className="px-8 py-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {activeCategory && (
            <button 
              onClick={() => { setActiveCategory(null); setSearch(""); }}
              className="p-3 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              {activeCategory ? activeCategory.name : "Choose a Subject"}
            </h2>
            {activeCategory && <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Select a specialized topic</p>}
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all">
          <X size={24} />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            autoFocus
            placeholder={activeCategory ? `Search in ${activeCategory.name}...` : "What do you want to learn?"}
            className="w-full h-16 pl-16 pr-8 bg-slate-50 rounded-2xl font-bold text-lg outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item: any) => {
            const isSelected = currentSelection === item.name;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!activeCategory && item.subSubjects) {
                    setActiveCategory(item); // Transition to sub-subjects
                    setSearch("");
                  } else {
                    onSelect(item.name); // Final Selection
                    onClose();
                    setActiveCategory(null);
                  }
                }}
                className={`group flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all text-left
                  ${isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 bg-white hover:border-indigo-200 hover:shadow-lg'}`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all
                  ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                  {/* If your mock data has an 'icon' property, use it here, otherwise default to BookOpen */}
                  {item.icon ? <item.icon size={24} /> : <BookOpen size={24} />}
                </div>

                <div className="flex-1">
                  <p className="font-black text-slate-800 uppercase tracking-tight">{item.name}</p>
                  {!activeCategory && item.subSubjects && (
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                      {item.subSubjects.length} Specialized Topics
                    </p>
                  )}
                </div>

                {isSelected ? (
                  <Check size={20} className="text-indigo-600" strokeWidth={3} />
                ) : (
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}