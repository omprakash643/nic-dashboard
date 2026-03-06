import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useSheetTab, transformVisitors, transformLeads, transformSales } from "./useSheetData";

/* ══════════════════════════════════════════════════════════════════
   GOOGLE SHEETS CONFIG
   ══════════════════════════════════════════════════════════════════
   HOW TO SET UP:
   1. Open your Google Sheet
   2. Go to File → Share → Publish to web
   3. For each tab: select the tab name, choose "Comma-separated values (.csv)", click Publish
   4. Copy the URL and paste it below for each sheet tab

   Example URL format:
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?gid=SHEET_GID&single=true&output=csv
   ══════════════════════════════════════════════════════════════════ */

const SHEET_URLS = {
  visitors: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=0&single=true&output=csv",
  leads:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=2066525621&single=true&output=csv",
  sales:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJKBgkAtx6Fm5B4-mbaWwJ8lTdMMgsYo2zuXM9rEmoIQ_AlEqd6GudLDaIoAViA5OE1ppjqmujNOAj/pub?gid=23552387&single=true&output=csv",
};

/* ── FALLBACK STATIC DATA (used when sheets not configured) ───────
   Your existing hardcoded data stays here as fallback so dashboard
   always shows something even before sheets are connected.
   ─────────────────────────────────────────────────────────────── */
