import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  Database,
  DoorClosed,
  Loader2,
  MessageSquare,
  ScanLine,
  TrendingUp,
  Wifi,
} from "lucide-react";
import jacket from "@/assets/jacket.png.asset.json";
import {
  OPTIONS,
  PAYMENT_AMOUNT,
  getOption,
  nextScreen,
  prevScreen,
  requestLabel,
  type OptionId,
  type Screen,
} from "@/lib/flow";
import { TransferMap } from "./TransferMap";

/* ---------- shared bits ---------- */

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-medium uppercase tracking-wide text-grey">{children}</p>
);
const Title = ({ children }: { children: ReactNode }) => (
  <h1 className="mt-1 text-4xl font-bold leading-tight tracking-tight text-ink">{children}</h1>
);
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-3xl bg-fill p-5 ${className}`}>{children}</div>
);
const RolePill = ({ role }: { role: string }) => (
  <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand">{role}</span>
);
const Primary = ({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-primary-foreground transition active:scale-[.98] disabled:opacity-60"
  >
    {children}
  </button>
);
const Secondary = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex h-12 w-full items-center justify-center rounded-full bg-fill text-sm font-semibold text-ink active:scale-[.98]"
  >
    {children}
  </button>
);
const Row = ({ k, v, tone }: { k: string; v: ReactNode; tone?: "blue" | "green" }) => (
  <div className="flex items-start justify-between gap-4 border-b border-line py-3 text-sm last:border-0">
    <span className="text-grey">{k}</span>
    <span className={`text-right font-semibold ${tone === "blue" ? "text-brand" : tone === "green" ? "text-success" : "text-ink"}`}>
      {v}
    </span>
  </div>
);
const Back = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button onClick={onClick} className="mb-3 flex items-center gap-1 text-sm text-ink">
    <ArrowLeft className="h-4 w-4" /> {label}
  </button>
);
const tagClass = (tone: string) =>
  tone === "blue"
    ? "bg-brand text-primary-foreground"
    : tone === "green"
      ? "bg-success text-primary-foreground"
      : "bg-grey text-primary-foreground";

/* ---------- main ---------- */

export function Prototype() {
  const [screen, setScreen] = useState<Screen>("overview");
  const [option, setOption] = useState<OptionId>("A");
  const [scanKey, setScanKey] = useState(0);

  const go = (s: Screen) => {
    setScreen(s);
    document.getElementById("proto-scroll")?.scrollTo({ top: 0 });
  };
  const restart = () => {
    setOption("A");
    setScanKey((k) => k + 1);
    go("overview");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(nextScreen(screen));
      else if (e.key === "ArrowLeft") go(prevScreen(screen));
      else if (e.key.toLowerCase() === "r") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-fill sm:py-8">
      <div className="relative flex h-[100dvh] w-full max-w-[393px] flex-col overflow-hidden bg-background sm:h-[852px] sm:rounded-[48px] sm:border sm:border-line sm:shadow-2xl">
        <div className="flex h-11 shrink-0 items-center justify-between px-7 text-sm font-semibold text-ink">
          <span>9:41</span>
          <Wifi className="h-4 w-4" />
        </div>
        <div id="proto-scroll" className="flex-1 overflow-y-auto px-5 pb-28 pt-2">
          {screen === "overview" && <Overview go={go} />}
          {screen === "alerts" && <Alerts go={go} />}
          {screen === "scan" && <ScanFlag key={scanKey} go={go} />}
          {screen === "options" && <Options option={option} setOption={setOption} go={go} />}
          {screen === "review" && <Review option={option} go={go} />}
          {screen === "approve" && <Approve option={option} go={go} />}
          {screen === "done" && <Done option={option} restart={restart} />}
          {screen === "inbox" && <Inbox go={go} />}
        </div>
        <BottomNav screen={screen} go={go} />
      </div>
    </div>
  );
}

function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const item = (label: string, Icon: typeof Bell, target: Screen, active: boolean) => (
    <button onClick={() => go(target)} className={`flex w-16 flex-col items-center gap-1 text-[11px] font-semibold ${active ? "text-brand" : "text-grey"}`}>
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
  return (
    <nav className="absolute inset-x-0 bottom-0 flex h-[74px] items-center justify-between border-t border-line bg-background/95 px-4 pb-2 backdrop-blur">
      {item("Overview", DoorClosed, "overview", screen === "overview")}
      {item("Alerts", Bell, "alerts", screen === "alerts" || screen === "options" || screen === "review")}
      <button
        aria-label="Scan product"
        onClick={() => go("scan")}
        className="-mt-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-brand text-primary-foreground shadow-fab"
      >
        <ScanLine className="h-6 w-6" />
      </button>
      {item("Tracking", TrendingUp, "approve", screen === "approve" || screen === "done")}
      {item("Inbox", MessageSquare, "inbox", screen === "inbox")}
    </nav>
  );
}

/* ---------- screens ---------- */

function Overview({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Eyebrow>ASAP · Robson St</Eyebrow>
        <RolePill role="Salesperson" />
      </div>
      <Title>Good morning.</Title>
      <div className="relative overflow-hidden rounded-3xl bg-brand p-6 text-primary-foreground">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/10" />
        <span className="relative rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-semibold">● Stockout alert</span>
        <p className="relative mt-3 text-sm">Alpha SV Jacket · Robson Street</p>
        <p className="relative mt-2 text-3xl font-bold leading-tight">Size M is out on the shelf</p>
        <p className="relative mt-2 text-sm opacity-90">9 sold in 2 h · customer waiting</p>
        <button onClick={() => go("scan")} className="relative mt-5 h-12 rounded-full bg-background px-6 text-sm font-semibold text-brand">
          Flag low stock
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <Eyebrow>Open alerts</Eyebrow>
          <p className="mt-2 text-4xl font-bold text-brand">01</p>
          <p className="mt-2 text-sm text-grey">Requires action today</p>
        </Card>
        <Card>
          <Eyebrow>Sources</Eyebrow>
          <p className="mt-2 text-4xl font-bold text-ink">03</p>
          <p className="mt-2 text-sm text-grey">Store 108, Warehouse, Online</p>
        </Card>
      </div>
      <p className="text-center text-xs text-grey">Tip: ← → to move through the demo, R to restart</p>
    </div>
  );
}

function Alerts({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="space-y-5">
      <Eyebrow>Demand sensing</Eyebrow>
      <Title>Alerts</Title>
      <Card className="space-y-3">
        <p className="font-semibold text-ink">Out of stock at our store</p>
        <button onClick={() => go("scan")} className="flex w-full items-center justify-between rounded-2xl bg-background p-4 text-left">
          <div>
            <p className="font-semibold text-ink">Alpha SV Jacket</p>
            <p className="text-xs text-grey">Black / M · Out of stock</p>
          </div>
          <span className="text-2xl font-bold text-warning">0</span>
        </button>
        <div className="flex items-center justify-between rounded-2xl bg-background p-4">
          <div>
            <p className="font-semibold text-ink">Trail Running Pant</p>
            <p className="text-xs text-grey">Black / 30 · Monitoring</p>
          </div>
          <span className="text-2xl font-bold text-ink">2</span>
        </div>
      </Card>
      <Primary onClick={() => go("options")}>See ranked options</Primary>
    </div>
  );
}

const SIZES = [
  { s: "S", n: 3 },
  { s: "M", n: 0 },
  { s: "L", n: 5 },
];

function ScanFlag({ go }: { go: (s: Screen) => void }) {
  const [state, setState] = useState<"idle" | "scanning" | "found">("idle");
  const [size, setSize] = useState("M");
  const [waiting, setWaiting] = useState(true);

  const scan = () => {
    setState("scanning");
    setTimeout(() => setState("found"), 1000);
  };
  const send = () => {
    toast.success("Sent to manager in 10 sec");
    setTimeout(() => go("options"), 900);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Eyebrow>ASAP · Robson St</Eyebrow>
        <RolePill role="Salesperson" />
      </div>
      <Title>Flag low stock</Title>
      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-3xl bg-brand">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-primary-foreground/80 bg-primary-foreground/10">
          {state === "scanning" && <div className="animate-scanline absolute inset-x-2 h-0.5 bg-primary-foreground" />}
          {state === "found" ? <Check className="h-14 w-14 text-primary-foreground" /> : <ScanLine className="h-10 w-10 text-primary-foreground/80" />}
        </div>
        <p className="absolute bottom-4 text-sm text-primary-foreground">
          {state === "idle" ? "Point at the product tag" : state === "scanning" ? "Scanning…" : "TSJ-001 found"}
        </p>
      </div>

      {state !== "found" ? (
        <Primary onClick={scan} disabled={state === "scanning"}>
          {state === "scanning" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
          Scan product
        </Primary>
      ) : (
        <>
          <Card className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={jacket.url} alt="Alpha SV Jacket" className="h-20 w-20 rounded-2xl bg-background object-contain" />
              <div>
                <p className="text-lg font-semibold text-ink">Alpha SV Jacket</p>
                <p className="text-sm text-grey">Black · TSJ-001</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map(({ s, n }) => {
                const active = size === s;
                const empty = n === 0;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-2xl border-2 bg-background py-3 text-center ${
                      empty ? "border-danger" : active ? "border-brand" : "border-transparent"
                    } ${active ? "ring-2 ring-offset-2 ring-brand/30" : ""}`}
                  >
                    <p className="text-lg font-bold text-ink">{s}</p>
                    <p className={`text-xs ${empty ? "font-semibold text-danger" : "text-grey"}`}>{n} left</p>
                  </button>
                );
              })}
            </div>
            <p className="flex items-center gap-2 text-xs text-grey">
              <Database className="h-3.5 w-3.5 text-brand" /> Stock read live from SAP S/4HANA
            </p>
            <label className="flex items-center justify-between rounded-2xl bg-background p-4">
              <span className="text-sm font-medium text-ink">Customer waiting for this size</span>
              <button
                role="switch"
                aria-checked={waiting}
                onClick={() => setWaiting((w) => !w)}
                className={`relative h-7 w-12 rounded-full transition ${waiting ? "bg-brand" : "bg-line"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-background transition-all ${waiting ? "left-6" : "left-1"}`} />
              </button>
            </label>
          </Card>
          <Primary onClick={send}>Send to manager</Primary>
        </>
      )}
    </div>
  );
}

