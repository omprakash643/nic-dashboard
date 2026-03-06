import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useSheetTab, transformVisitors, transformLeads, transformSales } from "./useSheetData";

/* ─── LOGO — from your GitHub images folder ───────────────────────────── */
// Your logo file is at: /images/WhatsApp_Image_20260218_at_2_26_58_PM_1.jpeg
// We import it so Vite bundles it correctly
const LOGO_URL = "/images/WhatsApp_Image_20260218_at_2_26_58_PM_1.jpeg";

/* ─── SHEET URLS ──────────────────────────────────────────────────────── */
const SHEET_URLS = {
  visitors: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=0&single=true&output=csv",
  leads:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=2066525621&single=true&output=csv",
  sales:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=23552387&single=true&output=csv",
};

/* ─── BOLD COLORFUL THEME ─────────────────────────────────────────────── */
const C = {
  bg:       "#1a1a2e",
  surface:  "#16213e",
  card:     "#0f3460",
  cardHi:   "#1a4a80",
  border:   "#1e5f8a",

  text:     "#ffffff",
  sub:      "#b8d4f0",
  dim:      "#4a7a9b",

  // Vivid accent colors — bold like Power BI
  gold:     "#ffd700",
  goldHi:   "#ffec40",
  cyan:     "#00d4ff",
  green:    "#00e676",
  violet:   "#ce93d8",
  rose:     "#ff5252",
  orange:   "#ff9800",
  amber:    "#ffca28",
  pink:     "#f48fb1",
  teal:     "#26c6da",
  lime:     "#aeea00",
};

// Bright vivid palette for charts — same energy as Power BI
const PALETTE = [
  "#00d4ff","#00e676","#ffd700","#ff5252","#ce93d8",
  "#ff9800","#26c6da","#ffca28","#aeea00","#f48fb1",
];

const STAGE_COLORS = {
  "New":            "#00d4ff",
  "Follow up":      "#ce93d8",
  "Hot Lead":       "#ff9800",
  "Quotation Send": "#ffd700",
  "Pending":        "#ff5252",
};

/* ─── STATIC DATA ─────────────────────────────────────────────────────── */
const STATIC_VISITORS = [
  {date:"2026-01-12",leadType:"MCS+MRC",user:"ASHWIN GARG",customer:"SP Pulses",contact:"Tikam Sharma",state:"RAJASTHAN",city:"Ajmer",competitors:"No",remarks:"Sortex on moong mogar 10 chute"},
  {date:"2026-01-27",leadType:"COLOR SORTER",user:"ASHWIN GARG",customer:"Hem Industries",contact:"Rishabh",state:"RAJASTHAN",city:"Ajmer",competitors:"No",remarks:"Final price given"},
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
  {date:"2026-01-15",uqn:"M001/2929",source:"Calling",user:"SHIVGATULLA",customer:"Sudipta Hati",contact:"Sudipta Hati",mobile:"8293916079",remarks:"Quotation send finalized",state:"WEST BENGAL",leadType:"MCS+MRC",stage:"Quotation Send"},
  {date:"2026-01-15",uqn:"CS/ERGYT/2026/2927",source:"Google Adwords",user:"SACHIN KUMAR 2",customer:"GDP Agro And Food Products Pvt Ltd",contact:"Dharam Aggarwal",mobile:"+91-9827259553",remarks:"Need Meyer Color Sorter for Peanuts",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Follow up"},
  {date:"2026-01-14",uqn:"CS/MU/2026/2926",source:"By Meeting",user:"MURLI DAR SUKLA",customer:"Jay Ambey Pulses",contact:"Sipoliya Ji",mobile:"+91-7355020465",remarks:"Want 8 chute meyer color sorter",state:"UTTAR PRADESH",leadType:"COLOR SORTER",stage:"New"},
  {date:"2026-01-13",uqn:"CS/NICUU001/2926/2920",source:"Calling",user:"UJJWAL UPADHYAY",customer:"Akash Mittal",contact:"Akash Mittal",mobile:"7415388948",remarks:"Asked for approximate price",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
  {date:"2026-01-10",uqn:"CS/ERGYT/2026/2917",source:"Google Adwords",user:"SACHIN KUMAR 2",customer:"Jagdamba Enterprises",contact:"Sunil Kumar Agarwal",mobile:"+91-9784088462",remarks:"Need Color Sorter for Groundnuts",state:"RAJASTHAN",leadType:"COLOR SORTER",stage:"Quotation Send"},
  {date:"2026-01-29",uqn:"CS/DEMORM0002/2976",source:"By Meeting",user:"RAHUL MAHANT",customer:"Vardhman Dall Mill",contact:"Rahul Jain",mobile:"9893480631",remarks:"Planning 6 chute sortex",state:"MADHYA PRADESH",leadType:"COLOR SORTER",stage:"Hot Lead"},
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
const norm = v => String(v||"").trim().toUpperCase();
function fmt(n){if(!n)return"₹0";if(n>=1e7)return`₹${(n/1e7).toFixed(2)} Cr`;if(n>=1e5)return`₹${(n/1e5).toFixed(1)} L`;if(n>=1e3)return`₹${(n/1e3).toFixed(0)}K`;return`₹${n}`;}
function fmtDate(d){if(!d)return"";const dt=new Date(d);if(isNaN(dt))return d;return dt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});}
function toISO(d){if(!d)return"";const dt=new Date(d);if(isNaN(dt))return"";return dt.toISOString().slice(0,10);}
function inRange(d,from,to){if(!from&&!to)return true;const iso=toISO(d);if(!iso)return true;if(from&&iso<from)return false;if(to&&iso>to)return false;return true;}

/* ─── GLOBAL CSS ──────────────────────────────────────────────────────── */
const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1a1a2e; font-family: 'Nunito', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0f3460; }
  ::-webkit-scrollbar-thumb { background: #00d4ff; border-radius: 4px; }
  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
  @keyframes spinAnim { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
  @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.5;} }
  .kpi { animation: fadeUp 0.4s ease both; }
  .kpi:hover { transform: translateY(-3px) scale(1.01); transition: all 0.2s; }
  .pill:hover { filter: brightness(1.2); transform: translateY(-1px); }
  .tab-btn:hover { filter: brightness(1.15); }
  .trow:hover { background: rgba(0,212,255,0.08) !important; }
  .spin { animation: spinAnim 1s linear infinite; display:inline-block; }