const STATIC_VISITORS = [
  {"date": "2026-01-12", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "sp pulses", "contact": "tikam sharma", "state": "Rajasthan", "city": "ajmer", "existing": "No", "remarks": "Sortex on moong mogar 10 chute, waiting for the order of hem industries"},
  {"date": "2026-01-12", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Hem industries", "contact": "Rishabh", "state": "Rajasthan", "city": "ajmer", "existing": "No", "remarks": "Sortex on moong mogar, 8 chute order finalised after 14th Jan"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "hem industries", "contact": "rishabh", "state": "Rajasthan", "city": "Ajmer", "existing": "No", "remarks": "Sortex on Moong mogar, Final price given, customer is at gulf expo dubai"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Chetak roller flour mill", "contact": "Nitesh khokhar", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Chaudhary flour mill pvt ltd", "contact": "Vinod Gupta", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Hindusthan rice mill", "contact": "Binod ji", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Amar Rice mill", "contact": "Amar jaiswal", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "SAI KIRPA STEEL INDUSTRY", "contact": "RAKESH KUMAR JI", "state": "Delhi", "city": "BAWANA", "existing": "compititor", "remarks": "AS DISCUSSED WITH CUSTOMER THE REQUIR COMPRESSOR IN NEXT 6 MONTHS"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Vardhan industries", "contact": "Aman jain", "state": "Madhya Pradesh", "city": "Begamganj", "existing": "Milltech", "remarks": "Plant has been shutdown due loss in business"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Shree balaji food industriese", "contact": "Kamlesh Gupta", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-10", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Shree shyam industry", "contact": "Pardeep kasniya", "state": "Haryana", "city": "Fathebad", "existing": "Competitor", "remarks": "Meeting with MD Peanut colour sorter Requirement this month"},
  {"date": "2026-01-01", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Agrawal Bandhu", "contact": "Sahil Agrawal", "state": "Madhya Pradesh", "city": "Indore", "existing": "No", "remarks": "8 chute DLT on chana dal"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Banshidhar kailashchandra mehta", "contact": "Mr ronak", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "Interested"},
  {"date": "2026-01-02", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "R.m overseas", "contact": "Manoj jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD"},
  {"date": "2026-01-03", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahashakti foods pvt ltd", "contact": "Aakash jalan", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "13 Chute color sorter enquiry"},
];

const STATIC_LEADS = [
  {"date": "2026-01-15", "uqn": "KC/NICPL0G000/2026/2930", "source": "By Meeting", "user": "Govind", "customer": "M/s JITENDRA COTTEX", "contact": "Mr .Sachin jaglan", "mobile": "M: +91-9112000063", "remarks": "Need- 30hp Compressor", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-15", "uqn": "M001/NICPL0S001/2026/2929", "source": "Calling", "user": "Shivgatulla", "customer": "Sudipta hati", "contact": "Sudipta hati", "mobile": "M: 8293916079", "remarks": "Quotation send and he is finalized in Last week of January month", "state": "West Bengal", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-15", "uqn": "CS/ERGYT/2026/2927", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "GDP AGRO AND FOOD PRODUCTS PRIVATE LIMITED", "contact": "Mr. Dharam Aggarwal Ji", "mobile": "M: +91-9827259553", "remarks": "Using Kaeser Air Compressor and Devan Color Sorter, Now Need Meyer Color Sorter for Peanuts", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-14", "uqn": "CS/MU/2026/2926", "source": "By Meeting", "user": "Murli dar sukla", "customer": "JAY AMBEY PULSES", "contact": "Sipoliya ji", "mobile": "M: +91-7355020465", "remarks": "he want to purchase 8 chute meyer color sorter.", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-13", "uqn": "CS/NICUU001/2026/2920", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Mr akash mittal", "contact": "Mr akash mittal", "mobile": "M: 7415388948", "remarks": "he told me that you tell me the approximate price", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-10", "uqn": "CS/ERGYT/2026/2917", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "JAGDAMBA ENTERPRISES", "contact": "Mr. Sunil Kumar Agarwal", "mobile": "M: +91-9784088462", "remarks": "Need Color Sorter For Groundnuts", "state": "Rajasthan", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-03", "uqn": "CS/NICUU001/2026/2898", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Kanchan Agro", "contact": "Mr. Sanjay Jain", "mobile": "M: 7000460506", "remarks": "quotation send", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-29", "uqn": "CS/DEMORM0002/2026/2976", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Vardhman dall milll", "contact": "Rahul jain", "mobile": "M: 9893480631", "remarks": "Planning 6 chute sortex with 30 hp compressor", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-20", "uqn": "CS/DEMORM0002/2026/2941", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Dhanraj industries", "contact": "Gaurav rajpal", "mobile": "M: +91-9329419700", "remarks": "Busy on another call", "state": "Rajasthan", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-02", "uqn": "CS/NICP0A0010/2026/2894", "source": "By Meeting", "user": "Arvind Kumar", "customer": "Anand Foods", "contact": "Owner", "mobile": "M: +91-9557511111", "remarks": "Deal under discussion", "state": "Chhattisgarh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-28", "uqn": "CS/NICPLR001/2026/3064", "source": "By Visit", "user": "Rahul Verma", "customer": "Palak traders", "contact": "Aman Khandelwal", "mobile": "M: +917000969542", "remarks": "CS 6 chute requirement, 15 kw KC", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-26", "uqn": "CS/NICPLR001/2026/3060", "source": "By Visit", "user": "Rahul Verma", "customer": "Jay traders", "contact": "Jay mundra", "mobile": "M: 90397 07410", "remarks": "Planing 6 chute CS for wheat", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-21", "uqn": "KC/NICPL0G007/2026/3039", "source": "By Visit", "user": "Gajendra Kumar Jha", "customer": "Loom Solar Pvt.Ltd.", "contact": "Mr.Aman Gupta", "mobile": "M: +91-7895657847", "remarks": "Visit Plan After Holi dated:06-03-26", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-02-19", "uqn": "KC/02021/2026/3029", "source": "By Visit", "user": "Jaipal", "customer": "Shakti vardhak seed", "contact": "krishan sharma ji", "mobile": "M: +91-7082005586", "remarks": "on 25th we have sent revised quotation (8% Discount)", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-13", "uqn": "CS/NICUU001/2026/3008", "source": "By Meeting", "user": "Ujjwal Upadhyay", "customer": "Sujay Agro Industries", "contact": "Manish Pamecha", "mobile": "M: +91-9301705009", "remarks": "He told me that the sortex is not finalized yet", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-09", "uqn": "CS/MU/2026/2994", "source": "By Meeting", "user": "Murli dar sukla", "customer": "SS enterprises", "contact": "KAMAL JAIN", "mobile": "M: +91-9111234572", "remarks": "he will finalize thinker model 8 chute", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
];

const STATIC_SALES = [
  {"date": "2026-01-01", "customer": "HINDUSTHAN AGRI SEEDS PVT LTD", "user": "Murli dar sukla", "leadType": "MCS with KAESER Compressor", "amount": 3500000.0, "state": "West Bengal"},
  {"date": "2026-01-01", "customer": "Bankura agro processing Pvt.ltd", "user": "Murli dar sukla", "leadType": "MCS+MRC", "amount": 3751000.0, "state": "West Bengal"},
  {"date": "2026-01-06", "customer": "Shree Radha Laxmi Industries", "user": "Arvind Kumar", "leadType": "Grain Dryer", "amount": 6232594.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-06", "customer": "Singhai & singhai", "user": "RAHUL SIR", "leadType": "COLOR SORTER", "amount": 5200000.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-07", "customer": "Prashant maheshwari", "user": "Rahul Mahant", "leadType": "MCS+MRC", "amount": 3121000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-10", "customer": "AGRAWAL BANDHU AGRO TECH PVT.LTD.", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 3200000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-12", "customer": "Dhirendra International pvt ltd", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 4500000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-12", "customer": "RAJAT AGRO LLP (Gujarat)", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 4100000.0, "state": "Gujarat"},
  {"date": "2026-01-14", "customer": "Shree Balaji Export", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3750000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-14", "customer": "M.M PULSES", "user": "Murli dar sukla", "leadType": "AIR DRYER", "amount": 4550000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-15", "customer": "Shree Giriraj Enterprises", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 2000000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-15", "customer": "HOTWANI FOOD INGREDIENTS PRIVATE LIMITED", "user": "Ashwin Garg", "leadType": "MCS+MRC", "amount": 2470000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-18", "customer": "RAM MOHAN GUPTA GALLA VYAPARI", "user": "Murli dar sukla", "leadType": "MCS+MRC", "amount": 4450000.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-18", "customer": "SHRI MAHAKAL INDUSTRIES", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 4576271.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-29", "customer": "GOYAL AND CO NEEMACH", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3200000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-30", "customer": "R.B. Agro Milling Pvt. Ltd.", "user": "Mahesh Chandra", "leadType": "COLOR SORTER", "amount": 3450000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-31", "customer": "vijay floor mill", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 3850000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-31", "customer": "DIPALI ENTERPRISE", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 2600000.0, "state": "West Bengal"},
  {"date": "2026-02-05", "customer": "SHREE RAM INDUSTRIES", "user": "Ujjwal Upadhyay", "leadType": "COLOR SORTER", "amount": 1250000.0, "state": "Rajasthan"},
  {"date": "2026-02-09", "customer": "RATANLAL RAMNIWAS AND COMPANY", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3275000.0, "state": "Madhya Pradesh"},
  {"date": "2026-02-13", "customer": "M/S. PANKAJKUMAR NIRAJ KUMAR", "user": "Ujjwal Upadhyay", "leadType": "COLOR SORTER", "amount": 2625000.0, "state": "Rajasthan"},
  {"date": "2026-02-13", "customer": "Shri Adinath Cashew Private Limited", "user": "RAHUL SIR", "leadType": "COLOR SORTER", "amount": 3759900.0, "state": "Madhya Pradesh"},
  {"date": "2026-02-13", "customer": "GOYAL AND CO NEEMACH", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3150000.0, "state": "Madhya Pradesh"},
];

/* ── THEME ────────────────────────────────────────────────────────────────── */
const C = {
  bg: "#060d1a", surface: "#0c1628", card: "#0f1e35", cardHi: "#152540",
  border: "#1e3a5f", borderHi: "#2a5080", gold: "#f0b429", goldDim: "#c8941a",
  cyan: "#00cfff", green: "#00e68a", rose: "#ff5075", violet: "#b57bff",
  orange: "#ff8c42", text: "#e8f2ff", sub: "#8ab0d0", dim: "#3a5878",
};
const PALETTE = ["#00cfff","#00e68a","#f0b429","#ff5075","#b57bff","#ff8c42","#4dffdb","#ff6b9d"];
const USERS      = ["All","Ashwin Garg","Murli dar sukla","Arvind Kumar","Rahul Mahant","RAHUL SIR","Govind","Ujjwal Upadhyay","Mahesh Chandra"];
const LEAD_TYPES = ["All","COLOR SORTER","MCS+MRC","Grain Dryer","Kaeser AIR COMPRESSOR","AIR DRYER","MCS with KAESER Compressor"];
const STATES_LIST = ["All","Madhya Pradesh","Uttar Pradesh","West Bengal","Rajasthan","Gujarat","Haryana","Bihar","Delhi"];

function fmt(n) {
  if (n >= 1e7) return `₹${(n/1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n/1e5).toFixed(1)} L`;
  if (n >= 1e3) return `₹${(n/1e3).toFixed(0)}K`;
  return `₹${n}`;
}

/* ── SMALL UI ─────────────────────────────────────────────────────────────── */
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
    <div style={{fontSize:10,color:C.sub,textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}>{label}</div>
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

/* ── SYNC STATUS BADGE ────────────────────────────────────────────────────── */
const SyncBadge = ({ loading, error, lastUpdated, onRefresh, isLive }) => {
  if (!isLive) return (
    <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.dim,fontFamily:"'IBM Plex Mono',monospace"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:C.dim,display:"inline-block"}}/>
      STATIC DATA
    </div>
  );
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:10,fontFamily:"'IBM Plex Mono',monospace"}}>
      {loading && <span style={{color:C.cyan,animation:"pulse 1s infinite"}}>⟳ SYNCING…</span>}
      {error   && <span style={{color:C.rose}}>⚠ {error}</span>}
      {!loading && !error && lastUpdated && (
        <span style={{color:C.green}}>
          ✓ LIVE · {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      <button onClick={onRefresh} style={{
        background:"none",border:`1px solid ${C.border}`,borderRadius:6,
        color:C.sub,padding:"2px 8px",cursor:"pointer",fontSize:10,
        fontFamily:"'IBM Plex Mono',monospace",
      }}>↺ Refresh</button>
    </div>
  );
};

/* ── SETUP GUIDE MODAL ────────────────────────────────────────────────────── */
const SetupGuide = ({ onClose }) => (
  <div style={{
    position:"fixed",inset:0,background:"#00000088",zIndex:200,
    display:"flex",alignItems:"center",justifyContent:"center",padding:24,
  }} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{
      background:C.surface,border:`1px solid ${C.gold}`,borderRadius:16,
      padding:28,maxWidth:600,width:"100%",fontFamily:"'IBM Plex Mono',monospace",
    }}>
      <div style={{fontSize:16,fontWeight:800,color:C.gold,marginBottom:16,fontFamily:"'Syne',sans-serif"}}>
        🔗 Connect Google Sheets — Step by Step
      </div>
      {[
        ["Step 1", "Open your Google Sheet with Visitors, Leads, Sales data"],
        ["Step 2", "Go to File → Share → Publish to web"],
        ["Step 3", "For each tab (Visitors / Leads / Sales): select the tab name → choose CSV → click Publish → copy the URL"],
        ["Step 4", "In your project folder, create a file called .env"],
        ["Step 5", "Paste these lines into .env (replace the URLs):\nVITE_SHEET_VISITORS=<paste Visitors CSV URL>\nVITE_SHEET_LEADS=<paste Leads CSV URL>\nVITE_SHEET_SALES=<paste Sales CSV URL>"],
        ["Step 6", "Make sure your Google Sheet column headers match:\nVisitors: date, leadType, user, customer, contact, state, city, existing, remarks\nLeads: date, uqn, source, user, customer, contact, mobile, remarks, state, leadType, stage\nSales: date, customer, user, leadType, amount, state"],
        ["Step 7", "Run: npm run dev  — your dashboard will auto-refresh every 5 minutes!"],
      ].map(([label,text],i)=>(
        <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
          <div style={{background:`${C.gold}22`,border:`1px solid ${C.gold}44`,borderRadius:8,
            padding:"2px 10px",color:C.gold,fontSize:10,fontWeight:700,whiteSpace:"nowrap",marginTop:2}}>
            {label}
          </div>
          <div style={{color:C.text,fontSize:11,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{text}</div>
        </div>
      ))}
      <button onClick={onClose} style={{
        marginTop:8,background:`${C.gold}22`,border:`1px solid ${C.gold}`,
        borderRadius:8,color:C.gold,padding:"8px 20px",cursor:"pointer",
        fontSize:12,fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,
      }}>Got it ✓</button>
    </div>
  </div>
);

/* ── MAIN DASHBOARD ───────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [selUser,  setSelUser]  = useState("All");
  const [selType,  setSelType]  = useState("All");
  const [selState, setSelState] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");
  const [showSetup, setShowSetup] = useState(false);

  // ── Google Sheets live data ──
  const isLive = !!(SHEET_URLS.visitors || SHEET_URLS.leads || SHEET_URLS.sales);

  const {
    data: rawVisitors, loading: lV, error: eV,
    lastUpdated: luV, refetch: rfV
  } = useSheetTab(SHEET_URLS.visitors);

  const {
    data: rawLeads, loading: lL, error: eL,
    lastUpdated: luL, refetch: rfL
  } = useSheetTab(SHEET_URLS.leads);

  const {
    data: rawSales, loading: lS, error: eS,
    lastUpdated: luS, refetch: rfS
  } = useSheetTab(SHEET_URLS.sales);

  const refetchAll = useCallback(() => { rfV(); rfL(); rfS(); }, [rfV, rfL, rfS]);

  // Use live data if available, else fall back to static
  const VISITORS = useMemo(() =>
    isLive && rawVisitors.length > 0
      ? rawVisitors.map(r => ({
          date: r.date||"", leadType: r.leadType||r["Lead Type"]||"",
          user: r.user||"", customer: r.customer||"", contact: r.contact||"",
          state: r.state||"", city: r.city||"", existing: r.existing||"", remarks: r.remarks||""
        }))
      : STATIC_VISITORS,
  [isLive, rawVisitors]);

  const LEADS = useMemo(() =>
    isLive && rawLeads.length > 0
      ? rawLeads.map(r => ({
          date: r.date||"", uqn: r.uqn||"", source: r.source||"", user: r.user||"",
          customer: r.customer||"", contact: r.contact||"", mobile: r.mobile||"",
          remarks: r.remarks||"", state: r.state||"",
          leadType: r.leadType||r["Lead Type"]||"", stage: r.stage||""
        }))
      : STATIC_LEADS,
  [isLive, rawLeads]);

  const SALES_DATA = useMemo(() =>
    isLive && rawSales.length > 0
      ? rawSales.map(r => ({
          date: r.date||"", customer: r.customer||"", user: r.user||"",
          leadType: r.leadType||r["Lead Type"]||"",
          amount: parseFloat(r.amount||"0")||0, state: r.state||""
        }))
      : STATIC_SALES,
  [isLive, rawSales]);

  // ── Filters ──
  const filterRow = useCallback((row) =>
    (selUser  === "All" || row.user === selUser) &&
    (selType  === "All" || row.leadType === selType) &&
    (selState === "All" || row.state === selState),
  [selUser, selType, selState]);

  const fVisitors = useMemo(() => VISITORS.filter(filterRow),   [VISITORS, filterRow]);
  const fLeads    = useMemo(() => LEADS.filter(filterRow),      [LEADS, filterRow]);
  const fSales    = useMemo(() => SALES_DATA.filter(filterRow), [SALES_DATA, filterRow]);

  const totalRevenue = fSales.reduce((s,r) => s + r.amount, 0);
  const quotSent     = fLeads.filter(r => r.stage === "Quotation Send").length;
  const hotLeads     = fLeads.filter(r => r.stage === "Hot Lead").length;

  // ── Chart Data ──
  const sourceData = useMemo(() => {
    const m = {};
    fLeads.forEach(r => { m[r.source] = (m[r.source]||0)+1; });
    return Object.entries(m).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value);
  }, [fLeads]);

  const stageData = [
    {name:"New",        value: fLeads.filter(r=>r.stage==="New").length,             color:C.cyan},
    {name:"Follow up",  value: fLeads.filter(r=>r.stage==="Follow up").length,       color:C.violet},
    {name:"Hot Lead",   value: fLeads.filter(r=>r.stage==="Hot Lead").length,        color:C.orange},
    {name:"Quot. Send", value: fLeads.filter(r=>r.stage==="Quotation Send").length,  color:C.gold},
    {name:"Pending",    value: fLeads.filter(r=>r.stage==="Pending").length,         color:C.rose},
  ].filter(d=>d.value>0);

  const userSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { m[r.user] = (m[r.user]||0)+r.amount; });
    return Object.entries(m).map(([name,value]) => ({name: name.split(" ")[0], value}))
      .sort((a,b)=>b.value-a.value).slice(0,6);
  }, [fSales]);

  const leadTypeSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { m[r.leadType] = (m[r.leadType]||0)+r.amount; });
    return Object.entries(m).map(([name,value]) => ({
      name: name.length > 12 ? name.slice(0,12)+"…" : name, value
    })).sort((a,b)=>b.value-a.value);
  }, [fSales]);

  const stateSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { m[r.state] = (m[r.state]||0)+r.amount; });
    return Object.entries(m).map(([name,value]) => ({name,value}))
      .sort((a,b)=>b.value-a.value).slice(0,8);
  }, [fSales]);

  const userVisitorData = useMemo(() => {
    const m = {};
    fVisitors.forEach(r => { m[r.user.split(" ")[0]] = (m[r.user.split(" ")[0]]||0)+1; });
    return Object.entries(m).map(([name,value]) => ({name,value}))
      .sort((a,b)=>b.value-a.value).slice(0,6);
  }, [fVisitors]);

  const ttp = {
    contentStyle:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:11,fontFamily:"'IBM Plex Mono',monospace"},
    labelStyle:{color:C.sub},
  };

  const loading = lV || lL || lS;
  const error   = eV || eL || eS;
  const lastUpdated = luV || luL || luS;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'IBM Plex Mono',monospace",
      backgroundImage:"radial-gradient(ellipse at 20% 0%,#0a2040 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,#0a1828 0%,transparent 60%)"}}>

      {showSetup && <SetupGuide onClose={()=>setShowSetup(false)}/>}

      {/* ── HEADER ── */}
      <header style={{
        background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:"0 24px", display:"flex", alignItems:"center", gap:16, height:60,
        boxShadow:`0 2px 20px #00000044`, position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background:`linear-gradient(135deg,${C.gold},${C.orange})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, fontWeight:900, color:"#000", fontFamily:"'Syne',sans-serif",
          }}>N</div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:C.text,lineHeight:1}}>
              North India Compressors
            </div>
            <div style={{fontSize:10,color:C.gold,letterSpacing:"0.1em",marginTop:2}}>
              SALES DASHBOARD · JAN–FEB 2026
            </div>
          </div>
        </div>

        <div style={{flex:1}}/>

        {/* Sync status */}
        <SyncBadge
          loading={loading} error={error} lastUpdated={lastUpdated}
          onRefresh={refetchAll} isLive={isLive}
        />

        {/* Setup guide button */}
        <button onClick={()=>setShowSetup(true)} style={{
          background:`${C.gold}18`, border:`1px solid ${C.gold}66`,
          color:C.gold, borderRadius:8, padding:"5px 14px", cursor:"pointer",
          fontSize:10, fontFamily:"'IBM Plex Mono',monospace", fontWeight:700,
        }}>
          {isLive ? "⚙ Sheet Config" : "🔗 Connect Sheets"}
        </button>

        {/* Tabs */}
        {[["overview","Overview"],["leads","Leads"],["sales","Sales"],["visitors","Visitors"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{
            background: activeTab===id ? `${C.gold}22` : "none",
            border:`1px solid ${activeTab===id ? C.gold : C.border}`,
            color: activeTab===id ? C.gold : C.sub,
            borderRadius:8, padding:"5px 16px", cursor:"pointer",
            fontSize:11, fontFamily:"'IBM Plex Mono',monospace", fontWeight:600,
            transition:"all .15s",
          }}>{lbl}</button>
        ))}
      </header>

      {/* ── FILTERS ── */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 24px",
        display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>USER</span>
          {USERS.map(u=><FilterPill key={u} label={u==="All"?"All":u.split(" ")[0]} active={selUser===u} color={C.cyan} onClick={()=>setSelUser(u)}/>)}
        </div>
        <div style={{width:1,height:24,background:C.border}}/>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>TYPE</span>
          {LEAD_TYPES.map(t=><FilterPill key={t} label={t==="All"?"All":t.length>10?t.slice(0,10)+"…":t} active={selType===t} color={C.violet} onClick={()=>setSelType(t)}/>)}
        </div>
        <div style={{width:1,height:24,background:C.border}}/>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>STATE</span>
          {STATES_LIST.map(s=><FilterPill key={s} label={s==="All"?"All":s.length>8?s.slice(0,8)+"…":s} active={selState===s} color={C.green} onClick={()=>setSelState(s)}/>)}
        </div>
        {(selUser!=="All"||selType!=="All"||selState!=="All") && (
          <button onClick={()=>{setSelUser("All");setSelType("All");setSelState("All");}} style={{
            padding:"3px 12px",borderRadius:20,border:`1px solid ${C.rose}`,
            background:`${C.rose}18`,color:C.rose,fontSize:11,cursor:"pointer",
            fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,
          }}>✕ Reset</button>
        )}
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>

        {/* ── KPI CARDS ── */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <KpiCard label="Total Visitors"  value={fVisitors.length}    color={C.cyan}   icon="👥" sub="customer visits recorded"/>
          <KpiCard label="Total Leads"     value={fLeads.length}       color={C.violet} icon="🎯" sub={`${hotLeads} hot leads`}/>
          <KpiCard label="Total Sales"     value={fSales.length}       color={C.green}  icon="✅" sub="orders confirmed"/>
          <KpiCard label="Quotations Sent" value={quotSent}            color={C.gold}   icon="📄" sub="awaiting decision"/>
          <KpiCard label="Total Revenue"   value={fmt(totalRevenue)}   color={C.gold}   icon="💰" sub={`avg ${fmt(totalRevenue/(fSales.length||1))}/sale`}/>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <ChartCard title="Lead Source">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sourceData} margin={{top:4,right:8,left:-20,bottom:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9}} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {sourceData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lead Pipeline">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={80} innerRadius={35}
                    label={({name,value})=>`${name}: ${value}`} labelLine={false} stroke="none">
                    {stageData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip {...ttp}/>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sales by State">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stateSalesData} layout="vertical" margin={{top:4,right:50,left:70,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10}} width={68}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:9,formatter:v=>fmt(v).replace("₹","")}}>
                    {stateSalesData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Revenue by User">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userSalesData} layout="vertical" margin={{top:4,right:50,left:55,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10}} width={52}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:9,formatter:v=>fmt(v).replace("₹","")}}>
                    {userSalesData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Revenue by Lead Type">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={leadTypeSalesData} layout="vertical" margin={{top:4,right:50,left:80,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10}} width={78}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:9,formatter:v=>fmt(v).replace("₹","")}}>
                    {leadTypeSalesData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Visitors by User">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userVisitorData} margin={{top:4,right:8,left:-20,bottom:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:10}} angle={-30} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {userVisitorData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {activeTab === "visitors" && (
          <DataTab rows={fVisitors} cols={["date","leadType","user","customer","contact","state","city","existing","remarks"]} title="Visitor Records" color={C.cyan}/>
        )}
        {activeTab === "leads" && (
          <DataTab rows={fLeads} cols={["date","source","user","customer","contact","state","leadType","stage","remarks"]} title="Lead Records" color={C.violet}/>
        )}
        {activeTab === "sales" && (
          <DataTab rows={fSales} cols={["date","customer","user","leadType","amount","state"]} title="Sales Records" color={C.green}
            formatCell={(col,val) => col==="amount" ? fmt(val) : String(val??"")}/>
        )}
      </div>
    </div>
  );
}

/* ── CHART WRAPPER ────────────────────────────────────────────────────────── */
function ChartCard({ title, children }) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

/* ── DATA TABLE ───────────────────────────────────────────────────────────── */
function DataTab({ rows, cols, title, color, formatCell }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PER = 20;

  const filtered = useMemo(() => {
    if (!search) return rows;
    return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())));
  }, [rows, search]);

  const paged = filtered.slice(page*PER, (page+1)*PER);
  const pages = Math.ceil(filtered.length/PER);
  const fmt2 = formatCell || ((col,val) => String(val??""));

  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <SectionTitle>{title} ({filtered.length})</SectionTitle>
        <div style={{flex:1}}/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="Search..."
          style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
            color:C.text,padding:"6px 12px",fontSize:11,fontFamily:"'IBM Plex Mono',monospace",outline:"none",width:200}}/>
      </div>
      <div style={{overflowX:"auto",borderRadius:10,border:`1px solid ${C.border}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr style={{background:C.surface}}>
              {cols.map(col=>(
                <th key={col} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,
                  borderBottom:`1px solid ${C.border}`,color:color,
                  fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
                  fontSize:9,letterSpacing:"0.1em",whiteSpace:"nowrap"}}>
                  {col.replace(/([A-Z])/g," $1").trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}44`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cardHi}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {cols.map(col=>(
                  <td key={col} style={{padding:"8px 12px",color:
                    col==="amount"?C.green:col==="stage"?
                      ({New:C.cyan,"Hot Lead":C.orange,"Quotation Send":C.gold,"Follow up":C.violet,Pending:C.rose}[row[col]]||C.text)
                    :C.text,
                    whiteSpace:"nowrap",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis"}}>
                    {fmt2(col, row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{display:"flex",gap:6,justifyContent:"center",alignItems:"center"}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
            style={{background:"none",border:`1px solid ${C.border}`,color:C.sub,borderRadius:7,
              padding:"4px 12px",cursor:"pointer",fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>Prev</button>
          <span style={{color:C.sub,fontSize:11}}>{page+1} / {pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}
            style={{background:"none",border:`1px solid ${C.border}`,color:C.sub,borderRadius:7,
              padding:"4px 12px",cursor:"pointer",fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>Next</button>
        </div>
      )}
    </div>
  );
}