function Options({ option, setOption, go }: { option: OptionId; setOption: (o: OptionId) => void; go: (s: Screen) => void }) {
  const [pay, setPay] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Eyebrow>Store manager</Eyebrow>
        <RolePill role="Manager" />
      </div>
      <Title>Pick the best option</Title>
      <Card className="flex items-center gap-4">
        <img src={jacket.url} alt="" className="h-14 w-14 rounded-xl bg-background object-contain" />
        <div className="text-sm">
          <p className="font-semibold text-ink">Alpha SV · Black · M</p>
          <p className="text-danger">0 on shelf · 9 sold in 2 h</p>
          <p className="text-xs text-grey">flagged by Alex just now</p>
        </div>
      </Card>

      <TransferMap selected={option} onSelect={setOption} />

      <p className="text-lg font-semibold text-ink">Ranked options</p>
      <div className="space-y-3">
        {OPTIONS.map((o) => {
          const active = option === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setOption(o.id)}
              className={`w-full rounded-3xl border-2 p-4 text-left transition ${active ? "border-brand bg-brand-tint" : "border-transparent bg-fill"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tagClass(o.tone)}`}>{o.tag}</span>
                <span className="text-xs font-semibold text-grey">{o.id}</span>
              </div>
              <p className="mt-2 font-semibold text-ink">{o.title}</p>
              <p className="text-sm text-grey">{o.detail}</p>
              {o.risk && <p className="mt-1 text-xs font-medium text-success">{o.risk}</p>}
            </button>
          );
        })}
      </div>
      {option === "C" && <Secondary onClick={() => setPay(true)}>Take payment · Tap to Pay</Secondary>}
      <Primary onClick={() => go("review")}>{requestLabel(option)}</Primary>
      {pay && <PaySheet onClose={() => setPay(false)} />}
    </div>
  );
}

