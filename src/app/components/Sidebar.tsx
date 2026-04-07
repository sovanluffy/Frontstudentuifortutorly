import { Book, Users, CalendarCheck, UserCheck, Award, Settings } from 'lucide-react';

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const menuItems = [
    { icon: <UserCheck size={16} />, label: 'Profile', active: true },
    { icon: <Book size={16} />, label: 'Tutor Class' },
    { icon: <Users size={16} />, label: 'Student Class' },
    { icon: <CalendarCheck size={16} />, label: 'My Class Booking' },
    { icon: <Award size={16} />, label: 'Certificates' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${
      isOpen ? "w-52" : "w-0 opacity-0 overflow-hidden"
    }`}>
      
      {/* Navigation Container */}
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
            {item.active && (
              <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#0066FF] rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-2 border-t border-gray-50 min-w-[208px]">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-[#455873] hover:text-[#0066FF] transition-colors">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};