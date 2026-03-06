import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useSheetTab, transformVisitors, transformLeads, transformSales } from "./useSheetData";

/* ── GOOGLE SHEETS URLS ─────────────────────────────────────────────────────── */
const SHEET_URLS = {
  visitors: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=0&single=true&output=csv",
  leads:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=2066525621&single=true&output=csv",
  sales:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=23552387&single=true&output=csv",
};

/* ── THEME ──────────────────────────────────────────────────────────────────── */
const C = {
  bg:"#060e1a", surface:"#0d1829", card:"#0d1829", cardHi:"#14223a",
  border:"#1e3048", text:"#e8f0fe", sub:"#6b8cae", dim:"#3a5070",
  gold:"#f0b429", cyan:"#00cfff", green:"#00e68a", violet:"#b57bff",
  rose:"#ff5075", orange:"#ff8c42",
};
const PALETTE = ["#00cfff","#00e68a","#f0b429","#ff5075","#b57bff","#ff8c42","#4dffdb","#ff6b9d","#a3e635","#fb923c"];

/* ── STATIC FALLBACK DATA ───────────────────────────────────────────────────── */
const STATIC_VISITORS = [
  {date:"2026-01-12",leadType:"MCS+MRC",user:"Ashwin Garg",customer:"sp pulses",contact:"tikam sharma",state:"Rajasthan",city:"ajmer",competitors:"No",remarks:"Sortex on moong mogar 10 chute"},
  {date:"2026-01-27",leadType:"COLOR SORTER",user:"Ashwin Garg",customer:"hem industries",contact:"rishabh",state:"Rajasthan",city:"Ajmer",competitors:"No",remarks:"Sortex on Moong mogar, Final price given"},
  {date:"2026-01-23",leadType:"COLOR SORTER",user:"Shivgatulla",customer:"Chetak roller flour mill",contact:"Nitesh khokhar",state:"Uttar Pradesh",city:"Basti",competitors:"Competitors",remarks:"Discussion for color sorter"},
  {date:"2026-01-29",leadType:"Kaeser AIR COMPRESSOR",user:"Jaipal",customer:"SAI KIRPA STEEL INDUSTRY",contact:"RAKESH KUMAR JI",state:"Delhi",city:"BAWANA",competitors:"compititor",remarks:"REQUIR COMPRESSOR IN NEXT 6 MONTHS"},
  {date:"2026-01-24",leadType:"COLOR SORTER",user:"Rahul Mahant",customer:"Vardhan industries",contact:"Aman jain",state:"Madhya Pradesh",city:"Begamganj",competitors:"Milltech",remarks:"Plant shutdown due loss"},
  {date:"2026-01-10",leadType:"Kaeser AIR COMPRESSOR",user:"Govind",customer:"Shree shyam industry",contact:"Pardeep kasniya",state:"Haryana",city:"Fathebad",competitors:"Competitor",remarks:"Meeting with MD"},
  {date:"2026-01-01",leadType:"MCS+MRC",user:"Ashwin Garg",customer:"Agrawal Bandhu",contact:"Sahil Agrawal",state:"Madhya Pradesh",city:"Indore",competitors:"No",remarks:"8 chute DLT on chana dal"},
  {date:"2026-01-03",leadType:"COLOR SORTER",user:"Shivgatulla",customer:"Mahashakti foods pvt ltd",contact:"Aakash jalan",state:"Uttar Pradesh",city:"Gorakhpur",competitors:"Competitors",remarks:"13 Chute color sorter enquiry"},
  {date:"2026-01-15",leadType:"Kaeser AIR COMPRESSOR",user:"Himanshu Nagar",customer:"Shree balaji food industries",contact:"Kamlesh Gupta",state:"Madhya Pradesh",city:"Bhind",competitors:"Construction",remarks:"Plan colour sorter next Year"},
  {date:"2026-01-17",leadType:"Kaeser AIR COMPRESSOR",user:"Govind",customer:"Lakhdatar international Pvt Ltd",contact:"Shivam goyal",state:"Haryana",city:"Ghrounda",competitors:"Na",remarks:"Plant add, Requirement 2 month"},
];
const STATIC_LEADS = [
  {date:"2026-01-15",uqn:"KC/NICPL0G000/2026/2930",source:"By Meeting",user:"Govind",customer:"M/s JITENDRA COTTEX",contact:"Mr .Sachin jaglan",mobile:"+91-9112000063",remarks:"Need- 30hp Compressor",state:"Haryana",leadType:"Kaeser AIR COMPRESSOR",stage:"Quotation Send"},
  {date:"2026-01-15",uqn:"M001/NICPL0S001/2026/2929",source:"Calling",user:"Shivgatulla",customer:"Sudipta hati",contact:"Sudipta hati",mobile:"8293916079",remarks:"Quotation send and he is finalized",state:"West Bengal",leadType:"MCS+MRC",stage:"Quotation Send"},
  {date:"2026-01-15",uqn:"CS/ERGYT/2026/2927",source:"Google Adwords",user:"Sachin Kumar 2",customer:"GDP AGRO AND FOOD PRODUCTS",contact:"Mr. Dharam Aggarwal Ji",mobile:"+91-9827259553",remarks:"Need Meyer Color Sorter for Peanuts",state:"Madhya Pradesh",leadType:"COLOR SORTER",stage:"Follow up"},
  {date:"2026-01-14",uqn:"CS/MU/2026/2926",source:"By Meeting",user:"Murli dar sukla",customer:"JAY AMBEY PULSES",contact:"Sipoliya ji",mobile:"+91-7355020465",remarks:"he want 8 chute meyer color sorter",state:"Uttar Pradesh",leadType:"COLOR SORTER",stage:"New"},
  {date:"2026-01-13",uqn:"CS/NICUU001/2026/2920",source:"Calling",user:"Ujjwal Upadhyay",customer:"Mr akash mittal",contact:"Mr akash mittal",mobile:"7415388948",remarks:"he told approximate price",state:"Madhya Pradesh",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-01-10",uqn:"CS/ERGYT/2026/2917",source:"Google Adwords",user:"Sachin Kumar 2",customer:"JAGDAMBA ENTERPRISES",contact:"Mr. Sunil Kumar Agarwal",mobile:"+91-9784088462",remarks:"Need Color Sorter For Groundnuts",state:"Rajasthan",leadType:"COLOR SORTER",stage:"Quotation Send"},
  {date:"2026-01-29",uqn:"CS/DEMORM0002/2026/2976",source:"By Meeting",user:"Rahul Mahant",customer:"Vardhman dall milll",contact:"Rahul jain",mobile:"9893480631",remarks:"Planning 6 chute sortex with 30 hp compressor",state:"Madhya Pradesh",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-02-28",uqn:"CS/NICPLR001/2026/3064",source:"By Visit",user:"Rahul Verma",customer:"Palak traders",contact:"Aman Khandelwal",mobile:"+917000969542",remarks:"CS 6 chute requirement",state:"Uttar Pradesh",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-02-13",uqn:"CS/NICUU001/2026/3008",source:"By Meeting",user:"Ujjwal Upadhyay",customer:"Sujay Agro Industries",contact:"Manish Pamecha",mobile:"+91-9301705009",remarks:"sortex not finalized yet",state:"Madhya Pradesh",leadType:"COLOR SORTER",stage:"Quotation Send"},
  {date:"2026-02-09",uqn:"CS/MU/2026/2994",source:"By Meeting",user:"Murli dar sukla",customer:"SS enterprises",contact:"KAMAL JAIN",mobile:"+91-9111234572",remarks:"finalize thinker model 8 chute",state:"Madhya Pradesh",leadType:"COLOR SORTER",stage:"Hot Lead"},
];
const STATIC_SALES = [
  {date:"2026-01-01",customer:"HINDUSTHAN AGRI SEEDS PVT LTD",user:"Murli dar sukla",leadType:"MCS with KAESER Compressor",amount:3500000,state:"West Bengal",products:"MCS",gst:""},
  {date:"2026-01-01",customer:"Bankura agro processing Pvt.ltd",user:"Murli dar sukla",leadType:"MCS+MRC",amount:3751000,state:"West Bengal",products:"MCS+MRC",gst:""},
  {date:"2026-01-06",customer:"Shree Radha Laxmi Industries",user:"Arvind Kumar",leadType:"Grain Dryer",amount:6232594,state:"Uttar Pradesh",products:"Grain Dryer",gst:""},
  {date:"2026-01-06",customer:"Singhai & singhai",user:"RAHUL SIR",leadType:"COLOR SORTER",amount:5200000,state:"Uttar Pradesh",products:"CS",gst:""},
  {date:"2026-01-07",customer:"Prashant maheshwari",user:"Rahul Mahant",leadType:"MCS+MRC",amount:3121000,state:"Madhya Pradesh",products:"MCS+MRC",gst:""},
  {date:"2026-01-10",customer:"AGRAWAL BANDHU AGRO TECH PVT.LTD.",user:"Murli dar sukla",leadType:"COLOR SORTER",amount:3200000,state:"Madhya Pradesh",products:"CS",gst:""},
  {date:"2026-01-12",customer:"Dhirendra International pvt ltd",user:"Ashwin Garg",leadType:"COLOR SORTER",amount:4500000,state:"Madhya Pradesh",products:"CS",gst:""},
  {date:"2026-01-12",customer:"RAJAT AGRO LLP",user:"Ashwin Garg",leadType:"COLOR SORTER",amount:4100000,state:"Gujarat",products:"CS",gst:""},
  {date:"2026-01-14",customer:"Shree Balaji Export",user:"Ashwin Garg",leadType:"COLOR SORTER",amount:3750000,state:"Madhya Pradesh",products:"CS",gst:""},
  {date:"2026-01-14",customer:"M.M PULSES",user:"Murli dar sukla",leadType:"AIR DRYER",amount:4550000,state:"Madhya Pradesh",products:"Air Dryer",gst:""},
  {date:"2026-01-15",customer:"Shree Giriraj Enterprises",user:"Ashwin Garg",leadType:"COLOR SORTER",amount:2000000,state:"Madhya Pradesh",products:"CS",gst:""},
  {date:"2026-01-15",customer:"HOTWANI FOOD INGREDIENTS",user:"Ashwin Garg",leadType:"MCS+MRC",amount:2470000,state:"Madhya Pradesh",products:"MCS+MRC",gst:""},
  {date:"2026-01-25",customer:"Prashant maheshwari",user:"Rahul Mahant",leadType:"MCS+MRC",amount:2800000,state:"Madhya Pradesh",products:"MCS+MRC",gst:""},
  {date:"2026-02-05",customer:"Anand Foods",user:"Arvind Kumar",leadType:"COLOR SORTER",amount:3900000,state:"Uttar Pradesh",products:"CS",gst:""},
  {date:"2026-02-13",customer:"Hem industries",user:"Ashwin Garg",leadType:"COLOR SORTER",amount:4200000,state:"Rajasthan",products:"CS",gst:""},
];

/* ── HELPERS ────────────────────────────────────────────────────────────────── */
function fmt(n) {
  if (!n) return "₹0";
  if (n >= 1e7) return `₹${(n/1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n/1e5).toFixed(1)} L`;
  if (n >= 1e3) return `₹${(n/1e3).toFixed(0)}K`;
  return `₹${n}`;
}

/* ── SMALL COMPONENTS ───────────────────────────────────────────────────────── */
const FilterPill = ({ label, active, onClick, color = C.cyan }) => (
  <button onClick={onClick} style={{
    padding:"3px 12px", borderRadius:20, border:`1px solid ${active ? color : C.border}`,
    background: active ? `${color}22` : "transparent", color: active ? color : C.sub,
    fontSize:11, cursor:"pointer", fontFamily:"'IBM Plex Mono',monospace", fontWeight:600,
    whiteSpace:"nowrap", transition:"all .15s",
  }}>{label}</button>
);

const KpiCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background:`linear-gradient(135deg,${C.card},${C.cardHi})`,
    border:`1px solid ${color}44`, borderRadius:14, padding:"16px 18px",
    flex:1, minWidth:130, position:"relative", overflow:"hidden",
    boxShadow:`0 4px 24px ${color}18`,
  }}>
    <div style={{position:"absolute",top:-15,right:-15,fontSize:52,opacity:0.07}}>{icon}</div>
    <div style={{fontSize:10,color:C.sub,textTransform:"uppercase",letterSpacing:"0.12em",
      fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}>{label}</div>
    <div style={{fontSize:28,fontWeight:800,color,fontFamily:"'Syne',sans-serif",lineHeight:1.1}}>{value}</div>
    {sub && <div style={{fontSize:10,color:C.dim,marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{fontSize:11,fontWeight:700,color:C.gold,textTransform:"uppercase",
    letterSpacing:"0.14em",fontFamily:"'IBM Plex Mono',monospace",marginBottom:10,
    display:"flex",alignItems:"center",gap:8}}>
    <span style={{width:3,height:14,background:C.gold,borderRadius:2,display:"inline-block"}}/>
    {children}
  </div>
);

function ChartCard({ title, children, minH = 230 }) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16,minHeight:minH}}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