function PaySheet({ onClose }: { onClose: () => void }) {
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPaid(true), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="absolute inset-0 z-20 flex items-end bg-ink/40" onClick={onClose}>
      <div className="w-full rounded-t-[32px] bg-background p-6 pb-10 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        <Eyebrow>via existing mobile POS</Eyebrow>
        <p className="mt-2 text-4xl font-bold text-ink">${PAYMENT_AMOUNT.toFixed(2)}</p>
        <div className="relative mx-auto my-8 flex h-28 w-28 items-center justify-center">
          {!paid && <span className="animate-nfc absolute inset-0 rounded-full bg-brand/30" />}
          <span className={`flex h-20 w-20 items-center justify-center rounded-full ${paid ? "bg-success" : "bg-brand"} text-primary-foreground`}>
            {paid ? <Check className="h-10 w-10" /> : <Wifi className="h-9 w-9 rotate-90" />}
          </span>
        </div>
        <p className="font-semibold text-ink">{paid ? "Paid ✓" : "Hold card near phone"}</p>
        <div className="mt-6">
          <Secondary onClick={onClose}>{paid ? "Done" : "Cancel"}</Secondary>
        </div>
      </div>
    </div>
  );
}

function Review({ option, go }: { option: OptionId; go: (s: Screen) => void }) {
  const o = getOption(option);
  return (
    <div className="space-y-5">
      <Back label="Options" onClick={() => go("options")} />
      <Eyebrow>Review & submit</Eyebrow>
      <Title>Review transfer request</Title>
      <Card>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <Eyebrow>Stock transport order · demo</Eyebrow>
            <p className="text-lg font-semibold text-ink">Option {o.id} · {o.from}</p>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tagClass(o.tone)}`}>{o.tag}</span>
        </div>
        <Row k="Material" v="TSJ-001 · Black / M" />
        <Row k="Delivery" v={`${o.from} → Robson St`} />
        <Row k="Quantity" v={`${o.units} units`} tone="blue" />
        <Row k="ETA" v={o.eta} />
        <Row k="Delivery fee" v={`$${o.cost}`} />
        <Row k="Safety-stock impact" v="Protected" tone="green" />
        <Row k="Approval" v="Allocator" />
      </Card>
      <Primary onClick={() => go("approve")}>Submit transfer request</Primary>
    </div>
  );
}

function Approve({ option, go }: { option: OptionId; go: (s: Screen) => void }) {
  const o = getOption(option);
  const [busy, setBusy] = useState(false);
  const approve = () => {
    setBusy(true);
    setTimeout(() => go("done"), 1600);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Eyebrow>Allocator</Eyebrow>
        <RolePill role="Allocator" />
      </div>
      <div className="flex items-center gap-3">
        <Title>Requests</Title>
        <span className="mt-2 rounded-full bg-warning-tint px-3 py-1 text-xs font-semibold text-warning">3 waiting</span>
      </div>
      <div className="rounded-3xl border-2 border-brand bg-brand-tint p-5">
        <p className="text-lg font-semibold text-ink">Robson St ← {o.from}</p>
        <p className="text-sm text-ink">Alpha SV · Black · M × {o.units}</p>
        <p className="mt-1 text-sm text-grey">ETA {o.eta} · cost ${o.cost}</p>
        <p className="mt-1 text-sm font-semibold text-brand">Margin kept ≈ $1,390</p>
        <p className="mt-3 rounded-xl bg-success-tint px-3 py-2 text-xs font-medium text-success">
          {o.from} keeps 9+ weeks of stock
        </p>
      </div>
      <div className="space-y-2 opacity-50">
        <Card className="py-4 text-sm text-ink">Kitsilano ← Warehouse · Atom Hoody</Card>
        <Card className="py-4 text-sm text-ink">Toronto Queen St ← Store 112 · Beta Jacket</Card>
      </div>
      {busy ? (
        <div className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-tint text-sm font-semibold text-brand">
          <Loader2 className="h-4 w-4 animate-spin" /> Creating transfer in SAP S/4HANA…
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => go("options")} className="h-12 flex-1 rounded-full border-2 border-line text-sm font-semibold text-ink">
            Change
          </button>
          <button onClick={approve} className="h-12 flex-1 rounded-full bg-brand text-sm font-semibold text-primary-foreground">
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

function Done({ option, restart }: { option: OptionId; restart: () => void }) {
  const o = getOption(option);
  const steps = [
    { t: "Approved", time: "11:06", s: "done" },
    { t: `Picked at ${o.from}`, time: "11:20", s: "done" },
    { t: "Courier on the way", time: "11:40", s: "live" },
    { t: "On shelf at Robson St", time: `~${o.eta}`, s: "todo" },
  ];
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-fab">
        <Check className="h-12 w-12" strokeWidth={3} />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Transfer created in S/4HANA</h1>
        <p className="mt-1 text-sm text-grey">Transfer #4500-0127 (demo) · {o.from} → Robson St</p>
      </div>
      <Card className="text-left">
        {steps.map((st, i) => (
          <div key={st.t} className="relative flex gap-4 pb-5 last:pb-0">
            {i < steps.length - 1 && (
              <span className={`absolute left-[7px] top-4 h-full w-0.5 ${st.s === "done" ? "bg-brand" : "bg-line"}`} />
            )}
            <span className="relative mt-1 flex h-4 w-4 shrink-0">
              {st.s === "live" && <span className="absolute inset-0 animate-ping rounded-full bg-brand/60" />}
              <span
                className={`relative h-4 w-4 rounded-full ${
                  st.s === "done" ? "bg-brand" : st.s === "live" ? "bg-brand" : "border-2 border-grey bg-background"
                }`}
              />
            </span>
            <div className="flex flex-1 justify-between text-sm">
              <span className={st.s === "todo" ? "text-grey" : "font-semibold text-ink"}>{st.t}</span>
              <span className="text-grey">{st.time}</span>
            </div>
          </div>
        ))}
      </Card>
      <p className="text-xs text-grey">{o.from} picks the units in SAP's Transfer Products app</p>
      <div className="flex flex-wrap justify-center gap-2">
        {["Flag 10 sec", "Pick 1 min", "Approve 30 sec"].map((c) => (
          <span key={c} className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand">
            {c}
          </span>
        ))}
      </div>
      <Secondary onClick={restart}>Restart demo</Secondary>
    </div>
  );
}

function Inbox({ go }: { go: (s: Screen) => void }) {
  const items = [
    { t: "Transfer #4500-0127 · Approved", d: "Store 108 → Robson Street", tone: "bg-success", to: "done" as Screen },
    { t: "Stockout risk at our store", d: "Alpha SV · Black / M", tone: "bg-warning", to: "scan" as Screen },
    { t: "3 requests waiting", d: "Allocator queue", tone: "bg-grey", to: "approve" as Screen },
  ];
  return (
    <div className="space-y-5">
      <Eyebrow>Updates</Eyebrow>
      <Title>Notifications</Title>
      <div>
        {items.map((i) => (
          <button key={i.t} onClick={() => go(i.to)} className="flex w-full items-center gap-3 border-b border-line py-4 text-left">
            <span className={`h-2.5 w-2.5 rounded-full ${i.tone}`} />
            <div className="flex-1">
              <p className="font-semibold text-ink">{i.t}</p>
              <p className="text-sm text-grey">{i.d}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-brand" />
          </button>
        ))}
      </div>
    </div>
  );
}
