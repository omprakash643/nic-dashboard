import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useSheetTab, transformVisitors, transformLeads, transformSales } from "./useSheetData";

/* ─── SHEET URLS ──────────────────────────────────────────────────────── */
const SHEET_URLS = {
  visitors: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=0&single=true&output=csv",
  leads:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=2066525621&single=true&output=csv",
  sales:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=23552387&single=true&output=csv",
};

/* ─── PREMIUM WARM THEME ──────────────────────────────────────────────── */
const C = {
  // Backgrounds — warm parchment-dark, not cold navy
  bg:        "#13100d",
  surface:   "#1a1510",
  card:      "#1e1812",
  cardHi:    "#252018",
  border:    "#2e2518",
  borderHi:  "#4a3d28",

  // Text
  text:      "#f0e8d8",
  sub:       "#9e8c70",
  dim:       "#4a3d28",

  // Accent — premium gold spectrum
  gold:      "#c8973a",
  goldHi:    "#e8b84b",
  goldLight: "#f5d680",
  goldDim:   "#6b4f1a",

  // Data colors — warm but distinct
  cyan:      "#4db8d4",
  green:     "#5cba8a",
  violet:    "#9b7fd4",
  rose:      "#d4697a",
  orange:    "#d4884a",
  amber:     "#d4aa38",
  teal:      "#4ab8a8",
};

const PALETTE = [
  "#4db8d4","#5cba8a","#c8973a","#d4697a","#9b7fd4",
  "#d4884a","#4ab8a8","#d4b86a","#a0c46a","#8a8ad4",
];