const SyncBadge = ({ loading, error, lastUpdated, onRefresh }) => (
  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:10,fontFamily:"'IBM Plex Mono',monospace"}}>
    {loading && <span style={{color:C.cyan}}>⟳ SYNCING…</span>}
    {error   && <span style={{color:C.rose}}>⚠ Error</span>}
    {!loading && !error && lastUpdated && (
      <span style={{color:C.green}}>✓ LIVE · {lastUpdated.toLocaleTimeString()}</span>
    )}
    <button onClick={onRefresh} style={{
      background:"none",border:`1px solid ${C.border}`,borderRadius:6,
      color:C.sub,padding:"2px 8px",cursor:"pointer",fontSize:10,
      fontFamily:"'IBM Plex Mono',monospace",
    }}>↺ Refresh</button>
  </div>
);

/* ── MAIN DASHBOARD ─────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [selUser,   setSelUser]   = useState("All");
  const [selType,   setSelType]   = useState("All");
  const [selState,  setSelState]  = useState("All");
  const [activeTab, setActiveTab] = useState("overview");

  /* ── Fetch live data ── */
  const { data: rawV, loading: lV, error: eV, lastUpdated: luV, refetch: rfV } = useSheetTab(SHEET_URLS.visitors);
  const { data: rawL, loading: lL, error: eL, lastUpdated: luL, refetch: rfL } = useSheetTab(SHEET_URLS.leads);
  const { data: rawS, loading: lS, error: eS, lastUpdated: luS, refetch: rfS } = useSheetTab(SHEET_URLS.sales);

  const refetchAll = useCallback(() => { rfV(); rfL(); rfS(); }, [rfV, rfL, rfS]);
  const loading     = lV || lL || lS;
  const error       = eV || eL || eS;
  const lastUpdated = luV || luL || luS;

  /* ── Transform + fallback ── */
  const VISITORS = useMemo(() =>
    rawV.length > 0 ? transformVisitors(rawV) : STATIC_VISITORS,
  [rawV]);

  const LEADS = useMemo(() =>
    rawL.length > 0 ? transformLeads(rawL) : STATIC_LEADS,
  [rawL]);

  const SALES = useMemo(() =>
    rawS.length > 0 ? transformSales(rawS) : STATIC_SALES,
  [rawS]);

  /* ── COMBINED ACTIVITY LOG (Visitors + Leads merged) — like Power BI ── */
  const ACTIVITY = useMemo(() => {
    const fromVisitors = VISITORS.map(r => ({ ...r, _src: "Visit" }));
    const fromLeads    = LEADS.map(r => ({ ...r, _src: "Lead" }));
    return [...fromVisitors, ...fromLeads].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
  }, [VISITORS, LEADS]);

  /* ── Dynamic Master lists (from actual data) ── */
  const masterUsers = useMemo(() => {
    const s = new Set();
    ACTIVITY.forEach(r => r.user && s.add(r.user));
    SALES.forEach(r => r.user && s.add(r.user));
    return ["All", ...Array.from(s).sort()];
  }, [ACTIVITY, SALES]);

  const masterTypes = useMemo(() => {
    const s = new Set();
    ACTIVITY.forEach(r => r.leadType && s.add(r.leadType));
    SALES.forEach(r => r.leadType && s.add(r.leadType));
    return ["All", ...Array.from(s).sort()];
  }, [ACTIVITY, SALES]);

  const masterStates = useMemo(() => {
    const s = new Set();
    ACTIVITY.forEach(r => r.state && s.add(r.state));
    SALES.forEach(r => r.state && s.add(r.state));
    return ["All", ...Array.from(s).sort()];
  }, [ACTIVITY, SALES]);

  /* ── Filters ── */
  const filterRow = useCallback((row) =>
    (selUser  === "All" || row.user     === selUser)  &&
    (selType  === "All" || row.leadType === selType)  &&
    (selState === "All" || row.state    === selState),
  [selUser, selType, selState]);

  const fVisitors = useMemo(() => VISITORS.filter(filterRow), [VISITORS, filterRow]);
  const fLeads    = useMemo(() => LEADS.filter(filterRow),    [LEADS, filterRow]);
  const fSales    = useMemo(() => SALES.filter(filterRow),    [SALES, filterRow]);
  const fActivity = useMemo(() => ACTIVITY.filter(filterRow), [ACTIVITY, filterRow]);

  /* ── KPI calculations ── */
  const totalRevenue = useMemo(() => fSales.reduce((s, r) => s + (r.amount || 0), 0), [fSales]);

  // Quotation Sent = Hot Lead + Quotation Send (same as Power BI)
  const quotSent = useMemo(() =>
    fLeads.filter(r => r.stage === "Quotation Send" || r.stage === "Hot Lead").length,
  [fLeads]);

  const hotLeads = useMemo(() => fLeads.filter(r => r.stage === "Hot Lead").length, [fLeads]);

  /* ── Chart data ── */
  const sourceData = useMemo(() => {
    const m = {};
    fLeads.forEach(r => { if (r.source) m[r.source] = (m[r.source] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 10);
  }, [fLeads]);

  const stageData = useMemo(() => [
    { name: "New",          value: fLeads.filter(r => r.stage === "New").length,              color: C.cyan   },
    { name: "Follow up",    value: fLeads.filter(r => r.stage === "Follow up").length,        color: C.violet },
    { name: "Hot Lead",     value: fLeads.filter(r => r.stage === "Hot Lead").length,         color: C.orange },
    { name: "Quot. Send",   value: fLeads.filter(r => r.stage === "Quotation Send").length,   color: C.gold   },
    { name: "Pending",      value: fLeads.filter(r => r.stage === "Pending").length,          color: C.rose   },
  ].filter(d => d.value > 0), [fLeads]);

  const userSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { if (r.user) m[r.user] = (m[r.user] || 0) + r.amount; });
    return Object.entries(m).map(([n, v]) => ({ name: n.split(" ")[0], value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fSales]);

  const typeSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { if (r.leadType) m[r.leadType] = (m[r.leadType] || 0) + r.amount; });
    return Object.entries(m).map(([n, v]) => ({
      name: n.length > 13 ? n.slice(0, 13) + "…" : n, value: v
    })).sort((a, b) => b.value - a.value);
  }, [fSales]);

  const stateSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { if (r.state) m[r.state] = (m[r.state] || 0) + r.amount; });
    return Object.entries(m).map(([n, v]) => ({ name: n, value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fSales]);

  const userVisitorData = useMemo(() => {
    const m = {};
    fVisitors.forEach(r => { if (r.user) m[r.user] = (m[r.user] || 0) + 1; });
    return Object.entries(m).map(([n, v]) => ({ name: n.split(" ")[0], value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fVisitors]);

  // User sales count (for User Sales bar chart like Power BI)
  const userSalesCount = useMemo(() => {
    const m = {};
    fSales.forEach(r => { if (r.user) m[r.user] = (m[r.user] || 0) + 1; });
    return Object.entries(m).map(([n, v]) => ({ name: n.split(" ")[0], value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fSales]);

  // Lead type sales count
  const typeLeadCount = useMemo(() => {
    const m = {};
    fSales.forEach(r => { if (r.leadType) m[r.leadType] = (m[r.leadType] || 0) + 1; });
    return Object.entries(m).map(([n, v]) => ({
      name: n.length > 13 ? n.slice(0, 13) + "…" : n, value: v
    })).sort((a, b) => b.value - a.value);
  }, [fSales]);

  // Competitors breakdown (Visitors)
  const competitorsData = useMemo(() => {
    const m = {};
    fVisitors.forEach(r => {
      const key = r.competitors || "Unknown";
      m[key] = (m[key] || 0) + 1;
    });
    return Object.entries(m).map(([n, v]) => ({ name: n, value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 10);
  }, [fVisitors]);

  const stateSalesCount = useMemo(() => {
    const m = {};
    fSales.forEach(r => { if (r.state) m[r.state] = (m[r.state] || 0) + 1; });
    return Object.entries(m).map(([n, v]) => ({ name: n, value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [fSales]);

  const ttp = {
    contentStyle: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 11, fontFamily: "'IBM Plex Mono',monospace" },
    labelStyle: { color: C.sub },
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'IBM Plex Mono',monospace",
      backgroundImage: "radial-gradient(ellipse at 20% 0%,#0a2040 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,#0a1828 0%,transparent 60%)" }}>

      {/* ── HEADER ── */}
      <header style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "0 24px", display: "flex", alignItems: "center", gap: 12, height: 60,
        boxShadow: `0 2px 20px #00000044`, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg,${C.gold},${C.orange})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#000", fontFamily: "'Syne',sans-serif",
          }}>N</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: C.text, lineHeight: 1 }}>
              North India Compressors
            </div>
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.1em", marginTop: 2 }}>
              SALES DASHBOARD · JAN–FEB 2026
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <SyncBadge loading={loading} error={error} lastUpdated={lastUpdated} onRefresh={refetchAll} />
        {[["overview", "Overview"], ["leads", "Leads"], ["sales", "Sales"], ["visitors", "Visitors"], ["activity", "Activity Log"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            background: activeTab === id ? `${C.gold}22` : "none",
            border: `1px solid ${activeTab === id ? C.gold : C.border}`,
            color: activeTab === id ? C.gold : C.sub,
            borderRadius: 8, padding: "5px 14px", cursor: "pointer",
            fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600,
            transition: "all .15s",
          }}>{lbl}</button>
        ))}
      </header>

      {/* ── FILTERS (dynamic from real data) ── */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 24px",
        display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: "0.1em", marginRight: 4 }}>USER</span>
          {masterUsers.map(u => (
            <FilterPill key={u} label={u === "All" ? "All" : u.split(" ")[0]} active={selUser === u} color={C.cyan} onClick={() => setSelUser(u)} />
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: C.border }} />
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: "0.1em", marginRight: 4 }}>TYPE</span>
          {masterTypes.map(t => (
            <FilterPill key={t} label={t === "All" ? "All" : t.length > 10 ? t.slice(0, 10) + "…" : t} active={selType === t} color={C.violet} onClick={() => setSelType(t)} />
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: C.border }} />
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: "0.1em", marginRight: 4 }}>STATE</span>
          {masterStates.map(s => (
            <FilterPill key={s} label={s === "All" ? "All" : s.length > 8 ? s.slice(0, 8) + "…" : s} active={selState === s} color={C.green} onClick={() => setSelState(s)} />
          ))}
        </div>
        {(selUser !== "All" || selType !== "All" || selState !== "All") && (
          <button onClick={() => { setSelUser("All"); setSelType("All"); setSelState("All"); }} style={{
            padding: "3px 12px", borderRadius: 20, border: `1px solid ${C.rose}`,
            background: `${C.rose}18`, color: C.rose, fontSize: 11, cursor: "pointer",
            fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600,
          }}>✕ Reset All</button>
        )}
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── KPI CARDS ── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <KpiCard label="Total Visitors"   value={fVisitors.length}   color={C.cyan}   icon="👥" sub="customer visits recorded" />
          <KpiCard label="Total Leads"      value={fLeads.length}      color={C.violet} icon="🎯" sub={`${hotLeads} hot leads`} />
          <KpiCard label="Total Sales"      value={fSales.length}      color={C.green}  icon="✅" sub="orders confirmed" />
          <KpiCard label="Quotations Sent"  value={quotSent}           color={C.gold}   icon="📄" sub="Hot Lead + Quot. Send" />
          <KpiCard label="Total Revenue"    value={fmt(totalRevenue)}  color={C.orange} icon="💰" sub={`avg ${fmt(totalRevenue / (fSales.length || 1))}/sale`} />
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <ChartCard title="Lead Source (Count)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sourceData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill: C.sub, fontSize: 9 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: C.sub, fontSize: 9 }} />
                  <Tooltip {...ttp} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sourceData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Pipeline">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={80} innerRadius={35}
                    label={({ name, value }) => `${name}: ${value}`} labelLine={false} stroke="none">
                    {stageData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip {...ttp} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sales by State (Revenue)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stateSalesData} layout="vertical" margin={{ top: 4, right: 50, left: 75, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.sub, fontSize: 9 }} tickFormatter={v => fmt(v).replace("₹", "")} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 10 }} width={72} />
                  <Tooltip {...ttp} formatter={v => [fmt(v), "Revenue"]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stateSalesData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales (Revenue)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userSalesData} layout="vertical" margin={{ top: 4, right: 50, left: 60, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.sub, fontSize: 9 }} tickFormatter={v => fmt(v).replace("₹", "")} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 10 }} width={58} />
                  <Tooltip {...ttp} formatter={v => [fmt(v), "Revenue"]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {userSalesData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales (Count)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userSalesCount} layout="vertical" margin={{ top: 4, right: 30, left: 60, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.sub, fontSize: 9 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 10 }} width={58} />
                  <Tooltip {...ttp} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: "right", fill: C.sub, fontSize: 10 }}>
                    {userSalesCount.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Type Sales (Count)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={typeLeadCount} layout="vertical" margin={{ top: 4, right: 30, left: 85, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.sub, fontSize: 9 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 10 }} width={82} />
                  <Tooltip {...ttp} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: "right", fill: C.sub, fontSize: 10 }}>
                    {typeLeadCount.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Competitors (Visit)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={competitorsData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill: C.sub, fontSize: 9 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: C.sub, fontSize: 9 }} />
                  <Tooltip {...ttp} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {competitorsData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Visitors by User">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userVisitorData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill: C.sub, fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: C.sub, fontSize: 9 }} />
                  <Tooltip {...ttp} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {userVisitorData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="State Sales (Count)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stateSalesCount} layout="vertical" margin={{ top: 4, right: 30, left: 75, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.sub, fontSize: 9 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 10 }} width={72} />
                  <Tooltip {...ttp} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: "right", fill: C.sub, fontSize: 10 }}>
                    {stateSalesCount.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {/* ── VISITORS TAB ── */}
        {activeTab === "visitors" && (
          <DataTab
            rows={fVisitors}
            cols={["date", "leadType", "user", "customer", "contact", "state", "city", "competitors", "remarks"]}
            headers={["Date", "Lead Type", "User", "Customer", "Contact", "State", "City", "Competitor", "Remarks"]}
            title="Visitor Records"
            color={C.cyan}
          />
        )}

        {/* ── LEADS TAB ── */}
        {activeTab === "leads" && (
          <DataTab
            rows={fLeads}
            cols={["date", "source", "user", "customer", "contact", "mobile", "state", "leadType", "stage", "remarks"]}
            headers={["Date", "Source", "User", "Customer", "Contact", "Mobile", "State", "Lead Type", "Stage", "Remarks"]}
            title="Lead Records"
            color={C.violet}
            stageCol="stage"
          />
        )}

        {/* ── SALES TAB ── */}
        {activeTab === "sales" && (
          <DataTab
            rows={fSales}
            cols={["date", "customer", "user", "leadType", "amount", "state", "products"]}
            headers={["Date", "Customer", "User", "Lead Type", "PO Amount", "State", "Products"]}
            title="Sales Records"
            color={C.green}
            amountCol="amount"
          />
        )}

        {/* ── ACTIVITY LOG TAB (Combined Visitors + Leads) ── */}
        {activeTab === "activity" && (
          <DataTab
            rows={fActivity}
            cols={["date", "_src", "leadType", "user", "customer", "contact", "state", "stage", "remarks"]}
            headers={["Date", "Type", "Lead Type", "User", "Customer", "Contact", "State", "Stage", "Remarks"]}
            title="Combined Activity Log"
            color={C.gold}
            stageCol="stage"
            srcCol="_src"
          />
        )}
      </div>
    </div>
  );
}

