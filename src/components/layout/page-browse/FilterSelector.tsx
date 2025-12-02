const FilterSelector = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div
      className={`transition-[height] duration-200 ${
        collapsed ? "h-[0]" : "h-[64px]"
      }`}
    >
      <div className="h-full bg-white [.dark_&]:bg-black"></div>
    </div>
  );
};

export default FilterSelector;
