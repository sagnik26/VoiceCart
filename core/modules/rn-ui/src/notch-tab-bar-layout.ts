export const NOTCH_ITEM_SIZE = 62;
export const NOTCH_ICON_SIZE = 34;
export const NOTCH_MOTION_MS = 250;

/** Concave quarter-circle where the straight top edge turns into the dip. */
const SHOULDER_RADIUS = 20;
/** Vertical run between the shoulder and the bowl. */
const SHOULDER_DROP = 5;
/** Half-width of the dip that cradles the centre control. */
const BOWL_RADIUS = 38;

/** The bowl is centred this far below the bar's top edge. */
export const NOTCH_BOWL_CENTER_Y = SHOULDER_RADIUS + SHOULDER_DROP;
export const NOTCH_DIP_WIDTH = (SHOULDER_RADIUS + BOWL_RADIUS) * 2;
export const NOTCH_DIP_DEPTH = NOTCH_BOWL_CENTER_Y + BOWL_RADIUS;

/**
 * Shoulders plus bowl, in relative commands. Starts and ends at the same y so it
 * can be spliced between two straight runs of the bar's top edge.
 */
const DIP_SEGMENT = [
  `a${SHOULDER_RADIUS} ${SHOULDER_RADIUS} 0 0 1 ${SHOULDER_RADIUS} ${SHOULDER_RADIUS}`,
  `v${SHOULDER_DROP}`,
  `a${BOWL_RADIUS} ${BOWL_RADIUS} 0 0 0 ${BOWL_RADIUS * 2} 0`,
  `v-${SHOULDER_DROP}`,
  `a${SHOULDER_RADIUS} ${SHOULDER_RADIUS} 0 0 1 ${SHOULDER_RADIUS} -${SHOULDER_RADIUS}`,
].join('');

/** Top edge across the whole bar: straight, dip around the centre slot, straight. */
export function notchTopBorderPath(width: number, topY: number): string {
  const dipStart = width / 2 - NOTCH_DIP_WIDTH / 2;
  return `M0 ${topY}H${dipStart}${DIP_SEGMENT}H${width}`;
}

/** Top offset that seats a round control of `size` in the middle of the bowl. */
export function cradleTopOffset(size: number): number {
  return NOTCH_BOWL_CENTER_Y - size / 2;
}
