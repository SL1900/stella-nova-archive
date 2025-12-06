import type { ReactNode } from "react";

const ButtonToggle = ({
  toggle,
  onToggle,
  children,
}: {
  toggle?: boolean;
  onToggle: () => void;
  children: ReactNode;
}) => {
  return (
    <button
      className={`flex justify-center items-center
			relative w-[40px] h-[40px] rounded-md pt-0.5
			${
        toggle == undefined || toggle
          ? `
				hover:bg-black/10 [.dark_&]:hover:bg-white/10
			`
          : `
				border-1
				bg-blue-500/10 [.dark_&]:bg-blue-300/10
				hover:bg-blue-500/20 [.dark_&]:hover:bg-blue-300/20
				text-blue-600 [.dark_&]:text-blue-400
			`
      }
			cursor-pointer font-bold`}
      onClick={onToggle}
      style={{
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

export default ButtonToggle;
