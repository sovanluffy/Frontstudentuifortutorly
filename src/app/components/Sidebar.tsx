import { Hotel, Plane, Train, Car, Sparkles, ShieldCheck, Settings } from 'lucide-react';

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const menuItems = [
    { icon: <Hotel size={16}/>, label: 'Hotels & Homes', active: true },
    { icon: <Plane size={16}/>, label: 'Flights' },
    { icon: <Train size={16}/>, label: 'Trains' },
    { icon: <Car size={16}/>, label: 'Cars' },
    { icon: <Sparkles size={16}/>, label: 'Attractions' },
    { icon: <ShieldCheck size={16}/>, label: 'Flight + Hotel' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${
      isOpen ? "w-52" : "w-0 opacity-0 overflow-hidden"
    }`}>
      {/* Navigation Container - Tighter Padding */}
      <nav className="flex-1 py-2 px-1.5 space-y-[1px] min-w-[208px]">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors relative rounded-md ${
              item.active 
                ? "bg-[#F0F2F5] text-[#0F294D]" 
                : "text-[#455873] hover:bg-gray-50 hover:text-[#0066FF]"
            }`}
          >
            <span className={item.active ? "text-[#0F294D]" : "text-[#8592A6]"}>
              {item.icon}
            </span>
            <span className={`text-[12.5px] whitespace-nowrap ${item.active ? "font-bold" : "font-medium"}`}>
              {item.label}
            </span>
            {/* Active Indicator - Subtle pill shape */}
            {item.active && (
              <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#0066FF] rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section - Compact */}
      <div className="p-2 border-t border-gray-50 min-w-[208px]">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-[#455873] hover:text-[#0066FF] transition-colors">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};