`;

/* ─── KPI CARD — bold gradient style ─────────────────────────────────── */
function KpiCard({ label, value, sub, color, bg, icon, delay=0 }) {
  return (
    <div className="kpi" style={{
      animationDelay:`${delay}ms`,
      flex:1, minWidth:155,
      background: bg || `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
      border:`2px solid ${color}`,
      borderRadius:16,
      padding:"18px 20px 14px",
      position:"relative", overflow:"hidden",
      boxShadow:`0 0 20px ${color}44, 0 8px 24px rgba(0,0,0,0.4)`,
      cursor:"default",
    }}>
      <div style={{position:"absolute",top:-10,right:-10,fontSize:56,opacity:0.12,lineHeight:1,userSelect:"none"}}>{icon}</div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
      <div style={{fontSize:9,color:color,letterSpacing:"0.2em",fontWeight:800,textTransform:"uppercase",marginBottom:8,opacity:0.9}}>
        {label}
      </div>
      <div style={{
        fontSize: String(value).includes("Cr") ? 26 : 42,
        fontWeight:900, color:"#ffffff",
        lineHeight:1, marginBottom:6,
        textShadow:`0 0 20px ${color}`,
        fontFamily:"'Nunito',sans-serif",
      }}>{value}</div>
      {sub && <div style={{fontSize:10,color:C.sub,fontWeight:600}}>{sub}</div>}
    </div>
  );
}

