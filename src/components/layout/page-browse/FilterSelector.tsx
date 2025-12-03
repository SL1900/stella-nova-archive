import { useEffect, useState } from "react";
import { filterTags } from "../../../scripts/structs/tag-data";
import { Check } from "lucide-react";

const FilterSelector = ({ collapsed }: { collapsed: boolean }) => {
  const [checkedTags, setCheckedTags] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    // Initialize all tags as unchecked
    Object.keys(filterTags).forEach((tag) => {
      setCheckedTags((prev) => ({ ...prev, [tag]: false }));
    });
  }, []);

  function toggleTag(tag: string) {
    setCheckedTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  }

  return (
    <div
      className={`transition-[height] duration-200 ${
        collapsed ? "h-[0] overflow-hidden" : "h-[180px]"
      }`}
    >
      <div
        className="h-full px-4 pt-3 pb-1 bg-white [.dark_&]:bg-black
        border-b-5 border-black/20 [.dark_&]:border-white/20 border-double
        shadow-md shadow-black/10 [.dark_&]:shadow-white/10
        inset-shadow-sm inset-shadow-black/30 [.dark_&]:inset-shadow-white/30"
      >
        {filterTags && (
          <div
            className="h-full pb-2 px-2 grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))]
            justify-center items-top overflow-x-hidden"
          >
            {Object.entries(filterTags).map(([key, tags]) => (
              <div key={key} className="p-2 flex flex-col min-w-max">
                <button
                  className={`flex px-2 py-1 items-center
                  border-b-1 border-black/30 [.dark_&]:border-white/30
                  ${
                    checkedTags[key]
                      ? `
                    justify-between
                    bg-blue-500/10 [.dark_&]:bg-blue-300/10
                    text-blue-600 [.dark_&]:text-blue-400
                    hover:bg-blue-500/20 [.dark_&]:hover:bg-blue-300/20
                  `
                      : `
                    justify-start
                    hover:bg-black/10 [.dark_&]:hover:bg-white/10
                  `
                  }`}
                  onClick={() => toggleTag(key)}
                >
                  <span className="font-semibold text-sm">{key}</span>
                  {checkedTags[key] && <Check size={16} />}
                </button>
                <div className="flex flex-col gap-2 mt-1 px-1">
                  {tags.sub.length > 0 &&
                    tags.sub.map((subTag) => (
                      <button
                        key={subTag}
                        className="px-3 py-1 bg-[var(--btn-bg)] [.dark_&]:bg-[var(--btn-bg-dark)]
                        text-sm rounded-full shadow-sm shadow-black/20 [.dark_&]:shadow-white/20
                        hover:bg-[var(--btn-bg-hover)] [.dark_&]:hover:bg-[var(--btn-bg-hover-dark)]"
                      >
                        {subTag}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSelector;