/* ─── STATIC DATA ─────────────────────────────────────────────────────── */
const STATIC_VISITORS = [
  {date:"2026-01-12",leadType:"MCS+MRC",user:"ASHWIN GARG",customer:"SP Pulses",contact:"Tikam Sharma",state:"RAJASTHAN",city:"Ajmer",competitors:"No",remarks:"Sortex on moong mogar 10 chute"},
  {date:"2026-01-27",leadType:"COLOR SORTER",user:"ASHWIN GARG",customer:"Hem Industries",contact:"Rishabh",state:"RAJASTHAN",city:"Ajmer",competitors:"No",remarks:"Final price given, customer at gulf expo"},
  {date:"2026-01-23",leadType:"COLOR SORTER",user:"SHIVGATULLA",customer:"Chetak Roller Flour Mill",contact:"Nitesh Khokhar",state:"UTTAR PRADESH",city:"Basti",competitors:"Competitors",remarks:"Discussion for color sorter"},
  {date:"2026-01-29",leadType:"KAESER AIR COMPRESSOR",user:"JAIPAL",customer:"Sai Kirpa Steel Industry",contact:"Rakesh Kumar",state:"DELHI",city:"Bawana",competitors:"Competitor",remarks:"Compressor required in 6 months"},
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
  {date:"2026-01-13",uqn:"CS/NICUU001/2926/2920",source:"Calling",user:"UJJWAL UPADHYAY",customer:"Akash Mittal",contact:"Akash Mittal",mobile:"7415388948",remarks:"Asked for approximate price",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-01-10",uqn:"CS/ERGYT/2026/2917",source:"Google Adwords",user:"SACHIN KUMAR 2",customer:"Jagdamba Enterprises",contact:"Sunil Kumar Agarwal",mobile:"+91-9784088462",remarks:"Need Color Sorter for Groundnuts",state:"RAJASTHAN",leadType:"COLOR SORTER",stage:"Quotation Send"},
  {date:"2026-01-29",uqn:"CS/DEMORM0002/2976",source:"By Meeting",user:"RAHUL MAHANT",customer:"Vardhman Dall Mill",contact:"Rahul Jain",mobile:"9893480631",remarks:"Planning 6 chute sortex with 30hp",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-02-28",uqn:"CS/NICPLR001/3064",source:"By Visit",user:"RAHUL VERMA",customer:"Palak Traders",contact:"Aman Khandelwal",mobile:"+917000969542",remarks:"CS 6 chute requirement",state:"UTTAR PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
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
  return dt.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}
function toISO(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return "";
  return dt.toISOString().slice(0, 10);
}
function inRange(dateStr, from, to) {
  if (!from && !to) return true;
  const d = toISO(dateStr);
  if (!d) return true;
  if (from && d < from) return false;
  if (to   && d > to)   return false;
  return true;
}

/* ─── GLOBAL CSS ──────────────────────────────────────────────────────── */
const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #13100d; font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #13100d; }
  ::-webkit-scrollbar-thumb { background: #4a3d28; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #c8973a; }

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.6) sepia(1) saturate(3) hue-rotate(5deg);
    cursor: pointer;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmerPulse {
    0%,100% { opacity:0.6; }
    50%      { opacity:1; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .kpi { animation: fadeUp 0.5s ease both; }
  .kpi:hover { transform: translateY(-2px); transition: transform 0.2s; }
  .kpi:hover .kpi-num { filter: brightness(1.2); }

  .tab-btn { transition: all 0.15s; }
  .tab-btn:hover { background: rgba(200,151,58,0.12) !important; }

  .pill { transition: all 0.12s; cursor: pointer; }
  .pill:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(200,151,58,0.2); }

  .trow { transition: background 0.1s; }
  .trow:hover { background: rgba(200,151,58,0.05) !important; }

  .loading-spin { animation: spin 1s linear infinite; display:inline-block; }
`;

/* ─── NIC LOGO SVG (inline recreation from the image) ────────────────── */
function NicLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink:0 }}>
      {/* Background rounded square */}
      <rect width="100" height="100" rx="20" fill="#111"/>
      {/* Green hand top-left */}
      <ellipse cx="25" cy="18" rx="14" ry="8" fill="#5cb85c" transform="rotate(-40 25 18)"/>
      <ellipse cx="20" cy="25" rx="5" ry="12" fill="#5cb85c" transform="rotate(-40 20 25)"/>
      {/* Orange hand top-right */}
      <ellipse cx="75" cy="18" rx="14" ry="8" fill="#f0a830" transform="rotate(40 75 18)"/>
      <ellipse cx="80" cy="25" rx="5" ry="12" fill="#f0a830" transform="rotate(40 80 25)"/>
      {/* Pink hand bottom-left */}
      <ellipse cx="25" cy="82" rx="14" ry="8" fill="#e05080" transform="rotate(40 25 82)"/>
      <ellipse cx="20" cy="75" rx="5" ry="12" fill="#e05080" transform="rotate(40 20 75)"/>
      {/* Blue hand bottom-right */}
      <ellipse cx="75" cy="82" rx="14" ry="8" fill="#30a8e0" transform="rotate(-40 75 82)"/>
      <ellipse cx="80" cy="75" rx="5" ry="12" fill="#30a8e0" transform="rotate(-40 80 75)"/>
      {/* Center circle */}
      <circle cx="50" cy="50" r="22" fill="#d8d8d8"/>
      <circle cx="50" cy="50" r="18" fill="#f5f5f5"/>
      {/* NIC text */}
      <text x="50" y="46" textAnchor="middle" fontSize="10" fontWeight="800" fill="#e05080" fontFamily="Arial,sans-serif">nic</text>
      {/* NICPL text below */}
      <text x="50" y="94" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="Arial,sans-serif" letterSpacing="1">NICPL</text>
    </svg>
  );
}

/* ─── KPI CARD ────────────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, color, icon, delay=0 }) {
  return (
    <div className="kpi" style={{
      animationDelay:`${delay}ms`,
      flex:1, minWidth:155,
      background:`linear-gradient(145deg, #222018 0%, #1a1610 50%, #161210 100%)`,
      border:`1px solid ${C.border}`,
      borderTop:`2px solid ${color}88`,
      borderRadius:14,
      padding:"20px 20px 16px",
      position:"relative", overflow:"hidden",
      boxShadow:`
        0 1px 0 rgba(255,255,255,0.04) inset,
        0 20px 40px rgba(0,0,0,0.5),
        0 4px 0 rgba(0,0,0,0.4),
        0 0 0 1px rgba(0,0,0,0.2)
      `,
      cursor:"default",
    }}>
      {/* Warm glow top-right */}
      <div style={{position:"absolute",top:0,right:0,width:80,height:80,
        background:`radial-gradient(circle at top right, ${color}18, transparent 70%)`,pointerEvents:"none"}}/>
      {/* Icon watermark */}
      <div style={{position:"absolute",bottom:-4,right:10,fontSize:48,opacity:0.06,lineHeight:1,userSelect:"none"}}>{icon}</div>
      {/* Emboss line */}
      <div style={{position:"absolute",bottom:0,left:16,right:16,height:1,
        background:`linear-gradient(90deg,transparent,${color}44,transparent)`}}/>

      <div style={{fontSize:9,color:C.sub,letterSpacing:"0.2em",fontWeight:600,
        textTransform:"uppercase",marginBottom:10,fontFamily:"'Outfit',sans-serif"}}>
        {label}
      </div>
      <div className="kpi-num" style={{
        fontSize: value?.toString().includes("Cr") ? 26 : 40,
        fontWeight:700,
        color,
        fontFamily:"'Cormorant Garamond',serif",
        lineHeight:1,
        marginBottom:6,
        textShadow:`0 0 30px ${color}40`,
        transition:"filter 0.2s",
      }}>{value}</div>
      {sub && <div style={{fontSize:10,color:C.sub,letterSpacing:"0.04em"}}>{sub}</div>}
    </div>
  );
}