/* ─── CHART CARD ──────────────────────────────────────────────────────── */
function ChartCard({ title, color="#00d4ff", children }) {
  return (
    <div style={{
      background:`linear-gradient(135deg, #0f3460 0%, #16213e 100%)`,
      border:`1px solid ${color}55`,
      borderTop:`3px solid ${color}`,
      borderRadius:14, padding:"14px 16px",
      boxShadow:`0 4px 20px rgba(0,0,0,0.5), 0 0 10px ${color}15`,
    }}>
      <div style={{fontSize:11,fontWeight:800,color,textTransform:"uppercase",
        letterSpacing:"0.15em",marginBottom:12,
        display:"flex",alignItems:"center",gap:6}}>
        <span style={{width:3,height:14,background:color,borderRadius:2,display:"inline-block",boxShadow:`0 0 6px ${color}`}}/>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── TOOLTIP ─────────────────────────────────────────────────────────── */
const ttp = {
  contentStyle:{background:"#0f3460",border:"1px solid #00d4ff55",borderRadius:8,
    color:"#fff",fontSize:11,fontFamily:"'Nunito',sans-serif",boxShadow:"0 8px 24px rgba(0,0,0,0.7)"},
  labelStyle:{color:"#ffd700",fontWeight:800},
  cursor:{fill:"rgba(0,212,255,0.08)"},
};

/* ─── PILL ────────────────────────────────────────────────────────────── */
function Pill({ label, active, onClick, color }) {
  return (
    <button className="pill" onClick={onClick} style={{
      padding:"3px 12px", borderRadius:20,
      border:`1px solid ${active ? color : "#1e5f8a"}`,
      background: active ? color : "transparent",
      color: active ? "#000" : C.sub,
      fontSize:11, fontFamily:"'Nunito',sans-serif", fontWeight:700,
      whiteSpace:"nowrap", cursor:"pointer", transition:"all .12s",
      boxShadow: active ? `0 0 12px ${color}88` : "none",
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

  const { data:rawV, loading:lV, lastUpdated:luV, refetch:rfV } = useSheetTab(SHEET_URLS.visitors);
  const { data:rawL, loading:lL, lastUpdated:luL, refetch:rfL } = useSheetTab(SHEET_URLS.leads);
  const { data:rawS, loading:lS, lastUpdated:luS, refetch:rfS } = useSheetTab(SHEET_URLS.sales);

  const refetchAll  = useCallback(()=>{rfV();rfL();rfS();},[rfV,rfL,rfS]);
  const loading     = lV||lL||lS;
  const lastUpdated = luV||luL||luS;

  const VISITORS = useMemo(()=>rawV.length>0?transformVisitors(rawV):STATIC_VISITORS,[rawV]);
  const LEADS    = useMemo(()=>rawL.length>0?transformLeads(rawL):STATIC_LEADS,[rawL]);
  const SALES    = useMemo(()=>rawS.length>0?transformSales(rawS):STATIC_SALES,[rawS]);

  const ACTIVITY = useMemo(()=>[
    ...VISITORS.map(r=>({...r,_src:"Visit"})),
    ...LEADS.map(r=>({...r,_src:"Lead"})),
  ].sort((a,b)=>new Date(b.date)-new Date(a.date)),[VISITORS,LEADS]);

  const masterUsers  = useMemo(()=>{const s=new Set();[...VISITORS,...LEADS,...SALES].forEach(r=>r.user&&s.add(r.user));return["All",...Array.from(s).sort()];},[VISITORS,LEADS,SALES]);
  const masterTypes  = useMemo(()=>{const s=new Set();[...VISITORS,...LEADS,...SALES].forEach(r=>r.leadType&&s.add(r.leadType));return["All",...Array.from(s).sort()];},[VISITORS,LEADS,SALES]);
  const masterStates = useMemo(()=>{const s=new Set();[...VISITORS,...LEADS,...SALES].forEach(r=>r.state&&s.add(r.state));return["All",...Array.from(s).sort()];},[VISITORS,LEADS,SALES]);

  const filterRow = useCallback(r=>
    (selUser==="All"||r.user===selUser)&&
    (selType==="All"||r.leadType===selType)&&
    (selState==="All"||r.state===selState)&&
    inRange(r.date,dateFrom,dateTo),
  [selUser,selType,selState,dateFrom,dateTo]);

  const fV=useMemo(()=>VISITORS.filter(filterRow),[VISITORS,filterRow]);
  const fL=useMemo(()=>LEADS.filter(filterRow),[LEADS,filterRow]);
  const fS=useMemo(()=>SALES.filter(filterRow),[SALES,filterRow]);
  const fA=useMemo(()=>ACTIVITY.filter(filterRow),[ACTIVITY,filterRow]);

  const totalRev = useMemo(()=>fS.reduce((s,r)=>s+(r.amount||0),0),[fS]);
  const quotSent = useMemo(()=>fL.filter(r=>r.stage==="Quotation Send"||r.stage==="Hot Lead").length,[fL]);
  const hotLeads = useMemo(()=>fL.filter(r=>r.stage==="Hot Lead").length,[fL]);

  function grp(arr,key,top=10){const m={};arr.forEach(r=>{if(r[key])m[r[key]]=(m[r[key]]||0)+1;});return Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,top);}
  function grpAmt(arr,key,top=8){const m={};arr.forEach(r=>{if(r[key])m[r[key]]=(m[r[key]]||0)+(r.amount||0);});return Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,top);}

  const sourceData    = useMemo(()=>grp(fL,"source",8),[fL]);
  const stageData     = useMemo(()=>[
    {name:"New",       value:fL.filter(r=>r.stage==="New").length,            color:"#00d4ff"},
    {name:"Follow up", value:fL.filter(r=>r.stage==="Follow up").length,      color:"#ce93d8"},
    {name:"Hot Lead",  value:fL.filter(r=>r.stage==="Hot Lead").length,       color:"#ff9800"},
    {name:"Quot. Send",value:fL.filter(r=>r.stage==="Quotation Send").length, color:"#ffd700"},
    {name:"Pending",   value:fL.filter(r=>r.stage==="Pending").length,        color:"#ff5252"},
  ].filter(d=>d.value>0),[fL]);
  const userSalesRev  = useMemo(()=>grpAmt(fS,"user"),[fS]);
  const userSalesCnt  = useMemo(()=>grp(fS,"user"),[fS]);
  const typeSalesCnt  = useMemo(()=>grp(fS,"leadType"),[fS]);
  const stateSalesRev = useMemo(()=>grpAmt(fS,"state"),[fS]);
  const stateSalesCnt = useMemo(()=>grp(fS,"state"),[fS]);
  const compData      = useMemo(()=>grp(fV,"competitors",8),[fV]);
  const visUserData   = useMemo(()=>grp(fV,"user",8),[fV]);

  const anyFilter = selUser!=="All"||selType!=="All"||selState!=="All"||dateFrom||dateTo;

  const TABS=[
    {id:"overview",label:"Overview",icon:"◈"},
    {id:"leads",label:"Leads",icon:"◎"},
    {id:"sales",label:"Sales",icon:"◆"},
    {id:"visitors",label:"Visitors",icon:"◉"},
    {id:"activity",label:"Activity Log",icon:"≡"},
  ];

  const dateInputSty={
    background:"#0f3460",border:"1px solid #1e5f8a",borderRadius:8,
    color:"#fff",padding:"5px 10px",fontSize:11,fontFamily:"'Nunito',sans-serif",
    outline:"none",cursor:"pointer",colorScheme:"dark",
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Nunito',sans-serif"}}>
      <style>{GCSS}</style>

      {/* ══ HEADER ════════════════════════════════════════════════════ */}
      <header style={{
        background:`linear-gradient(135deg, #0f3460 0%, #16213e 100%)`,
        borderBottom:"2px solid #00d4ff44",
        padding:"0 20px", height:60,
        display:"flex", alignItems:"center", gap:12,
        position:"sticky", top:0, zIndex:200,
        boxShadow:"0 4px 20px rgba(0,0,0,0.6), 0 1px 0 rgba(0,212,255,0.2)",
      }}>
        {/* LOGO */}
        <img
          src={LOGO_URL}
          alt="NICPL"
          style={{height:46,width:46,objectFit:"contain",borderRadius:8,background:"#000",flexShrink:0}}
          onError={e=>{e.target.style.display="none";}}
        />

        <div style={{borderLeft:"1px solid #1e5f8a",paddingLeft:12}}>
          <div style={{fontWeight:900,fontSize:18,color:"#fff",lineHeight:1,letterSpacing:"0.02em"}}>
            North India Compressors
          </div>
          <div style={{fontSize:9,color:C.cyan,letterSpacing:"0.2em",marginTop:2,fontWeight:700}}>
            SALES INTELLIGENCE DASHBOARD · JAN–FEB 2026
          </div>
        </div>

        <div style={{flex:1}}/>

        <div style={{display:"flex",alignItems:"center",gap:10,fontSize:11}}>
          {loading
            ? <span style={{color:C.amber,display:"flex",alignItems:"center",gap:6}}><span className="spin">⟳</span> SYNCING…</span>
            : <span style={{color:C.green,fontWeight:700}}>✓ LIVE · {lastUpdated?.toLocaleTimeString()||"—"}</span>
          }
          <button onClick={refetchAll} style={{
            background:`linear-gradient(135deg,#00d4ff,#0099cc)`,
            border:"none",color:"#000",borderRadius:8,
            padding:"5px 16px",cursor:"pointer",fontSize:11,
            fontFamily:"'Nunito',sans-serif",fontWeight:800,letterSpacing:"0.06em",
            boxShadow:"0 0 12px #00d4ff66",
          }}>↺ REFRESH</button>
        </div>

        <div style={{display:"flex",gap:4}}>
          {TABS.map(({id,label,icon})=>(
            <button key={id} className="tab-btn" onClick={()=>setActiveTab(id)} style={{
              background: activeTab===id ? `linear-gradient(135deg,#00d4ff,#0099cc)` : "transparent",
              border:`1px solid ${activeTab===id?"#00d4ff":"#1e5f8a"}`,
              color: activeTab===id ? "#000" : C.sub,
              borderRadius:9, padding:"5px 14px", cursor:"pointer",
              fontSize:11, fontFamily:"'Nunito',sans-serif", fontWeight:700,
              letterSpacing:"0.04em", transition:"all .15s",
              boxShadow: activeTab===id ? "0 0 12px #00d4ff55" : "none",
            }}>{icon} {label}</button>
          ))}
        </div>
      </header>

      {/* ══ FILTER BAR ════════════════════════════════════════════════ */}
      <div style={{
        background:`linear-gradient(180deg,#16213e,#1a1a2e)`,
        borderBottom:"1px solid #1e5f8a",
        padding:"8px 20px",
        display:"flex",flexDirection:"column",gap:7,
      }}>
        {/* Date */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:800,letterSpacing:"0.2em",minWidth:42}}>DATE</span>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={dateInputSty}/>
          <span style={{color:"#1e5f8a",fontSize:12}}>→</span>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={dateInputSty}/>
          {(dateFrom||dateTo)&&(
            <button onClick={()=>{setDateFrom("");setDateTo("");}} style={{
              background:"#ff525222",border:"1px solid #ff5252",color:"#ff5252",
              borderRadius:6,padding:"3px 10px",fontSize:10,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,
            }}>✕</button>
          )}
          {dateFrom&&dateTo&&<span style={{fontSize:10,color:C.sub,fontWeight:600}}>{fmtDate(dateFrom)} → {fmtDate(dateTo)}</span>}
        </div>

        {/* USER */}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:800,letterSpacing:"0.2em",minWidth:42}}>USER</span>
          {masterUsers.map(v=><Pill key={v} label={v==="All"?"ALL":v} active={selUser===v} color={C.cyan} onClick={()=>setSelUser(v)}/>)}
        </div>

        {/* TYPE */}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:800,letterSpacing:"0.2em",minWidth:42}}>TYPE</span>
          {masterTypes.map(v=><Pill key={v} label={v==="All"?"ALL":(v.length>13?v.slice(0,13)+"…":v)} active={selType===v} color={C.violet} onClick={()=>setSelType(v)}/>)}
        </div>

        {/* STATE */}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.gold,fontWeight:800,letterSpacing:"0.2em",minWidth:42}}>STATE</span>
          {masterStates.map(v=><Pill key={v} label={v==="All"?"ALL":(v.length>12?v.slice(0,12)+"…":v)} active={selState===v} color={C.green} onClick={()=>setSelState(v)}/>)}
          {anyFilter&&(
            <button onClick={()=>{setSelUser("All");setSelType("All");setSelState("All");setDateFrom("");setDateTo("");}} style={{
              padding:"3px 14px",borderRadius:20,border:"1px solid #ff5252",
              background:"#ff525222",color:"#ff5252",fontSize:11,cursor:"pointer",
              fontFamily:"'Nunito',sans-serif",fontWeight:800,marginLeft:8,
            }}>✕ RESET ALL</button>
          )}
        </div>
      </div>

      <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:16}}>

        {/* ══ KPI CARDS ══════════════════════════════════════════════ */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <KpiCard label="Total Visitors"  value={fV.length}     color={C.cyan}   icon="👥" sub="customer visits"            delay={0}/>
          <KpiCard label="Total Leads"     value={fL.length}     color={C.violet} icon="🎯" sub={`${hotLeads} hot leads`}   delay={60}/>
          <KpiCard label="Total Sales"     value={fS.length}     color={C.green}  icon="✅" sub="orders confirmed"          delay={120}/>
          <KpiCard label="Quotations Sent" value={quotSent}      color={C.amber}  icon="📄" sub="Hot Lead + Quot. Send"     delay={180}/>
          <KpiCard label="Total Revenue"   value={fmt(totalRev)} color={C.gold}   icon="💰" sub={`avg ${fmt(totalRev/(fS.length||1))}/sale`} delay={240}/>
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════ */}
        {activeTab==="overview"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>

            <ChartCard title="Lead Source — Count" color={C.cyan}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={sourceData} margin={{top:4,right:4,left:-20,bottom:40}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9}} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {sourceData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Pipeline" color={C.amber}>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={75} innerRadius={32}
                    paddingAngle={3} stroke="none"
                    label={({name,value})=>`${name}: ${value}`} labelLine={false}>
                    {stageData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip {...ttp}/>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="State Sales — Revenue" color={C.green}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={stateSalesRev} layout="vertical" margin={{top:4,right:50,left:88,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#fff",fontSize:10,fontWeight:600}} width={85}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {stateSalesRev.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales — Revenue" color={C.violet}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={userSalesRev} layout="vertical" margin={{top:4,right:50,left:120,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#fff",fontSize:10,fontWeight:600}} width={118}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {userSalesRev.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Sales — Count" color={C.cyan}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={userSalesCnt} layout="vertical" margin={{top:4,right:30,left:120,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#fff",fontSize:10,fontWeight:600}} width={118}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:11,fontWeight:700}}>
                    {userSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Type Sales — Count" color={C.orange}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={typeSalesCnt} layout="vertical" margin={{top:4,right:30,left:110,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#fff",fontSize:10,fontWeight:600}} width={108}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:11,fontWeight:700}}>
                    {typeSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Competitors (Visit)" color={C.rose}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={compData} margin={{top:4,right:4,left:-20,bottom:48}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9}} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {compData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Visitors by User" color={C.teal}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={visUserData} margin={{top:4,right:4,left:-20,bottom:48}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9}} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {visUserData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="State Sales — Count" color={C.lime}>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={stateSalesCnt} layout="vertical" margin={{top:4,right:30,left:88,bottom:4}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1e5f8a" horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#fff",fontSize:10,fontWeight:600}} width={85}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:11,fontWeight:700}}>
                    {stateSalesCnt.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        )}

        {activeTab==="leads"&&<DataTable rows={fL} cols={["date","source","user","customer","contact","mobile","state","leadType","stage","remarks"]} headers={["Date","Source","User","Customer Name","Contact","Mobile","State","Lead Type","Stage","Remarks"]} title="Lead Records" color={C.violet} stageCol="stage" fmtCol={{date:fmtDate}}/>}
        {activeTab==="sales"&&<DataTable rows={fS} cols={["date","customer","user","leadType","amount","state","products"]} headers={["Date","Customer","User","Lead Type","PO Amount","State","Products"]} title="Sales Records" color={C.green} amountCol="amount" fmtCol={{date:fmtDate,amount:fmt}}/>}
        {activeTab==="visitors"&&<DataTable rows={fV} cols={["date","leadType","user","customer","contact","state","city","competitors","remarks"]} headers={["Date","Lead Type","User","Customer Name","Contact","State","City","Competitor","Remarks"]} title="Visitor Records" color={C.cyan} fmtCol={{date:fmtDate}}/>}
        {activeTab==="activity"&&<DataTable rows={fA} cols={["date","_src","leadType","user","customer","contact","state","stage","remarks"]} headers={["Date","Type","Lead Type","User","Customer Name","Contact","State","Stage","Remarks"]} title="Combined Activity Log" color={C.gold} stageCol="stage" srcCol="_src" fmtCol={{date:fmtDate}}/>}

      </div>
      <footer style={{textAlign:"center",padding:"12px",borderTop:"1px solid #1e5f8a",color:C.dim,fontSize:10,letterSpacing:"0.12em"}}>
        NORTH INDIA COMPRESSORS PVT LTD © 2026
      </footer>
    </div>
  );
}

