import type { OptionId } from "@/lib/flow";

interface Props {
  selected: OptionId;
  onSelect?: (id: OptionId) => void;
}

const POINTS = {
  robson: { x: 120, y: 92 },
  A: { x: 232, y: 178 },
  B: { x: 60, y: 210 },
};

/** Illustrative map: our store, Store 108 and the warehouse, with the delivery fee on the route. */
export function TransferMap({ selected, onSelect }: Props) {
  const target = selected === "B" ? POINTS.B : POINTS.A;
  const fee =
    selected === "A" ? "Courier $18 · 1:00 pm" : selected === "B" ? "Truck $0 · tomorrow" : "Ships to customer · 2 days";
  const mid = { x: (POINTS.robson.x + target.x) / 2, y: (POINTS.robson.y + target.y) / 2 };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-map-land">
      <svg viewBox="0 0 320 260" className="block h-auto w-full">
        <path d="M0 0 H320 V40 C240 60 140 30 0 55 Z" className="fill-map-park" />
        <path d="M0 120 C60 100 90 140 150 128 C210 116 260 150 320 130 V150 C260 170 210 136 150 148 C90 160 60 122 0 142 Z" className="fill-map-water" />
        {[40, 100, 170, 250].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={260} className="stroke-background" strokeWidth={5} />
        ))}
        {[70, 190, 235].map((y) => (
          <line key={y} x1={0} y1={y} x2={320} y2={y} className="stroke-background" strokeWidth={5} />
        ))}
        <path d="M0 250 C120 180 200 120 320 70" className="fill-none stroke-map-road" strokeWidth={8} />
        {selected !== "C" && (
          <line
            x1={POINTS.robson.x}
            y1={POINTS.robson.y}
            x2={target.x}
            y2={target.y}
            className="stroke-brand"
            strokeWidth={4}
            strokeDasharray={selected === "B" ? "6 6" : undefined}
          />
        )}
        <circle cx={POINTS.robson.x} cy={POINTS.robson.y} r={7} className="fill-ink stroke-background" strokeWidth={3} />
        {(["A", "B"] as const).map((id) => (
          <circle
            key={id}
            cx={POINTS[id].x}
            cy={POINTS[id].y}
            r={7}
            className={`${selected === id ? "fill-brand" : "fill-grey"} stroke-background cursor-pointer`}
            strokeWidth={3}
            onClick={() => onSelect?.(id)}
          />
        ))}
      </svg>
      <Label x={POINTS.robson.x} y={POINTS.robson.y} up text="Robson St · 0 left" dark />
      <Label x={POINTS.A.x} y={POINTS.A.y} text="Store 108 · 6" active={selected === "A"} onClick={() => onSelect?.("A")} />
      <Label x={POINTS.B.x} y={POINTS.B.y} text="Warehouse · 12" active={selected === "B"} onClick={() => onSelect?.("B")} />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-primary-foreground shadow-fab"
        style={{ left: `${(mid.x / 320) * 100}%`, top: `${(mid.y / 260) * 100}%` }}
      >
        {fee}
      </div>
    </div>
  );
}

function Label({
  x,
  y,
  text,
  up,
  dark,
  active,
  onClick,
}: {
  x: number;
  y: number;
  text: string;
  up?: boolean;
  dark?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute -translate-x-1/2 whitespace-nowrap rounded-xl px-2 py-1 text-[11px] font-semibold shadow ${
        active ? "bg-brand text-primary-foreground" : dark ? "bg-ink text-background" : "bg-background text-ink"
      }`}
      style={{ left: `${(x / 320) * 100}%`, top: `calc(${(y / 260) * 100}% ${up ? "- 34px" : "+ 12px"})` }}
    >
      {text}
    </button>
  );
}
