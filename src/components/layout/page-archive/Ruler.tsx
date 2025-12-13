const Ruler = ({
  orientation,
  cursorPos,
}: {
  orientation: "horizontal" | "vertical";
  cursorPos: number;
  label?: number;
}) => {
  const isHorizontal = orientation === "horizontal";
  const tickCount = 200; // adjust if needed
  const tickSpacing = 20;

  return (
    <div
      className={`
        relative bg-gray-200 border-gray-400 select-none text-[10px] overflow-hidden
        ${isHorizontal ? "border-b rounded-t-md" : "border-r rounded-l-md"}
      `}
    >
      {/* --- Ticks --- */}
      {Array.from({ length: tickCount }).map((_, i) => {
        const isEven = i % 2 === 0;

        return (
          <div
            key={i}
            className="absolute bg-black"
            style={
              isHorizontal
                ? {
                    left: i * tickSpacing,
                    top: 0,
                    width: 1,
                    height: isEven ? "70%" : "40%",
                  }
                : {
                    top: i * tickSpacing,
                    left: 0,
                    height: 1,
                    width: isEven ? "70%" : "40%",
                  }
            }
          />
        );
      })}

      {/* --- Cursor marker --- */}
      <div
        className={`
          absolute bg-red-500 pointer-events-none
          ${isHorizontal ? "top-0 bottom-0 w-[1px]" : "left-0 right-0 h-[1px]"}
        `}
        style={isHorizontal ? { left: cursorPos } : { top: cursorPos }}
      />
    </div>
  );
};

export default Ruler;