/* ── DATA TABLE ─────────────────────────────────────────────────────────────── */
function DataTab({ rows, cols, headers, title, color, stageCol, amountCol, srcCol }) {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(0);
  const PER = 20;

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [rows, search]);

  const paged = filtered.slice(page * PER, (page + 1) * PER);
  const pages = Math.ceil(filtered.length / PER);

  const STAGE_COLORS = {
    "New": C.cyan, "Hot Lead": C.orange, "Quotation Send": C.gold,
    "Follow up": C.violet, "Pending": C.rose,
  };

  function cellColor(col, val) {
    if (col === amountCol) return C.green;
    if (col === stageCol)  return STAGE_COLORS[val] || C.text;
    if (col === srcCol)    return val === "Lead" ? C.violet : C.cyan;
    return C.text;
  }

  function cellVal(col, val) {
    if (col === amountCol) return fmt(val);
    return String(val ?? "");
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <SectionTitle>{title} ({filtered.length})</SectionTitle>
        <div style={{ flex: 1 }} />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Search..."
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text,
            padding: "6px 12px", fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", outline: "none", width: 200 }} />
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: C.surface }}>
              {(headers || cols).map((h, i) => (
                <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700,
                  borderBottom: `1px solid ${C.border}`, color: color,
                  fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase",
                  fontSize: 9, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}44`, transition: "background .1s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.cardHi}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {cols.map(col => (
                  <td key={col} style={{ padding: "8px 12px", color: cellColor(col, row[col]),
                    whiteSpace: "nowrap", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {cellVal(col, row[col])}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={cols.length} style={{ padding: 20, color: C.dim, textAlign: "center" }}>No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ background: "none", border: `1px solid ${C.border}`, color: C.sub, borderRadius: 7,
              padding: "4px 12px", cursor: "pointer", fontSize: 11, fontFamily: "'IBM Plex Mono',monospace" }}>Prev</button>
          <span style={{ color: C.sub, fontSize: 11 }}>{page + 1} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}
            style={{ background: "none", border: `1px solid ${C.border}`, color: C.sub, borderRadius: 7,
              padding: "4px 12px", cursor: "pointer", fontSize: 11, fontFamily: "'IBM Plex Mono',monospace" }}>Next</button>
        </div>
      )}
    </div>
  );
}
