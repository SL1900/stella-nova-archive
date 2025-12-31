import { Fragment } from "react/jsx-runtime";
import useWindowSize from "../../../../hooks/useWindowSize";
import {
  type positionMeta,
  getAllDirPosition,
  getDistance,
  getBounded,
} from "../../../../scripts/distance";
import { getScrollBounds } from "../TranslationBar/TlContent";
import OverlayBoxliner from "./OverlayBoxliner";
import OverlayConnector from "./OverlayConnector";
import { useOverlayContext } from "./OverlayContext";

const OverlayApplier = () => {
  const { overlayMetas, overlayTransforms } = useOverlayContext();

  const windowSize = useWindowSize();

  return (
    <>
      {Object.entries(overlayTransforms).map(([id, t]) => {
        if (
          !(
            t.overlay &&
            t.side &&
            overlayTransforms[id].overlay &&
            overlayTransforms[id].side
          )
        )
          return;

        const scrollBounds = getScrollBounds();

        function getNearestPair(pos: positionMeta, ref: positionMeta) {
          const from = getAllDirPosition(pos).sort(
            (a, b) => getDistance(a, ref.p) - getDistance(b, ref.p)
          )[0];
          const to = getAllDirPosition(ref).sort(
            (a, b) => getDistance(a, pos.p) - getDistance(b, pos.p)
          )[0];
          const PAD = 6;
          return {
            from: getBounded(from, {
              s: { x: PAD, y: PAD },
              e: { x: windowSize.width - PAD, y: windowSize.height - PAD },
            }),
            to: getBounded(to, {
              s: { x: to.x, y: scrollBounds.y },
              e: {
                x: to.x,
                y: scrollBounds.y + scrollBounds.h,
              },
            }),
          };
        }

        function getBoundedOverlay(o: positionMeta): positionMeta {
          const PAD = 0;
          return {
            p: getBounded(o.p, {
              s: { x: PAD, y: PAD },
              e: { x: windowSize.width - PAD, y: windowSize.height - PAD },
            }),
            t: Math.max(PAD, Math.min(windowSize.height - PAD, o.t)),
            b: Math.max(PAD, Math.min(windowSize.height - PAD, o.b)),
            l: Math.max(PAD, Math.min(windowSize.width - PAD, o.l)),
            r: Math.max(PAD, Math.min(windowSize.width - PAD, o.r)),
          };
        }

        const hovering = overlayMetas[id]?.hover ?? false;
        const pair = getNearestPair(t.overlay, t.side);
        const boundedBox = getBoundedOverlay(overlayTransforms[id].overlay);

        return (
          <Fragment key={id}>
            <OverlayConnector
              id={id}
              from={pair.from}
              to={pair.to}
              hovering={hovering}
            />
            <OverlayBoxliner hovering={hovering} overlay={boundedBox} />
          </Fragment>
        );
      })}
    </>
  );
};

export default OverlayApplier;