/* ─── DATA TABLE ──────────────────────────────────────────────────────── */
function DataTable({rows,cols,headers,title,color,stageCol,amountCol,srcCol,fmtCol={}}) {
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(0);
  const [sortCol,setSortCol]=useState("date");
  const [sortDir,setSortDir]=useState("desc");
  const PER=20;

  const sorted=useMemo(()=>{
    const a=[...rows];
    a.sort((x,y)=>{
      let av=x[sortCol]??"",bv=y[sortCol]??"";
      if(sortCol==="date"){av=new Date(av);bv=new Date(bv);}
      if(sortCol==="amount"){av=Number(av);bv=Number(bv);}
      if(av<bv)return sortDir==="asc"?-1:1;
      if(av>bv)return sortDir==="asc"?1:-1;
      return 0;
    });
    return a;
  },[rows,sortCol,sortDir]);

  const filtered=useMemo(()=>{
    if(!search)return sorted;
    const q=search.toLowerCase();
    return sorted.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(q)));
  },[sorted,search]);

  const paged=filtered.slice(page*PER,(page+1)*PER);
  const pages=Math.ceil(filtered.length/PER);

  const SC2={New:"#00d4ff","Hot Lead":"#ff9800","Quotation Send":"#ffd700","Follow up":"#ce93d8","Pending":"#ff5252"};

  function cs(col,val){
    if(col===amountCol)return{color:C.green,fontWeight:700};
    if(col===stageCol)return{color:SC2[val]||C.text,fontWeight:700};
    if(col===srcCol)return{color:val==="Lead"?C.violet:C.cyan,fontWeight:700};
    if(col==="date")return{color:C.sub,whiteSpace:"nowrap"};
    if(col==="user")return{color:C.gold,fontWeight:700};
    return{};
  }

  return (
    <div style={{background:"linear-gradient(135deg,#0f3460,#16213e)",border:`1px solid ${color}44`,borderTop:`3px solid ${color}`,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{fontSize:11,fontWeight:800,color,textTransform:"uppercase",letterSpacing:"0.14em",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:3,height:14,background:color,borderRadius:2,display:"inline-block",boxShadow:`0 0 6px ${color}`}}/>
          {title} <span style={{color:C.dim,fontWeight:600}}>({filtered.length})</span>
        </div>
        <div style={{flex:1}}/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="🔍 Search…"
          style={{background:"#1a1a2e",border:"1px solid #1e5f8a",borderRadius:8,color:"#fff",padding:"6px 14px",fontSize:11,fontFamily:"'Nunito',sans-serif",outline:"none",width:220}}/>
      </div>
      <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #1e5f8a"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#0a2545"}}>
              {(headers||cols).map((h,i)=>(
                <th key={i} onClick={()=>{if(sortCol===cols[i])setSortDir(d=>d==="asc"?"desc":"asc");else{setSortCol(cols[i]);setSortDir("desc");}}} style={{
                  padding:"10px 14px",textAlign:"left",fontWeight:800,
                  borderBottom:`1px solid ${color}44`,color,
                  fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",
                  whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",
                  fontFamily:"'Nunito',sans-serif",
                }}>
                  {h} {sortCol===cols[i]?(sortDir==="asc"?"↑":"↓"):<span style={{opacity:0.3}}>↕</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row,i)=>(
              <tr key={i} className="trow" style={{borderBottom:"1px solid rgba(30,95,138,0.3)",background:i%2===0?"transparent":"rgba(15,52,96,0.3)"}}>
                {cols.map(col=>(
                  <td key={col} style={{padding:"9px 14px",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap",maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",...cs(col,row[col])}}>
                    {fmtCol[col]?fmtCol[col](row[col]):String(row[col]??"")}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length===0&&<tr><td colSpan={cols.length} style={{padding:24,color:C.dim,textAlign:"center",fontSize:12,letterSpacing:"0.1em"}}>No records found</td></tr>}
          </tbody>
        </table>
      </div>
      {pages>1&&(
        <div style={{display:"flex",gap:8,justifyContent:"center",alignItems:"center"}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{background:"none",border:"1px solid #1e5f8a",color:C.sub,borderRadius:8,padding:"4px 16px",cursor:"pointer",fontSize:11,fontFamily:"'Nunito',sans-serif",fontWeight:700}}>← Prev</button>
          <span style={{color:C.gold,fontSize:13,fontWeight:800}}>Page {page+1} of {pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1} style={{background:"none",border:"1px solid #1e5f8a",color:C.sub,borderRadius:8,padding:"4px 16px",cursor:"pointer",fontSize:11,fontFamily:"'Nunito',sans-serif",fontWeight:700}}>Next →</button>
        </div>
      )}
    </div>
  );
}
