import { Hotel, Plane, Train, Car, Sparkles, ShieldCheck, MapPin, Settings } from 'lucide-react';

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const menuItems = [
    { icon: <Hotel size={18}/>, label: 'Hotels & Homes', active: true },
    { icon: <Plane size={18}/>, label: 'Flights' },
    { icon: <Train size={18}/>, label: 'Trains' },
    { icon: <Car size={18}/>, label: 'Cars' },
    { icon: <Sparkles size={18}/>, label: 'Attractions & Tours' },
    { icon: <ShieldCheck size={18}/>, label: 'Flight + Hotel' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${
      isOpen ? "w-60" : "w-0 opacity-0 overflow-hidden"
    }`}>
      <nav className="flex-1 py-4 px-2 space-y-[1px] min-w-[240px]">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors relative ${
              item.active ? "bg-[#F0F2F5] text-[#0F294D]" : "text-[#455873] hover:bg-gray-50"
            }`}
          >
            <span className={item.active ? "text-[#455873]" : "text-[#8592A6]"}>{item.icon}</span>
            <span className={`text-[13.5px] whitespace-nowrap ${item.active ? "font-bold" : "font-medium"}`}>
              {item.label}
            </span>
            {item.active && <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#0066FF]" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button className="flex items-center gap-3 px-3 py-2 text-[13.5px] font-medium text-[#455873] hover:text-[#0066FF]">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};