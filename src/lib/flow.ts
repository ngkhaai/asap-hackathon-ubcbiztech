export type Screen =
  | "overview"
  | "alerts"
  | "scan"
  | "options"
  | "review"
  | "approve"
  | "done"
  | "inbox";

/** Ordered demo steps used by the arrow-key shortcuts. */
export const FLOW: Screen[] = ["overview", "scan", "options", "review", "approve", "done"];

export type OptionId = "A" | "B" | "C";

export interface TransferOption {
  id: OptionId;
  tag: string;
  tone: "blue" | "green" | "grey";
  title: string;
  from: string;
  detail: string;
  risk?: string;
  units: number;
  eta: string;
  cost: number;
  distanceKm?: number;
}

export const OPTIONS: TransferOption[] = [
  {
    id: "A",
    tag: "FASTEST",
    tone: "blue",
    title: "Store 108 · 4 km away",
    from: "Store 108",
    detail: "6 units · ETA 1:00 pm · courier $18",
    risk: "Low risk to Store 108",
    units: 6,
    eta: "1:00 pm",
    cost: 18,
    distanceKm: 4,
  },
  {
    id: "B",
    tag: "MOST PROFIT",
    tone: "green",
    title: "Warehouse",
    from: "Warehouse",
    detail: "12 units · arrives tomorrow · regular truck",
    risk: "No risk to other stores",
    units: 12,
    eta: "tomorrow",
    cost: 0,
  },
  {
    id: "C",
    tag: "SAVE THE SALE",
    tone: "grey",
    title: "Ship to customer",
    from: "Online DC",
    detail: "2 days · no transfer needed",
    units: 1,
    eta: "2 days",
    cost: 0,
  },
];

export const getOption = (id: OptionId) => OPTIONS.find((o) => o.id === id)!;

export function nextScreen(s: Screen): Screen {
  const i = FLOW.indexOf(s);
  if (i < 0) return FLOW[0]!;
  return FLOW[Math.min(i + 1, FLOW.length - 1)]!;
}

export function prevScreen(s: Screen): Screen {
  const i = FLOW.indexOf(s);
  if (i <= 0) return FLOW[0]!;
  return FLOW[i - 1]!;
}

export const requestLabel = (id: OptionId) => `Request option ${id}`;
export const PAYMENT_AMOUNT = 400;
