import { X } from "lucide-react";
import type { ReactNode } from "react";

const OverlayModal = ({
  onClose,
  active,
  title,
  children,
  canDismiss: canDismiss = true,
}: {
  onClose: () => void;
  active: boolean;
  title: string;
  children: ReactNode;
  canDismiss?: boolean;
}) => {
  if (!active) return null;

  return (
    <div
      className="fixed flex justify-center items-center inset-0 bg-black/50"
      onClick={() => (canDismiss ? onClose() : {})}
    >
      <div
        className="p-5 max-w-full min-w-[180px] max-h-full min-h-[120px]
        border-1 border-black/30 [.dark_&]:border-white/30
        shadow-md shadow-black/50 [.dark_&]:shadow-white/50
        rounded-[20px] bg-white [.dark_&]:bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex flex-row items-center gap-8
          ${canDismiss ? "justify-between" : "justify-center"}
          pb-4 border-b border-black/30 [.dark_&]:border-white/30`}
        >
          <div
            className={`font-bold text-2xl ${!canDismiss ? "text-center" : ""}`}
          >
            {title}
          </div>
          {canDismiss && (
            <button className="relative flex cursor-pointer" onClick={onClose}>
              <X />
            </button>
          )}
        </div>
        <div className="mt-4 p-2">{children}</div>
      </div>
    </div>
  );
};

export default OverlayModal;
