const FilterSelector = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div
      className={`transition-[height] duration-200 ${
        collapsed ? "h-[0]" : "h-[64px]"
      }`}
    >
      <div
        className="h-full bg-white [.dark_&]:bg-black
        shadow-md shadow-black/10 [.dark_&]:shadow-white/10
        inset-shadow-sm inset-shadow-black/30 [.dark_&]:inset-shadow-white/30"
      ></div>
    </div>
  );
};

export default FilterSelector;
