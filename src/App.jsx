import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { useSheetTab, transformVisitors, transformLeads, transformSales } from "./useSheetData";

/* ─── GOOGLE SHEETS URLS ──────────────────────────────────────────────── */
const SHEET_URLS = {
  visitors: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=0&single=true&output=csv",
  leads:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=2066525621&single=true&output=csv",
  sales:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=23552387&single=true&output=csv",
};

/* ─── DESIGN TOKENS ───────────────────────────────────────────────────── */
const C = {
  bg:        "#07090f",
  surface:   "#0e1420",
  card:      "#111827",
  cardEdge:  "#1c2840",
  border:    "#1f3050",
  borderHi:  "#2e4a70",
  text:      "#e2eaf8",
  sub:       "#7a9ac0",
  dim:       "#334d6b",
  gold:      "#d4a435",
  goldHi:    "#f0c060",
  goldDim:   "#7a5c1a",
  cyan:      "#38bdf8",
  green:     "#22d67a",
  violet:    "#a78bfa",
  rose:      "#fb7185",
  orange:    "#fb923c",
  amber:     "#fbbf24",
};

const PALETTE = ["#38bdf8","#22d67a","#d4a435","#fb7185","#a78bfa","#fb923c","#34d399","#f472b6","#a3e635","#60a5fa"];

const STAGE_C = {
  "New":            C.cyan,
  "Follow up":      C.violet,
  "Hot Lead":       C.orange,
  "Quotation Send": C.gold,
  "Pending":        C.rose,
};

