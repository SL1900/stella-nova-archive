import { Menu } from "lucide-react";
import SidebarData from "./SidebarData";

const Sidebar = ({
  onToggleSidebar,
  collapsed,
}: {
  onToggleSidebar: () => void;
  collapsed: boolean;
}) => {
  return (
    <aside
      aria-expanded={!collapsed}
      className={`overflow-hidden flex flex-col p-3.5 fixed md:static h-full
      border-r border-black/20 [.dark_&]:border-white/20
      shadow-md shadow-black/20 [.dark_&]:shadow-white/20
      bg-gradient-to-b from-[#f3fdff] to-white
      [.dark_&]:from-[#0b1220] [.dark_&]:to-black
      transition-[width] duration-200 z-10
      ${collapsed ? "w-[72px]" : "w-[260px]"}`}
    >
      <div
        className="flex items-center h-16 pb-3
        border-b border-black/30 [.dark_&]:border-white/30"
      >
        <button
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex flex-row justify-top items-center
          h-full w-full p-[6px_10px]
          rounded-md hover:bg-black/5 [.dark_&]:hover:bg-white/5"
        >
          <div className="absolute">
            <Menu />
          </div>
          <span
            className={`
              font-bold ml-9 origin-left duration-200
              ${collapsed ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
            `}
          >
            Library
          </span>
        </button>
      </div>

      <div className="flex flex-col justify-between h-full">
        <nav className="flex flex-col gap-2 mt-3" aria-label="Sidebar">
          <SidebarData sidebarCollapsed={collapsed} />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
