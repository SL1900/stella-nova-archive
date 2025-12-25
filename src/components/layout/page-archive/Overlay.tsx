import { useMemo, useEffect, useRef } from "react";
import type { ItemData } from "../../../scripts/structs/item-data";
import { useOverlayContext } from "./OverlayContext";
import { DEFAULT_COLOR } from "../../../scripts/color";

const Overlay = ({
  item,
  resolution,
  display,
  offset,
}: {
  item: ItemData | null;
  resolution: { w: number; h: number };
  display: { x: number; y: number; w: number; h: number };
  offset: {
    x: number;
    y: number;
  };
}) => {
  const overlays = useMemo(() => {
    if (!item || !item?.overlays || resolution.w === 0 || resolution.h === 0)
      return [];

    const scaleX = display.w / resolution.w;
    const scaleY = display.h / resolution.h;

    return item.overlays.map((o) => {
      const { x, y, w, h } = o.bounds;

      return {
        id: o.id,
        left: offset.x + x * scaleX,
        top: offset.y + y * scaleY,
        width: w * scaleX,
        height: h * scaleY,
        rotation: o.rotation,
        shear: o.shear,
      };
    });
  }, [item, resolution, display]);

  const { overlayActive, overlayMetas, setOverlayMeta, setOverlayTransform } =
    useOverlayContext();

  useEffect(() => {
    if (!item?.overlays) return;

    item.overlays.forEach((o) =>
      setOverlayMeta({
        [o.id]: {
          color: o.color && o.color.length > 0 ? o.color : DEFAULT_COLOR,
          hover: false,
        },
      })
    );
  }, [item]);

  function toggleOverlayHover(id: string, to: boolean) {
    setOverlayMeta({
      [id]: { hover: to },
    });
  }

  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    overlays.forEach(({ id }) => {
      const overlay = overlayRefs.current[id];
      if (!overlay) return;

      const rect = overlay.getBoundingClientRect();

      setOverlayTransform(true, id, {
        p: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        t: rect.top,
        b: rect.bottom,
        l: rect.left,
        r: rect.right,
      });
    });
  }, [overlays]);

  return (
    <>
      {overlays.map((o) => {
        const color = overlayMetas ? overlayMetas[o.id]?.color : "#888888";
        return (
          <div
            ref={(el) => {
              overlayRefs.current[o.id] = el;
            }}
            key={o.id}
            className="absolute border-2 origin-top-left"
            style={{
              left: o.left,
              top: o.top,
              width: o.width,
              height: o.height,
              transform: `rotate(${o.rotation}deg)`,
              backgroundColor: `${color}${
                overlayMetas[o.id]?.hover ? "4A" : overlayActive ? "1F" : "00"
              }`,
              borderColor: `${color}${
                overlayMetas[o.id]?.hover ? "FF" : overlayActive ? "66" : "00"
              }`,
            }}
            onPointerEnter={() =>
              overlayActive ? toggleOverlayHover(o.id, true) : {}
            }
            onPointerLeave={() => toggleOverlayHover(o.id, false)}
          >
            <div
              className="absolute -translate-x-[9px] -translate-y-[2px] w-[16px] h-[2px]"
              style={{
                backgroundColor: `${color}`,
                transform: "rotate(45deg)",
              }}
            />
            <div
              className="absolute -translate-x-[9px] -translate-y-[2px] w-[16px] h-[2px]"
              style={{
                backgroundColor: `${color}`,
                transform: "rotate(135deg)",
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default Overlay;
