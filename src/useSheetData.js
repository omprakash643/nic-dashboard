// useSheetData.js — NIC Dashboard Google Sheets integration
// Column names confirmed from Power BI data model:
//   Visitor_Related_data:  Date, Lead Type, User, Customer Name, Contact Person,
//                          State, City, Mayer Existing Customer, Remark, Competitors
//   Lead_Realated_Data:    Date, Source, User, Customer Name, Contact Person,
//                          Mobile, Remark, State, Lead Type, Stage, GST NO., Last Follow Date
//   Sales_Related_Data:    Date, Customer, User, Lead Type, PO Amount, State, GST, Products

import { useState, useEffect, useCallback } from "react";

/** Robust CSV parser — handles quoted fields, commas inside quotes, CRLF */
function parseCSV(text) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!normalized) return [];

  let i = 0;
  const results = [];

  function parseField() {
    if (normalized[i] === '"') {
      i++;
      let val = "";
      while (i < normalized.length) {
        if (normalized[i] === '"') {
          if (normalized[i + 1] === '"') { val += '"'; i += 2; }
          else { i++; break; }
        } else { val += normalized[i++]; }
      }
      return val.trim();
    }
    let val = "";
    while (i < normalized.length && normalized[i] !== "," && normalized[i] !== "\n") {
      val += normalized[i++];
    }
    return val.trim();
  }

  function parseRow() {
    const row = [];
    while (i < normalized.length && normalized[i] !== "\n") {
      row.push(parseField());
      if (i < normalized.length && normalized[i] === ",") i++;
    }
    if (i < normalized.length && normalized[i] === "\n") i++;
    return row;
  }

  const headers = parseRow().map(h => h.trim());
  if (!headers.length) return [];

  while (i < normalized.length) {
    const vals = parseRow();
    if (vals.every(v => v === "")) continue;
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] ?? ""; });
    results.push(obj);
  }
  return results;
}

/** Hook: fetch + auto-refresh a published Google Sheet tab as CSV */
export function useSheetTab(url, refreshMs = 300000) {
  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${url}&cachebust=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCSV(text);
      // Debug: log exact columns to browser console
      if (parsed.length > 0) {
        console.log("📊 Sheet columns:", Object.keys(parsed[0]));
        console.log("📊 Row 1 sample:", parsed[0]);
      }
      setData(parsed);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
      console.error("Sheet fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    if (refreshMs > 0) {
      const id = setInterval(fetchData, refreshMs);
      return () => clearInterval(id);
    }
  }, [fetchData, refreshMs]);

  return { data, loading, error, lastUpdated, refetch: fetchData };
}

/** Pick first truthy value from multiple column name variants */
function pick(row, ...keys) {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/** Strip ₹ and commas, parse as number */
function toNum(val) {
  if (!val) return 0;
  return parseFloat(String(val).replace(/[₹,\s]/g, "")) || 0;
}

/* ── TRANSFORMS: exact Power BI column names ── */

export function transformVisitors(rows) {
  return rows.map(r => ({
    date:        pick(r, "Date"),
    leadType:    pick(r, "Lead Type"),
    user:        pick(r, "User"),
    customer:    pick(r, "Customer Name"),
    contact:     pick(r, "Contact Person"),
    state:       pick(r, "State"),
    city:        pick(r, "City", "CIty"),
    competitors: pick(r, "Competitors", "Mayer Existing Customer"),
    remarks:     pick(r, "Remark", "Remarks"),
  })).filter(r => r.date && r.date !== "Date");
}

export function transformLeads(rows) {
  return rows.map(r => ({
    date:        pick(r, "Date"),
    uqn:         pick(r, "GST NO.", "UQN"),
    source:      pick(r, "Source"),
    user:        pick(r, "User"),
    customer:    pick(r, "Customer Name"),
    contact:     pick(r, "Contact Person"),
    mobile:      pick(r, "Mobile"),
    remarks:     pick(r, "Remark", "Remarks"),
    state:       pick(r, "State"),
    leadType:    pick(r, "Lead Type"),
    stage:       pick(r, "Stage"),
    lastFollow:  pick(r, "Last Follow Date"),
  })).filter(r => r.date && r.date !== "Date");
}

export function transformSales(rows) {
  if (rows.length > 0) console.log("💰 SALES cols:", Object.keys(rows[0]));
  return rows.map(r => ({
    date:     pick(r, "Date"),
    customer: pick(r, "Customer"),
    user:     pick(r, "User"),
    leadType: pick(r, "Lead Type"),
    amount:   toNum(pick(r, "PO Amount", "Amount", "Sale Amount", "Order Value", "Value", "Revenue")),
    state:    pick(r, "State"),
    products: pick(r, "Products"),
    gst:      pick(r, "GST"),
  })).filter(r => r.date && r.date !== "Date");
}