/* ─── STATIC FALLBACK ─────────────────────────────────────────────────── */
const STATIC_VISITORS = [
  {date:"2026-01-12",leadType:"MCS+MRC",user:"ASHWIN GARG",customer:"SP Pulses",contact:"Tikam Sharma",state:"RAJASTHAN",city:"Ajmer",competitors:"No",remarks:"Sortex on moong mogar 10 chute"},
  {date:"2026-01-27",leadType:"COLOR SORTER",user:"ASHWIN GARG",customer:"Hem Industries",contact:"Rishabh",state:"RAJASTHAN",city:"Ajmer",competitors:"No",remarks:"Final price given, customer at gulf expo"},
  {date:"2026-01-23",leadType:"COLOR SORTER",user:"SHIVGATULLA",customer:"Chetak Roller Flour Mill",contact:"Nitesh Khokhar",state:"UTTAR PRADESH",city:"Basti",competitors:"Competitors",remarks:"Discussion for color sorter"},
  {date:"2026-01-29",leadType:"KAESER AIR COMPRESSOR",user:"JAIPAL",customer:"Sai Kirpa Steel Industry",contact:"Rakesh Kumar",state:"DELHI",city:"Bawana",competitors:"Competitor",remarks:"Compressor required in next 6 months"},
  {date:"2026-01-24",leadType:"COLOR SORTER",user:"RAHUL MAHANT",customer:"Vardhan Industries",contact:"Aman Jain",state:"MADHYA PRADESH",city:"Begamganj",competitors:"Milltech",remarks:"Plant shutdown due to loss"},
  {date:"2026-01-10",leadType:"KAESER AIR COMPRESSOR",user:"GOVIND",customer:"Shree Shyam Industry",contact:"Pardeep Kasniya",state:"HARYANA",city:"Fathebad",competitors:"Competitor",remarks:"Meeting with MD"},
  {date:"2026-01-01",leadType:"MCS+MRC",user:"ASHWIN GARG",customer:"Agrawal Bandhu",contact:"Sahil Agrawal",state:"MADHYA PRADESH",city:"Indore",competitors:"No",remarks:"8 chute DLT on chana dal"},
  {date:"2026-01-03",leadType:"COLOR SORTER",user:"SHIVGATULLA",customer:"Mahashakti Foods Pvt Ltd",contact:"Aakash Jalan",state:"UTTAR PRADESH",city:"Gorakhpur",competitors:"Competitors",remarks:"13 Chute color sorter enquiry"},
  {date:"2026-01-15",leadType:"KAESER AIR COMPRESSOR",user:"HIMANSHU NAGAR",customer:"Shree Balaji Food Industries",contact:"Kamlesh Gupta",state:"MADHYA PRADESH",city:"Bhind",competitors:"Construction",remarks:"Plan colour sorter next Year"},
  {date:"2026-01-17",leadType:"KAESER AIR COMPRESSOR",user:"GOVIND",customer:"Lakhdatar International Pvt Ltd",contact:"Shivam Goyal",state:"HARYANA",city:"Ghrounda",competitors:"Na",remarks:"Plant add, requirement in 2 months"},
];
const STATIC_LEADS = [
  {date:"2026-01-15",uqn:"KC/NICPL0G000/2026/2930",source:"By Meeting",user:"GOVIND",customer:"M/s Jitendra Cottex",contact:"Sachin Jaglan",mobile:"+91-9112000063",remarks:"Need 30hp Compressor",state:"HARYANA",leadType:"KAESER AIR COMPRESSOR",stage:"Quotation Send"},
  {date:"2026-01-15",uqn:"M001/2929",source:"Calling",user:"SHIVGATULLA",customer:"Sudipta Hati",contact:"Sudipta Hati",mobile:"8293916079",remarks:"Quotation send, finalized last week",state:"WEST BENGAL",leadType:"MCS+MRC",stage:"Quotation Send"},
  {date:"2026-01-15",uqn:"CS/ERGYT/2026/2927",source:"Google Adwords",user:"SACHIN KUMAR 2",customer:"GDP Agro And Food Products Pvt Ltd",contact:"Dharam Aggarwal",mobile:"+91-9827259553",remarks:"Need Meyer Color Sorter for Peanuts",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Follow up"},
  {date:"2026-01-14",uqn:"CS/MU/2026/2926",source:"By Meeting",user:"MURLI DAR SUKLA",customer:"Jay Ambey Pulses",contact:"Sipoliya Ji",mobile:"+91-7355020465",remarks:"Want 8 chute meyer color sorter",state:"UTTAR PRADESH",leadType:"COLOR SORTER",stage:"New"},
  {date:"2026-01-13",uqn:"CS/NICUU001/2926/2920",source:"Calling",user:"UJJWAL UPADHYAY",customer:"Mr Akash Mittal",contact:"Akash Mittal",mobile:"7415388948",remarks:"Asked for approximate price",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-01-10",uqn:"CS/ERGYT/2026/2917",source:"Google Adwords",user:"SACHIN KUMAR 2",customer:"Jagdamba Enterprises",contact:"Sunil Kumar Agarwal",mobile:"+91-9784088462",remarks:"Need Color Sorter for Groundnuts",state:"RAJASTHAN",leadType:"COLOR SORTER",stage:"Quotation Send"},
  {date:"2026-01-29",uqn:"CS/DEMORM0002/2976",source:"By Meeting",user:"RAHUL MAHANT",customer:"Vardhman Dall Mill",contact:"Rahul Jain",mobile:"9893480631",remarks:"Planning 6 chute sortex with 30hp compressor",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-02-28",uqn:"CS/NICPLR001/3064",source:"By Visit",user:"RAHUL VERMA",customer:"Palak Traders",contact:"Aman Khandelwal",mobile:"+917000969542",remarks:"CS 6 chute requirement, 15kw KC",state:"UTTAR PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-02-13",uqn:"CS/NICUU001/3008",source:"By Meeting",user:"UJJWAL UPADHYAY",customer:"Sujay Agro Industries",contact:"Manish Pamecha",mobile:"+91-9301705009",remarks:"Sortex not finalized yet",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Quotation Send"},
  {date:"2026-02-09",uqn:"CS/MU/2026/2994",source:"By Meeting",user:"MURLI DAR SUKLA",customer:"SS Enterprises",contact:"Kamal Jain",mobile:"+91-9111234572",remarks:"Will finalize thinker model 8 chute",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
];
const STATIC_SALES = [
  {date:"2026-01-01",customer:"Hindusthan Agri Seeds Pvt Ltd",user:"MURLI DAR SUKLA",leadType:"MCS WITH KAESER COMPRESSOR",amount:3500000,state:"WEST BENGAL",products:"MCS"},
  {date:"2026-01-01",customer:"Bankura Agro Processing Pvt Ltd",user:"MURLI DAR SUKLA",leadType:"MCS+MRC",amount:3751000,state:"WEST BENGAL",products:"MCS+MRC"},
  {date:"2026-01-06",customer:"Shree Radha Laxmi Industries",user:"ARVIND KUMAR",leadType:"GRAIN DRYER",amount:6232594,state:"UTTAR PRADESH",products:"Grain Dryer"},
  {date:"2026-01-06",customer:"Singhai & Singhai",user:"RAHUL SIR",leadType:"COLOR SORTER",amount:5200000,state:"UTTAR PRADESH",products:"CS"},
  {date:"2026-01-07",customer:"Prashant Maheshwari",user:"RAHUL MAHANT",leadType:"MCS+MRC",amount:3121000,state:"MADHYA PRADESH",products:"MCS+MRC"},
  {date:"2026-01-10",customer:"Agrawal Bandhu Agro Tech Pvt Ltd",user:"MURLI DAR SUKLA",leadType:"COLOR SORTER",amount:3200000,state:"MADHYA PRADESH",products:"CS"},
  {date:"2026-01-12",customer:"Dhirendra International Pvt Ltd",user:"ASHWIN GARG",leadType:"COLOR SORTER",amount:4500000,state:"MADHYA PRADESH",products:"CS"},
  {date:"2026-01-12",customer:"Rajat Agro LLP",user:"ASHWIN GARG",leadType:"COLOR SORTER",amount:4100000,state:"GUJARAT",products:"CS"},
  {date:"2026-01-14",customer:"Shree Balaji Export",user:"ASHWIN GARG",leadType:"COLOR SORTER",amount:3750000,state:"MADHYA PRADESH",products:"CS"},
  {date:"2026-01-14",customer:"M.M Pulses",user:"MURLI DAR SUKLA",leadType:"AIR DRYER",amount:4550000,state:"MADHYA PRADESH",products:"Air Dryer"},
  {date:"2026-01-15",customer:"Shree Giriraj Enterprises",user:"ASHWIN GARG",leadType:"COLOR SORTER",amount:2000000,state:"MADHYA PRADESH",products:"CS"},
  {date:"2026-01-15",customer:"Hotwani Food Ingredients Pvt Ltd",user:"ASHWIN GARG",leadType:"MCS+MRC",amount:2470000,state:"MADHYA PRADESH",products:"MCS+MRC"},
  {date:"2026-01-25",customer:"Prashant Maheshwari",user:"RAHUL MAHANT",leadType:"MCS+MRC",amount:2800000,state:"MADHYA PRADESH",products:"MCS+MRC"},
  {date:"2026-02-05",customer:"Anand Foods",user:"ARVIND KUMAR",leadType:"COLOR SORTER",amount:3900000,state:"UTTAR PRADESH",products:"CS"},
  {date:"2026-02-13",customer:"Hem Industries",user:"ASHWIN GARG",leadType:"COLOR SORTER",amount:4200000,state:"RAJASTHAN",products:"CS"},
];

/* ─── HELPERS ─────────────────────────────────────────────────────────── */
const norm = v => String(v || "").trim().toUpperCase();

function fmt(n) {
  if (!n) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(0)}K`;
  return `₹${n}`;
}

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── GLOBAL STYLES injected once ────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #07090f; }
  ::-webkit-scrollbar-thumb { background: #2e4a70; border-radius: 3px; }
  body { background: #07090f; }

  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .kpi-card {
    animation: fadeIn 0.4s ease both;
  }
  .kpi-card:hover .kpi-value {
    filter: brightness(1.3);
  }
  .row-hover:hover {
    background: rgba(212,164,53,0.06) !important;
  }
  .pill-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(212,164,53,0.25);
  }
  .tab-btn:hover {
    background: rgba(212,164,53,0.15) !important;
  }
`;

/* ─── 3D KPI CARD ─────────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, color, icon, delay = 0 }) {
  const isRev = label.toLowerCase().includes("revenue");
  return (
    <div className="kpi-card" style={{
      animationDelay: `${delay}ms`,
      flex: 1, minWidth: 150,
      background: `linear-gradient(160deg, #151f35 0%, #0e1420 40%, #0a1018 100%)`,
      border: `1px solid ${color}55`,
      borderRadius: 16,
      padding: "20px 20px 16px",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
      boxShadow: `
        0 1px 0 ${color}33 inset,
        0 -1px 0 #00000080 inset,
        4px 0 8px #00000060,
        0 8px 32px ${color}18,
        0 2px 0 #ffffff08 inset
      `,
    }}>
      {/* top shine */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:1,
        background:`linear-gradient(90deg, transparent, ${color}66, transparent)`,
      }}/>
      {/* corner accent */}
      <div style={{
        position:"absolute", top:0, right:0,
        width:60, height:60,
        background:`radial-gradient(circle at top right, ${color}22, transparent 70%)`,
      }}/>
      {/* icon watermark */}
      <div style={{
        position:"absolute", bottom:-8, right:8,
        fontSize:52, opacity:0.06, lineHeight:1, userSelect:"none",
      }}>{icon}</div>

      <div style={{
        fontSize:9, color: C.sub, letterSpacing:"0.18em",
        fontFamily:"'Rajdhani',sans-serif", fontWeight:600,
        textTransform:"uppercase", marginBottom:8,
      }}>{label}</div>

      <div className="kpi-value" style={{
        fontSize: isRev ? 24 : 38,
        fontWeight: 700,
        color,
        fontFamily:"'Cinzel',serif",
        lineHeight: 1,
        marginBottom: 6,
        textShadow: `0 0 20px ${color}55`,
        transition: "filter 0.2s",
      }}>{value}</div>

      {sub && <div style={{
        fontSize:10, color: C.dim,
        fontFamily:"'Rajdhani',sans-serif",
        letterSpacing:"0.05em",
      }}>{sub}</div>}

      {/* bottom divider */}
      <div style={{
        position:"absolute", bottom:0, left:16, right:16, height:1,
        background:`linear-gradient(90deg, transparent, ${color}33, transparent)`,
      }}/>
    </div>
  );
}