/* ─── CHART CARD ──────────────────────────────────────────────────────── */
function ChartCard({ title, children }) {
  return (
    <div style={{
      background:`linear-gradient(160deg,#1e1c14 0%,#171410 60%,#131108 100%)`,
      border:`1px solid ${C.border}`,
      borderRadius:14, padding:"16px 18px",
      boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset`,
      position:"relative", overflow:"hidden",
    }}>
      {/* Top gold accent */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${C.goldDim},${C.gold},${C.goldHi},${C.gold},${C.goldDim},transparent)`}}/>
      <div style={{
        fontSize:10,fontWeight:600,color:C.gold,textTransform:"uppercase",
        letterSpacing:"0.18em",fontFamily:"'Outfit',sans-serif",
        marginBottom:14,marginTop:4,
        display:"flex",alignItems:"center",gap:8,
      }}>
        <span style={{width:2,height:12,background:`linear-gradient(180deg,${C.goldHi},${C.gold}88)`,
          borderRadius:1,display:"inline-block"}}/>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── TOOLTIP ─────────────────────────────────────────────────────────── */
const ttp = {
  contentStyle:{background:"#1a1510",border:`1px solid ${C.border}`,borderRadius:8,
    color:C.text,fontSize:11,fontFamily:"'Outfit',sans-serif",boxShadow:"0 8px 24px rgba(0,0,0,0.7)"},
  labelStyle:{color:C.gold,fontWeight:700},
  cursor:{fill:"rgba(200,151,58,0.06)"},
};

/* ─── PILL FILTER ─────────────────────────────────────────────────────── */
function Pill({ label, active, onClick, color=C.gold }) {
  return (
    <button className="pill" onClick={onClick} style={{
      padding:"3px 12px", borderRadius:20,
      border:`1px solid ${active ? color+"88" : C.border}`,
      background: active ? `${color}18` : "transparent",
      color: active ? color : C.sub,
      fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:500,
      whiteSpace:"nowrap", letterSpacing:"0.03em",
      boxShadow: active ? `0 2px 8px ${color}25, 0 0 0 1px ${color}30` : "none",
    }}>{label}</button>
  );
}

/* ─── MAIN APP ────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [selUser,   setSelUser]   = useState("All");
  const [selType,   setSelType]   = useState("All");
  const [selState,  setSelState]  = useState("All");
  const [dateFrom,  setDateFrom]  = useState("");
  const [dateTo,    setDateTo]    = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  /* Live data */
  const { data:rawV, loading:lV, lastUpdated:luV, refetch:rfV } = useSheetTab(SHEET_URLS.visitors);
  const { data:rawL, loading:lL, lastUpdated:luL, refetch:rfL } = useSheetTab(SHEET_URLS.leads);
  const { data:rawS, loading:lS, lastUpdated:luS, refetch:rfS } = useSheetTab(SHEET_URLS.sales);

  const refetchAll  = useCallback(() => { rfV(); rfL(); rfS(); }, [rfV,rfL,rfS]);
  const loading     = lV || lL || lS;
  const lastUpdated = luV || luL || luS;

  const VISITORS = useMemo(() => rawV.length > 0 ? transformVisitors(rawV) : STATIC_VISITORS, [rawV]);
  const LEADS    = useMemo(() => rawL.length > 0 ? transformLeads(rawL)    : STATIC_LEADS,    [rawL]);
  const SALES    = useMemo(() => rawS.length > 0 ? transformSales(rawS)    : STATIC_SALES,    [rawS]);

  const ACTIVITY = useMemo(() => [
    ...VISITORS.map(r => ({...r, _src:"Visit"})),
    ...LEADS.map(r => ({...r, _src:"Lead"})),
  ].sort((a,b) => new Date(b.date)-new Date(a.date)), [VISITORS,LEADS]);

  /* Master lists */
  const masterUsers  = useMemo(() => { const s=new Set(); [...VISITORS,...LEADS,...SALES].forEach(r=>r.user&&s.add(r.user)); return ["All",...Array.from(s).sort()]; }, [VISITORS,LEADS,SALES]);
  const masterTypes  = useMemo(() => { const s=new Set(); [...VISITORS,...LEADS,...SALES].forEach(r=>r.leadType&&s.add(r.leadType)); return ["All",...Array.from(s).sort()]; }, [VISITORS,LEADS,SALES]);
  const masterStates = useMemo(() => { const s=new Set(); [...VISITORS,...LEADS,...SALES].forEach(r=>r.state&&s.add(r.state)); return ["All",...Array.from(s).sort()]; }, [VISITORS,LEADS,SALES]);

  /* Filter */
  const filterRow = useCallback(r =>
    (selUser  ==="All" || r.user     ===selUser)  &&
    (selType  ==="All" || r.leadType ===selType)  &&
    (selState ==="All" || r.state    ===selState) &&
    inRange(r.date, dateFrom, dateTo),
  [selUser,selType,selState,dateFrom,dateTo]);

  const fV = useMemo(() => VISITORS.filter(filterRow), [VISITORS,filterRow]);
  const fL = useMemo(() => LEADS.filter(filterRow),    [LEADS,filterRow]);
  const fS = useMemo(() => SALES.filter(filterRow),    [SALES,filterRow]);
  const fA = useMemo(() => ACTIVITY.filter(filterRow), [ACTIVITY,filterRow]);

  /* KPIs */
  const totalRev = useMemo(() => fS.reduce((s,r)=>s+(r.amount||0),0), [fS]);
  const quotSent = useMemo(() => fL.filter(r=>r.stage==="Quotation Send"||r.stage==="Hot Lead").length, [fL]);
  const hotLeads = useMemo(() => fL.filter(r=>r.stage==="Hot Lead").length, [fL]);

  /* Chart data */
  function grp(arr, key, top=10) {
    const m={};
    arr.forEach(r=>{ if(r[key]) m[r[key]]=(m[r[key]]||0)+1; });
    return Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,top);
  }
  function grpAmt(arr, key, top=8) {
    const m={};
    arr.forEach(r=>{ if(r[key]) m[r[key]]=(m[r[key]]||0)+(r.amount||0); });
    return Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,top);
  }

  const sourceData     = useMemo(()=>grp(fL,"source",8), [fL]);
  const stageData      = useMemo(()=>[
    {name:"New",       value:fL.filter(r=>r.stage==="New").length,            color:C.cyan},
    {name:"Follow up", value:fL.filter(r=>r.stage==="Follow up").length,      color:C.violet},
    {name:"Hot Lead",  value:fL.filter(r=>r.stage==="Hot Lead").length,       color:C.orange},
    {name:"Quot. Send",value:fL.filter(r=>r.stage==="Quotation Send").length, color:C.gold},
    {name:"Pending",   value:fL.filter(r=>r.stage==="Pending").length,        color:C.rose},
  ].filter(d=>d.value>0), [fL]);

  const userSalesRev   = useMemo(()=>grpAmt(fS,"user"),      [fS]);
  const userSalesCnt   = useMemo(()=>grp(fS,"user"),         [fS]);
  const typeSalesCnt   = useMemo(()=>grp(fS,"leadType"),     [fS]);
  const stateSalesRev  = useMemo(()=>grpAmt(fS,"state"),     [fS]);
  const stateSalesCnt  = useMemo(()=>grp(fS,"state"),        [fS]);
  const competitorData = useMemo(()=>grp(fV,"competitors",8),[fV]);
  const userVisitorCnt = useMemo(()=>grp(fV,"user",8),       [fV]);

  const anyFilter = selUser!=="All"||selType!=="All"||selState!=="All"||dateFrom||dateTo;

  const TABS = [
    {id:"overview", label:"Overview",     icon:"◈"},
    {id:"leads",    label:"Leads",        icon:"◎"},
    {id:"sales",    label:"Sales",        icon:"◆"},
    {id:"visitors", label:"Visitors",     icon:"◉"},
    {id:"activity", label:"Activity Log", icon:"≡"},
  ];

  /* ── Input style shared ── */
  const dateInputStyle = {
    background:"#1a1510", border:`1px solid ${C.border}`, borderRadius:8,
    color:C.text, padding:"5px 10px", fontSize:11,
    fontFamily:"'Outfit',sans-serif", outline:"none", cursor:"pointer",
    colorScheme:"dark",
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Outfit',sans-serif",
      backgroundImage:`
        radial-gradient(ellipse 70% 50% at 15% -5%,  #2a1f0a 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 85% 100%, #1a1408 0%, transparent 55%)
      `}}>
      <style>{GCSS}</style>

      {/* ══ HEADER ════════════════════════════════════════════════════ */}
      <header style={{
        background:`linear-gradient(180deg,#1e1a12 0%,#161208 100%)`,
        borderBottom:`1px solid ${C.border}`,
        padding:"0 24px", height:64,
        display:"flex", alignItems:"center", gap:14,
        boxShadow:`0 4px 32px rgba(0,0,0,0.7), 0 1px 0 rgba(200,151,58,0.15)`,
        position:"sticky", top:0, zIndex:200,
      }}>
        {/* NIC Logo */}
        <NicLogo size={46}/>

        <div style={{borderLeft:`1px solid ${C.border}`,paddingLeft:14}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:19,
            color:C.text,letterSpacing:"0.04em",lineHeight:1}}>
            North India Compressors
          </div>
          <div style={{fontSize:9,color:C.gold,letterSpacing:"0.22em",marginTop:3,
            fontFamily:"'Outfit',sans-serif",fontWeight:600}}>
            SALES INTELLIGENCE DASHBOARD · JAN–FEB 2026
          </div>
        </div>

        <div style={{flex:1}}/>

        {/* Sync */}
        <div style={{display:"flex",alignItems:"center",gap:10,fontSize:11}}>
          {loading
            ? <span style={{color:C.goldHi,display:"flex",alignItems:"center",gap:6}}>
                <span className="loading-spin">⟳</span> SYNCING…
              </span>
            : <span style={{color:C.green,fontSize:11}}>
                ✓ LIVE · {lastUpdated?.toLocaleTimeString()||"—"}
              </span>
          }
          <button onClick={refetchAll} style={{
            background:`linear-gradient(135deg,${C.gold}22,${C.gold}0a)`,
            border:`1px solid ${C.gold}66`, color:C.gold, borderRadius:8,
            padding:"5px 16px", cursor:"pointer", fontSize:11,
            fontFamily:"'Outfit',sans-serif", fontWeight:600, letterSpacing:"0.08em",
          }}>↺ REFRESH</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginLeft:8}}>
          {TABS.map(({id,label,icon})=>(
            <button key={id} className="tab-btn" onClick={()=>setActiveTab(id)} style={{
              background: activeTab===id ? `linear-gradient(135deg,${C.gold}20,${C.gold}08)` : "transparent",
              border:`1px solid ${activeTab===id ? C.gold+"66" : C.border}`,
              color: activeTab===id ? C.gold : C.sub,
              borderRadius:9, padding:"5px 16px", cursor:"pointer",
              fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:600,
              letterSpacing:"0.05em",
              boxShadow: activeTab===id ? `0 0 12px ${C.gold}20` : "none",
            }}>{icon} {label}</button>
          ))}
        </div>
      </header>

      {/* ══ FILTER BAR ════════════════════════════════════════════════ */}
      <div style={{
        background:`linear-gradient(180deg,#181410,#131008)`,
        borderBottom:`1px solid ${C.border}`,
        padding:"10px 24px",
        display:"flex", flexDirection:"column", gap:8,
        boxShadow:"0 2px 16px rgba(0,0,0,0.5)",
      }}>
        {/* Date range row */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"0.2em",
            fontFamily:"'Outfit',sans-serif",minWidth:44}}>DATE</span>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
            style={dateInputStyle} title="From date"/>
          <span style={{color:C.dim,fontSize:12}}>→</span>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
            style={dateInputStyle} title="To date"/>
          {(dateFrom||dateTo) && (
            <button onClick={()=>{setDateFrom("");setDateTo("");}} style={{
              background:`${C.rose}18`, border:`1px solid ${C.rose}66`,
              color:C.rose, borderRadius:6, padding:"3px 10px",
              fontSize:10, cursor:"pointer", fontFamily:"'Outfit',sans-serif",
            }}>✕ Clear</button>
          )}
          {dateFrom && dateTo && (
            <span style={{fontSize:10,color:C.sub}}>
              Showing: {fmtDate(dateFrom)} — {fmtDate(dateTo)}
            </span>
          )}
        </div>

        {/* USER filter */}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"0.2em",
            fontFamily:"'Outfit',sans-serif",minWidth:44}}>USER</span>
          {masterUsers.map(v=>(
            <Pill key={v} label={v==="All"?"ALL":v} active={selUser===v}
              color={C.cyan} onClick={()=>setSelUser(v)}/>
          ))}
        </div>

        {/* TYPE filter */}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"0.2em",
            fontFamily:"'Outfit',sans-serif",minWidth:44}}>TYPE</span>
          {masterTypes.map(v=>(
            <Pill key={v} label={v==="All"?"ALL":(v.length>13?v.slice(0,13)+"…":v)}
              active={selType===v} color={C.violet} onClick={()=>setSelType(v)}/>
          ))}
        </div>

        {/* STATE filter */}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"0.2em",
            fontFamily:"'Outfit',sans-serif",minWidth:44}}>STATE</span>
          {masterStates.map(v=>(
            <Pill key={v} label={v==="All"?"ALL":(v.length>12?v.slice(0,12)+"…":v)}
              active={selState===v} color={C.green} onClick={()=>setSelState(v)}/>
          ))}
          {anyFilter && (
            <button onClick={()=>{setSelUser("All");setSelType("All");setSelState("All");setDateFrom("");setDateTo("");}} style={{
              padding:"3px 12px",borderRadius:20,border:`1px solid ${C.rose}66`,
              background:`${C.rose}12`,color:C.rose,fontSize:11,cursor:"pointer",
              fontFamily:"'Outfit',sans-serif",fontWeight:600,marginLeft:8,
            }}>✕ RESET ALL</button>
          )}
        </div>
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>

        {/* ══ KPI CARDS ═════════════════════════════════════════════ */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <KpiCard label="Total Visitors"  value={fV.length}      color={C.cyan}   icon="👥" sub="customer visits recorded"          delay={0}/>
          <KpiCard label="Total Leads"     value={fL.length}      color={C.violet} icon="🎯" sub={`${hotLeads} hot leads`}           delay={70}/>
          <KpiCard label="Total Sales"     value={fS.length}      color={C.green}  icon="✅" sub="orders confirmed"                  delay={140}/>
          <KpiCard label="Quotations Sent" value={quotSent}       color={C.amber}  icon="📄" sub="Hot Lead + Quot. Send"            delay={210}/>
          <KpiCard label="Total Revenue"   value={fmt(totalRev)}  color={C.gold}   icon="💰" sub={`avg ${fmt(totalRev/(fS.length||1))}/sale`} delay={280}/>
        </div>

        {/* ══ OVERVIEW TAB ══════════════════════════════════════════ */}
        {activeTab==="overview" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>

            <ChartCard title="Lead Source — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={sourceData} margin={{top:4,right:4,left:-22,bottom:44}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9,fontFamily:"Outfit"}} angle={-38} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
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
                <BarChart data={stateSalesRev} layout="vertical" margin={{top:4,right:50,left:88,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Outfit"}} width={85}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {stateSalesRev.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales — Revenue">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={userSalesRev} layout="vertical" margin={{top:4,right:50,left:118,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Outfit"}} width={115}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {userSalesRev.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={userSalesCnt} layout="vertical" margin={{top:4,right:30,left:118,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Outfit"}} width={115}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:11,fontFamily:"Outfit",fontWeight:600}}>
                    {userSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Type Sales — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={typeSalesCnt} layout="vertical" margin={{top:4,right:30,left:108,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Outfit"}} width={105}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:11,fontFamily:"Outfit",fontWeight:600}}>
                    {typeSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Competitors (Visit)">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={competitorData} margin={{top:4,right:4,left:-22,bottom:50}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9,fontFamily:"Outfit"}} angle={-38} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {competitorData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Visitors by User">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={userVisitorCnt} margin={{top:4,right:4,left:-22,bottom:50}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9,fontFamily:"Outfit"}} angle={-38} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {userVisitorCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="State Sales — Count">
              <ResponsiveContainer width="100%" height={195}>
                <BarChart data={stateSalesCnt} layout="vertical" margin={{top:4,right:30,left:88,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10,fontFamily:"Outfit"}} width={85}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:11,fontFamily:"Outfit",fontWeight:600}}>
                    {stateSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        )}

        {activeTab==="leads" && (
          <DataTable rows={fL}
            cols={["date","source","user","customer","contact","mobile","state","leadType","stage","remarks"]}
            headers={["Date","Source","User","Customer Name","Contact Person","Mobile","State","Lead Type","Stage","Remarks"]}
            title="Lead Records" color={C.violet} stageCol="stage" fmtCol={{date:fmtDate}}/>
        )}
        {activeTab==="sales" && (
          <DataTable rows={fS}
            cols={["date","customer","user","leadType","amount","state","products"]}
            headers={["Date","Customer","User","Lead Type","PO Amount","State","Products"]}
            title="Sales Records" color={C.green} amountCol="amount" fmtCol={{date:fmtDate,amount:fmt}}/>
        )}
        {activeTab==="visitors" && (
          <DataTable rows={fV}
            cols={["date","leadType","user","customer","contact","state","city","competitors","remarks"]}
            headers={["Date","Lead Type","User","Customer Name","Contact Person","State","City","Competitor","Remarks"]}
            title="Visitor Records" color={C.cyan} fmtCol={{date:fmtDate}}/>
        )}
        {activeTab==="activity" && (
          <DataTable rows={fA}
            cols={["date","_src","leadType","user","customer","contact","state","stage","remarks"]}
            headers={["Date","Type","Lead Type","User","Customer Name","Contact","State","Stage","Remarks"]}
            title="Combined Activity Log" color={C.gold} stageCol="stage" srcCol="_src" fmtCol={{date:fmtDate}}/>
        )}

      </div>

      {/* Footer */}
      <div style={{textAlign:"center",padding:"16px 24px",borderTop:`1px solid ${C.border}`,
        color:C.dim,fontSize:10,letterSpacing:"0.12em",fontFamily:"'Outfit',sans-serif"}}>
        NORTH INDIA COMPRESSORS PVT LTD — SALES INTELLIGENCE PLATFORM © 2026
      </div>
    </div>
  );
}

/* ─── DATA TABLE ──────────────────────────────────────────────────────── */
function DataTable({ rows, cols, headers, title, color, stageCol, amountCol, srcCol, fmtCol={} }) {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(0);
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const PER = 20;

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a,b) => {
      let av = a[sortCol]??"", bv = b[sortCol]??"";
      if (sortCol === "date") { av = new Date(av); bv = new Date(bv); }
      if (sortCol === "amount") { av = Number(av); bv = Number(bv); }
      if (av < bv) return sortDir==="asc" ? -1 : 1;
      if (av > bv) return sortDir==="asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sortCol, sortDir]);

  const filtered = useMemo(() => {
    if (!search) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [sorted, search]);

  const paged = filtered.slice(page*PER, (page+1)*PER);
  const pages = Math.ceil(filtered.length/PER);

  function toggleSort(col) {
    if (sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortCol(col); setSortDir("desc"); }
  }

  const STAGE_C2 = {
    "New":"#4db8d4","Hot Lead":"#d4884a","Quotation Send":"#c8973a","Follow up":"#9b7fd4","Pending":"#d4697a",
  };

  function cellStyle(col, val) {
    if (col===amountCol) return {color:C.green, fontWeight:600};
    if (col===stageCol)  return {color:STAGE_C2[val]||C.text, fontWeight:600};
    if (col===srcCol)    return {color:val==="Lead"?C.violet:C.cyan, fontWeight:600};
    if (col==="date")    return {color:C.sub, whiteSpace:"nowrap"};
    if (col==="user")    return {color:C.gold, fontWeight:500};
    return {};
  }

  function cellVal(col, val) {
    if (fmtCol[col]) return fmtCol[col](val);
    return String(val??"");
  }

  return (
    <div style={{
      background:`linear-gradient(160deg,#1e1c14,#161410)`,
      border:`1px solid ${C.border}`, borderRadius:14, padding:18,
      display:"flex", flexDirection:"column", gap:12,
      boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
      position:"relative", overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${color}99,${color},${color}99,transparent)`}}/>

      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{fontSize:10,fontWeight:700,color,textTransform:"uppercase",
          letterSpacing:"0.16em",fontFamily:"'Outfit',sans-serif",
          display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:2,height:14,background:color,borderRadius:1,display:"inline-block"}}/>
          {title}
          <span style={{color:C.dim,fontWeight:500}}>({filtered.length})</span>
        </div>
        <div style={{flex:1}}/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}
          placeholder="🔍  Search records…"
          style={{background:"#1a1510",border:`1px solid ${C.border}`,borderRadius:8,
            color:C.text,padding:"6px 14px",fontSize:11,fontFamily:"'Outfit',sans-serif",
            outline:"none",width:220}}/>
      </div>

      <div style={{overflowX:"auto",borderRadius:10,border:`1px solid ${C.border}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:`linear-gradient(180deg,#201e14,#181610)`}}>
              {(headers||cols).map((h,i)=>(
                <th key={i} onClick={()=>toggleSort(cols[i])} style={{
                  padding:"10px 14px",textAlign:"left",fontWeight:700,
                  borderBottom:`1px solid ${C.border}`,color:color,
                  fontFamily:"'Outfit',sans-serif",fontSize:9,letterSpacing:"0.12em",
                  textTransform:"uppercase",whiteSpace:"nowrap",cursor:"pointer",
                  userSelect:"none",
                }}>
                  {h} {sortCol===cols[i] ? (sortDir==="asc"?"↑":"↓") : <span style={{opacity:0.3}}>↕</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row,i)=>(
              <tr key={i} className="trow"
                style={{borderBottom:`1px solid ${C.border}33`,background: i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {cols.map(col=>(
                  <td key={col} style={{
                    padding:"9px 14px",fontFamily:"'Outfit',sans-serif",letterSpacing:"0.02em",
                    whiteSpace:"nowrap",maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",
                    ...cellStyle(col,row[col]),
                  }}>
                    {cellVal(col,row[col])}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length===0 && (
              <tr><td colSpan={cols.length} style={{padding:24,color:C.dim,textAlign:"center",
                fontFamily:"'Outfit',sans-serif",fontSize:12,letterSpacing:"0.1em"}}>
                No records found
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages>1 && (
        <div style={{display:"flex",gap:8,justifyContent:"center",alignItems:"center"}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{
            background:"none",border:`1px solid ${C.border}`,color:C.sub,borderRadius:8,
            padding:"4px 16px",cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600}}>← Prev</button>
          <span style={{color:C.gold,fontSize:12,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>
            Page {page+1} of {pages}
          </span>
          <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1} style={{
            background:"none",border:`1px solid ${C.border}`,color:C.sub,borderRadius:8,
            padding:"4px 16px",cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Next →</button>
        </div>
      )}
    </div>
  );
}
