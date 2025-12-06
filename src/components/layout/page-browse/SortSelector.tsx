import { LayoutList } from "lucide-react";
import { useState } from "react";
import ButtonToggle from "../../common/button-toggle";
// import { useSortContext } from "./SortContext";

const SortSelector = () => {
  const [collapsed, setCollapsed] = useState(true);
  // const {sortQuery, setSortQuery} = useSortContext();

  function onToggle() {
    setCollapsed(!collapsed);
  }

  return (
    <div className="relative">
      <ButtonToggle toggle={collapsed} onToggle={onToggle}>
        <LayoutList />
      </ButtonToggle>
      <div
        className={`absolute flex justify-center items-center
				top-[110%] left-[50%] translate-x-[-50%] p-4
				max-w-full min-w-[280px] max-h-full min-h-[120px]
				border-1 border-black/30 [.dark_&]:border-white/30
				shadow-md shadow-black/30 [.dark_&]:shadow-white/30
				rounded-[20px] bg-white [.dark_&]:bg-black
				overflow-hidden transition-transform duration-200
				${collapsed ? "scale-x-0" : "scale-x-100"}`}
      >
        {/* <ButtonToggle toggle={} onToggle={}>

				</ButtonToggle> */}
      </div>
    </div>
  );
};

export default SortSelector;