/* ─── CHART CARD ──────────────────────────────────────────────────────── */
function ChartCard({ title, children, span = 1 }) {
  return (
    <div style={{
      gridColumn: span > 1 ? `span ${span}` : undefined,
      background: `linear-gradient(170deg, #131c2e 0%, #0d1420 60%, #0a1018 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: "16px 18px",
      boxShadow: `
        0 1px 0 #ffffff08 inset,
        0 -1px 0 #00000060 inset,
        0 4px 24px #00000060
      `,
      position:"relative", overflow:"hidden",
    }}>
      {/* top accent line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg, transparent 0%, ${C.gold}88 30%, ${C.goldHi}cc 50%, ${C.gold}88 70%, transparent 100%)`,
      }}/>
      <div style={{
        fontSize:10, fontWeight:700, color:C.gold,
        textTransform:"uppercase", letterSpacing:"0.16em",
        fontFamily:"'Rajdhani',sans-serif",
        marginBottom:14, marginTop:4,
        display:"flex", alignItems:"center", gap:8,
      }}>
        <span style={{width:3,height:12,background:`linear-gradient(180deg,${C.goldHi},${C.gold})`,borderRadius:2,display:"inline-block",boxShadow:`0 0 6px ${C.gold}88`}}/>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── FILTER PILL ─────────────────────────────────────────────────────── */
function FilterPill({ label, active, onClick, color = C.gold }) {
  return (
    <button className="pill-btn" onClick={onClick} style={{
      padding: "4px 14px",
      borderRadius: 20,
      border: `1px solid ${active ? color : C.border}`,
      background: active
        ? `linear-gradient(135deg, ${color}28, ${color}12)`
        : "transparent",
      color: active ? color : C.sub,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "'Rajdhani',sans-serif",
      fontWeight: 600,
      whiteSpace: "nowrap",
      transition: "all .15s",
      letterSpacing: "0.04em",
      boxShadow: active ? `0 0 10px ${color}30, 0 2px 4px #00000040` : "none",
    }}>{label}</button>
  );
}

/* ─── TOOLTIP STYLE ───────────────────────────────────────────────────── */
const ttp = {
  contentStyle: {
    background: "#0e1420", border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text, fontSize: 11,
    fontFamily: "'Rajdhani',sans-serif", letterSpacing:"0.03em",
    boxShadow:"0 8px 24px #00000080",
  },
  labelStyle: { color: C.gold, fontWeight:700 },
  cursor: { fill: "rgba(212,164,53,0.06)" },
};

/* ─── MAIN APP ────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [selUser,   setSelUser]   = useState("All");
  const [selType,   setSelType]   = useState("All");
  const [selState,  setSelState]  = useState("All");
  const [activeTab, setActiveTab] = useState("overview");

  /* live data */
  const { data: rawV, loading: lV, error: eV, lastUpdated: luV, refetch: rfV } = useSheetTab(SHEET_URLS.visitors);
  const { data: rawL, loading: lL, error: eL, lastUpdated: luL, refetch: rfL } = useSheetTab(SHEET_URLS.leads);
  const { data: rawS, loading: lS, error: eS, lastUpdated: luS, refetch: rfS } = useSheetTab(SHEET_URLS.sales);

  const refetchAll  = useCallback(() => { rfV(); rfL(); rfS(); }, [rfV, rfL, rfS]);
  const loading     = lV || lL || lS;
  const lastUpdated = luV || luL || luS;

  const VISITORS = useMemo(() => rawV.length > 0 ? transformVisitors(rawV) : STATIC_VISITORS, [rawV]);
  const LEADS    = useMemo(() => rawL.length > 0 ? transformLeads(rawL)    : STATIC_LEADS,    [rawL]);
  const SALES    = useMemo(() => rawS.length > 0 ? transformSales(rawS)    : STATIC_SALES,    [rawS]);

  /* combined activity log */
  const ACTIVITY = useMemo(() => [
    ...VISITORS.map(r => ({ ...r, _src: "Visit" })),
    ...LEADS.map(r => ({ ...r, _src: "Lead" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)), [VISITORS, LEADS]);

  /* dynamic master lists (like Power BI) */
  const masterUsers = useMemo(() => {
    const s = new Set();
    [...VISITORS, ...LEADS, ...SALES].forEach(r => r.user && s.add(r.user));
    return ["All", ...Array.from(s).sort()];
  }, [VISITORS, LEADS, SALES]);

  const masterTypes = useMemo(() => {
    const s = new Set();
    [...VISITORS, ...LEADS, ...SALES].forEach(r => r.leadType && s.add(r.leadType));
    return ["All", ...Array.from(s).sort()];
  }, [VISITORS, LEADS, SALES]);

  const masterStates = useMemo(() => {
    const s = new Set();
    [...VISITORS, ...LEADS, ...SALES].forEach(r => r.state && s.add(r.state));
    return ["All", ...Array.from(s).sort()];
  }, [VISITORS, LEADS, SALES]);

  /* filter fn */
  const filterRow = useCallback(r =>
    (selUser  === "All" || r.user     === selUser)  &&
    (selType  === "All" || r.leadType === selType)  &&
    (selState === "All" || r.state    === selState),
  [selUser, selType, selState]);

  const fV = useMemo(() => VISITORS.filter(filterRow), [VISITORS, filterRow]);
  const fL = useMemo(() => LEADS.filter(filterRow),    [LEADS,    filterRow]);
  const fS = useMemo(() => SALES.filter(filterRow),    [SALES,    filterRow]);
  const fA = useMemo(() => ACTIVITY.filter(filterRow), [ACTIVITY, filterRow]);

  /* KPIs */
  const totalRev  = useMemo(() => fS.reduce((s, r) => s + (r.amount || 0), 0), [fS]);
  const quotSent  = useMemo(() => fL.filter(r => r.stage === "Quotation Send" || r.stage === "Hot Lead").length, [fL]);
  const hotLeads  = useMemo(() => fL.filter(r => r.stage === "Hot Lead").length, [fL]);

  /* charts */
  const sourceData = useMemo(() => {
    const m = {};
    fL.forEach(r => { if (r.source) m[r.source] = (m[r.source] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fL]);

  const stageData = useMemo(() => [
    { name:"New",          value: fL.filter(r => r.stage === "New").length,            color: C.cyan },
    { name:"Follow up",    value: fL.filter(r => r.stage === "Follow up").length,      color: C.violet },
    { name:"Hot Lead",     value: fL.filter(r => r.stage === "Hot Lead").length,       color: C.orange },
    { name:"Quot. Send",   value: fL.filter(r => r.stage === "Quotation Send").length, color: C.gold },
    { name:"Pending",      value: fL.filter(r => r.stage === "Pending").length,        color: C.rose },
  ].filter(d => d.value > 0), [fL]);

  const userSalesRev = useMemo(() => {
    const m = {};
    fS.forEach(r => { if (r.user) m[r.user] = (m[r.user] || 0) + r.amount; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fS]);

  const userSalesCnt = useMemo(() => {
    const m = {};
    fS.forEach(r => { if (r.user) m[r.user] = (m[r.user] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fS]);

  const typeSalesCnt = useMemo(() => {
    const m = {};
    fS.forEach(r => { if (r.leadType) m[r.leadType] = (m[r.leadType] || 0) + 1; });
    return Object.entries(m).map(([n, v]) => ({ name: n.length > 14 ? n.slice(0, 14) + "…" : n, value: v }))
      .sort((a, b) => b.value - a.value);
  }, [fS]);

  const stateSalesRev = useMemo(() => {
    const m = {};
    fS.forEach(r => { if (r.state) m[r.state] = (m[r.state] || 0) + r.amount; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fS]);

  const competitorsData = useMemo(() => {
    const m = {};
    fV.forEach(r => { const k = r.competitors || "Unknown"; m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fV]);

  const userVisitorCnt = useMemo(() => {
    const m = {};
    fV.forEach(r => { if (r.user) m[r.user] = (m[r.user] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fV]);

  const stateSalesCnt = useMemo(() => {
    const m = {};
    fS.forEach(r => { if (r.state) m[r.state] = (m[r.state] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fS]);

  const TABS = [
    { id:"overview",  label:"Overview",     icon:"◈" },
    { id:"leads",     label:"Leads",        icon:"◎" },
    { id:"sales",     label:"Sales",        icon:"◆" },
    { id:"visitors",  label:"Visitors",     icon:"◉" },
    { id:"activity",  label:"Activity Log", icon:"≡" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text,
      fontFamily:"'Rajdhani',sans-serif",
      backgroundImage:`
        radial-gradient(ellipse 80% 40% at 20% -10%, #0d2040 0%, transparent 60%),
        radial-gradient(ellipse 60% 30% at 80% 110%, #0c1a30 0%, transparent 60%)
      `
    }}>
      <style>{GLOBAL_CSS}</style>

      {/* ═══ HEADER ════════════════════════════════════════════════════ */}
      <header style={{
        background:`linear-gradient(180deg, #0e1828 0%, #0a1220 100%)`,
        borderBottom:`1px solid ${C.border}`,
        padding:"0 28px",
        display:"flex", alignItems:"center", gap:14, height:64,
        boxShadow:`0 4px 32px #00000080, 0 1px 0 ${C.gold}22`,
        position:"sticky", top:0, zIndex:200,
      }}>
        {/* Logo */}
        <div style={{
          width:44, height:44, borderRadius:12, flexShrink:0,
          background:`linear-gradient(135deg, ${C.gold} 0%, ${C.amber} 50%, ${C.orange} 100%)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20, fontWeight:900, color:"#07090f",
          fontFamily:"'Cinzel',serif",
          boxShadow:`0 4px 16px ${C.gold}60, 0 1px 0 #ffffff40 inset`,
        }}>N</div>

        <div>
          <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:17, color:C.text, letterSpacing:"0.05em", lineHeight:1 }}>
            North India Compressors
          </div>
          <div style={{ fontSize:10, color:C.gold, letterSpacing:"0.2em", marginTop:3, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>
            SALES INTELLIGENCE · JAN–FEB 2026
          </div>
        </div>

        <div style={{ flex:1 }}/>

        {/* Sync badge */}
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, fontFamily:"'Rajdhani',sans-serif" }}>
          {loading
            ? <span style={{ color:C.cyan, animation:"pulseGlow 1s infinite" }}>⟳ SYNCING…</span>
            : <span style={{ color:C.green }}>✓ LIVE · {lastUpdated?.toLocaleTimeString() || "—"}</span>
          }
          <button onClick={refetchAll} style={{
            background:`linear-gradient(135deg,${C.gold}22,${C.gold}10)`,
            border:`1px solid ${C.gold}66`, color:C.gold, borderRadius:8,
            padding:"4px 14px", cursor:"pointer", fontSize:11,
            fontFamily:"'Rajdhani',sans-serif", fontWeight:700, letterSpacing:"0.06em",
            boxShadow:`0 2px 8px ${C.gold}20`,
          }}>↺ REFRESH</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4 }}>
          {TABS.map(({ id, label, icon }) => (
            <button key={id} className="tab-btn" onClick={() => setActiveTab(id)} style={{
              background: activeTab === id
                ? `linear-gradient(135deg,${C.gold}28,${C.gold}10)`
                : "transparent",
              border: `1px solid ${activeTab === id ? C.gold : C.border}`,
              color: activeTab === id ? C.gold : C.sub,
              borderRadius: 9, padding:"5px 16px", cursor:"pointer",
              fontSize:12, fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
              letterSpacing:"0.06em", transition:"all .15s",
              boxShadow: activeTab === id ? `0 0 12px ${C.gold}30` : "none",
            }}>{icon} {label}</button>
          ))}
        </div>
      </header>

      {/* ═══ FILTERS ═══════════════════════════════════════════════════ */}
      <div style={{
        background:`linear-gradient(180deg,#0d1626,#0a1018)`,
        borderBottom:`1px solid ${C.border}`,
        padding:"10px 28px",
        display:"flex", gap:16, flexWrap:"wrap", alignItems:"center",
        boxShadow:"0 2px 16px #00000060",
      }}>
        {[
          { label:"USER",  list: masterUsers,  sel: selUser,  set: setSelUser,  color: C.cyan },
          { label:"TYPE",  list: masterTypes,  sel: selType,  set: setSelType,  color: C.violet },
          { label:"STATE", list: masterStates, sel: selState, set: setSelState, color: C.green },
        ].map(({ label, list, sel, set, color }, gi) => (
          <div key={gi} style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:C.gold, fontWeight:700, letterSpacing:"0.15em", marginRight:2, fontFamily:"'Cinzel',serif" }}>
              {label}
            </span>
            {/* Full name for USER, truncated just for TYPE/STATE if long */}
            {list.map(v => (
              <FilterPill
                key={v}
                label={v === "All" ? "ALL" : (label === "USER" ? v : (v.length > 12 ? v.slice(0, 12) + "…" : v))}
                active={sel === v}
                color={color}
                onClick={() => set(v)}
              />
            ))}
            {gi < 2 && <div style={{ width:1, height:22, background:C.border, marginLeft:4 }}/>}
          </div>
        ))}
        {(selUser !== "All" || selType !== "All" || selState !== "All") && (
          <button onClick={() => { setSelUser("All"); setSelType("All"); setSelState("All"); }} style={{
            padding:"4px 14px", borderRadius:20,
            border:`1px solid ${C.rose}88`,
            background:`${C.rose}15`, color:C.rose,
            fontSize:11, cursor:"pointer",
            fontFamily:"'Rajdhani',sans-serif", fontWeight:700, letterSpacing:"0.06em",
          }}>✕ RESET ALL</button>
        )}
      </div>

      <div style={{ padding:"22px 28px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* ═══ KPI CARDS ═════════════════════════════════════════════ */}
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <KpiCard label="Total Visitors"  value={fV.length}         color={C.cyan}   icon="👥" sub="customer visits"               delay={0}   />
          <KpiCard label="Total Leads"     value={fL.length}         color={C.violet} icon="🎯" sub={`${hotLeads} hot leads`}        delay={60}  />
          <KpiCard label="Total Sales"     value={fS.length}         color={C.green}  icon="✅" sub="orders confirmed"              delay={120} />
          <KpiCard label="Quotations Sent" value={quotSent}          color={C.amber}  icon="📄" sub="Hot Lead + Quot. Send"         delay={180} />
          <KpiCard label="Total Revenue"   value={fmt(totalRev)}     color={C.gold}   icon="💰" sub={`avg ${fmt(totalRev/(fS.length||1))}/sale`} delay={240} />
        </div>

        {/* ═══ OVERVIEW TAB ══════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>

            <ChartCard title="Lead Source — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={sourceData} margin={{top:4,right:8,left:-20,bottom:44}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9,fontFamily:"Rajdhani"}} angle={-38} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[5,5,0,0]}>
                    {sourceData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Pipeline">
              <ResponsiveContainer width="100%" height={195}>
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={78} innerRadius={36}
                    paddingAngle={3} stroke="none"
                    label={({name,value})=>`${name}: ${value}`} labelLine={false}>
                    {stageData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip {...ttp}/>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="State Sales — Revenue">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={stateSalesRev} layout="vertical" margin={{top:4,right:50,left:85,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Rajdhani"}} width={82}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,5,5,0]}>
                    {stateSalesRev.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales — Revenue">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={userSalesRev} layout="vertical" margin={{top:4,right:50,left:110,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Rajdhani"}} width={108}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,5,5,0]}>
                    {userSalesRev.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={userSalesCnt} layout="vertical" margin={{top:4,right:30,left:110,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Rajdhani"}} width={108}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,5,5,0]}
                    label={{position:"right",fill:C.sub,fontSize:11,fontFamily:"Rajdhani",fontWeight:600}}>
                    {userSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Type Sales — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={typeSalesCnt} layout="vertical" margin={{top:4,right:30,left:110,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Rajdhani"}} width={108}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,5,5,0]}
                    label={{position:"right",fill:C.sub,fontSize:11,fontFamily:"Rajdhani",fontWeight:600}}>
                    {typeSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Competitors (Visit)">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={competitorsData} margin={{top:4,right:8,left:-20,bottom:50}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9,fontFamily:"Rajdhani"}} angle={-38} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[5,5,0,0]}>
                    {competitorsData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Visitors by User">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={userVisitorCnt} margin={{top:4,right:8,left:-20,bottom:50}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9,fontFamily:"Rajdhani"}} angle={-38} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[5,5,0,0]}>
                    {userVisitorCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="State Sales — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={stateSalesCnt} layout="vertical" margin={{top:4,right:30,left:85,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Rajdhani"}} width={82}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,5,5,0]}
                    label={{position:"right",fill:C.sub,fontSize:11,fontFamily:"Rajdhani",fontWeight:600}}>
                    {stateSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        )}

        {/* ═══ LEADS TAB ═════════════════════════════════════════════ */}
        {activeTab === "leads" && (
          <DataTable
            rows={fL}
            cols={["date","source","user","customer","contact","mobile","state","leadType","stage","remarks"]}
            headers={["Date","Source","User","Customer Name","Contact Person","Mobile","State","Lead Type","Stage","Remarks"]}
            title="Lead Records"
            color={C.violet}
            stageCol="stage"
            fmtCol={{ date: fmtDate }}
          />
        )}

        {/* ═══ SALES TAB ══════════════════════════════════════════════ */}
        {activeTab === "sales" && (
          <DataTable
            rows={fS}
            cols={["date","customer","user","leadType","amount","state","products"]}
            headers={["Date","Customer","User","Lead Type","PO Amount","State","Products"]}
            title="Sales Records"
            color={C.green}
            amountCol="amount"
            fmtCol={{ date: fmtDate, amount: fmt }}
          />
        )}

        {/* ═══ VISITORS TAB ════════════════════════════════════════════ */}
        {activeTab === "visitors" && (
          <DataTable
            rows={fV}
            cols={["date","leadType","user","customer","contact","state","city","competitors","remarks"]}
            headers={["Date","Lead Type","User","Customer Name","Contact Person","State","City","Competitor","Remarks"]}
            title="Visitor Records"
            color={C.cyan}
            fmtCol={{ date: fmtDate }}
          />
        )}

        {/* ═══ ACTIVITY LOG TAB ════════════════════════════════════════ */}
        {activeTab === "activity" && (
          <DataTable
            rows={fA}
            cols={["date","_src","leadType","user","customer","contact","state","stage","remarks"]}
            headers={["Date","Type","Lead Type","User","Customer Name","Contact","State","Stage","Remarks"]}
            title="Combined Activity Log (Visits + Leads)"
            color={C.gold}
            stageCol="stage"
            srcCol="_src"
            fmtCol={{ date: fmtDate }}
          />
        )}

      </div>
    </div>
  );
}

/* ─── DATA TABLE ──────────────────────────────────────────────────────── */
function DataTable({ rows, cols, headers, title, color, stageCol, amountCol, srcCol, fmtCol = {} }) {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(0);
  const PER = 20;

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [rows, search]);

  const paged = filtered.slice(page * PER, (page + 1) * PER);
  const pages = Math.ceil(filtered.length / PER);

  const STAGE_C2 = {
    "New":            "#38bdf8",
    "Hot Lead":       "#fb923c",
    "Quotation Send": "#d4a435",
    "Follow up":      "#a78bfa",
    "Pending":        "#fb7185",
  };

  function cellStyle(col, val) {
    if (col === amountCol) return { color:"#22d67a", fontWeight:700 };
    if (col === stageCol)  return { color: STAGE_C2[val] || "#e2eaf8", fontWeight:600 };
    if (col === srcCol)    return { color: val === "Lead" ? "#a78bfa" : "#38bdf8", fontWeight:600 };
    if (col === "date")    return { color:"#7a9ac0", whiteSpace:"nowrap" };
    if (col === "user")    return { color:"#d4a435", fontWeight:600 };
    return {};
  }

  function cellVal(col, val) {
    if (fmtCol[col]) return fmtCol[col](val);
    return String(val ?? "");
  }

  return (
    <div style={{
      background:`linear-gradient(170deg,#111827,#0d1420)`,
      border:`1px solid ${C.border}`, borderRadius:14,
      padding:18, display:"flex", flexDirection:"column", gap:12,
      boxShadow:"0 4px 24px #00000060",
      position:"relative", overflow:"hidden",
    }}>
      {/* top accent */}
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${color}99,${color},${color}99,transparent)`,
      }}/>

      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ fontSize:11, fontWeight:700, color, textTransform:"uppercase",
          letterSpacing:"0.16em", fontFamily:"'Cinzel',serif", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:3,height:14,background:`linear-gradient(180deg,${color},${color}88)`,borderRadius:2,display:"inline-block" }}/>
          {title}
          <span style={{ fontSize:11, color:C.dim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>
            ({filtered.length} records)
          </span>
        </div>
        <div style={{ flex:1 }}/>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="🔍 Search…"
          style={{
            background:`linear-gradient(135deg,#0e1420,#0a1018)`,
            border:`1px solid ${C.border}`, borderRadius:8,
            color:C.text, padding:"6px 14px", fontSize:12,
            fontFamily:"'Rajdhani',sans-serif", outline:"none", width:220,
            boxShadow:"0 2px 8px #00000040",
          }}
        />
      </div>

      <div style={{ overflowX:"auto", borderRadius:10, border:`1px solid ${C.border}` }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:`linear-gradient(180deg,#151f35,#111827)` }}>
              {(headers || cols).map((h, i) => (
                <th key={i} style={{
                  padding:"10px 14px", textAlign:"left", fontWeight:700,
                  borderBottom:`1px solid ${C.border}`,
                  color: color,
                  fontFamily:"'Cinzel',serif",
                  fontSize:9, letterSpacing:"0.12em", whiteSpace:"nowrap",
                  textTransform:"uppercase",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} className="row-hover"
                style={{ borderBottom:`1px solid ${C.border}33`, transition:"background .12s" }}>
                {cols.map(col => (
                  <td key={col} style={{
                    padding:"9px 14px",
                    fontFamily:"'Rajdhani',sans-serif",
                    letterSpacing:"0.03em",
                    whiteSpace:"nowrap", maxWidth:240,
                    overflow:"hidden", textOverflow:"ellipsis",
                    ...cellStyle(col, row[col]),
                  }}>
                    {cellVal(col, row[col])}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={cols.length} style={{ padding:24, color:C.dim, textAlign:"center",
                fontFamily:"'Rajdhani',sans-serif", fontSize:13, letterSpacing:"0.1em" }}>
                NO RECORDS FOUND
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display:"flex", gap:8, justifyContent:"center", alignItems:"center" }}>
          <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} style={{
            background:"none", border:`1px solid ${C.border}`, color:C.sub, borderRadius:8,
            padding:"4px 16px", cursor:"pointer", fontSize:12,
            fontFamily:"'Rajdhani',sans-serif", fontWeight:600, letterSpacing:"0.06em",
          }}>← PREV</button>
          <span style={{ color:C.gold, fontSize:12, fontFamily:"'Cinzel',serif" }}>
            {page+1} / {pages}
          </span>
          <button onClick={() => setPage(p => Math.min(pages-1, p+1))} disabled={page === pages-1} style={{
            background:"none", border:`1px solid ${C.border}`, color:C.sub, borderRadius:8,
            padding:"4px 16px", cursor:"pointer", fontSize:12,
            fontFamily:"'Rajdhani',sans-serif", fontWeight:600, letterSpacing:"0.06em",
          }}>NEXT →</button>
        </div>
      )}
    </div>
  );
}
