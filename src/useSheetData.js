// useSheetData.js
// Fetches data from a public Google Sheet (CSV export)
// To use: File > Share > Publish to web > CSV

import { useState, useEffect, useCallback } from "react";

/**
 * Parses CSV text into array of objects using first row as headers
 */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    // Handle quoted fields with commas inside
    const vals = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; continue; }
      if (line[i] === "," && !inQ) { vals.push(cur.trim()); cur = ""; continue; }
      cur += line[i];
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj;
  });
}

/**
 * Hook: fetches one sheet tab from published Google Sheet CSV URL
 * @param {string} url  - Published CSV URL for this tab
 * @param {number} refreshMs - Auto-refresh interval (default 5 min)
 */
export function useSheetTab(url, refreshMs = 300000) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    try {
      setLoading(true);
      // Google Sheets published CSV — append cache-buster
      const fetchUrl = `${url}&cachebust=${Date.now()}`;
      const res = await fetch(fetchUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCSV(text);
      setData(parsed);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
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

/**
 * Helper: pick first non-empty value from multiple possible keys
 */
function pick(row, ...keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== "") return row[k];
  }
  return "";
}

/**
 * Transforms raw sheet rows into VISITORS format
 * Handles both your Google Sheet column names AND the old hardcoded names
 */
export function transformVisitors(rows) {
  return rows.map(r => ({
    date:     pick(r, "Date", "date"),
    leadType: pick(r, "Lead Type", "leadType", "lead_type"),
    user:     pick(r, "User", "user"),
    customer: pick(r, "Customer Name", "customer", "Customer"),
    contact:  pick(r, "Contact Person", "contact", "Contact"),
    state:    pick(r, "State", "state"),
    city:     pick(r, "CIty", "City", "city"),
    existing: pick(r, "Meyer Existing Customer", "existing", "Existing"),
    remarks:  pick(r, "Remarks", "remarks"),
  })).filter(r => r.date);
}

/**
 * Transforms raw sheet rows into LEADS format
 */
export function transformLeads(rows) {
  return rows.map(r => ({
    date:     pick(r, "Date", "date"),
    uqn:      pick(r, "UQN", "uqn"),
    source:   pick(r, "Source", "source", "Lead Source"),
    user:     pick(r, "User", "user"),
    customer: pick(r, "Customer Name", "customer", "Customer"),
    contact:  pick(r, "Contact Person", "contact", "Contact"),
    mobile:   pick(r, "Mobile", "mobile", "Phone"),
    remarks:  pick(r, "Remarks", "remarks"),
    state:    pick(r, "State", "state"),
    leadType: pick(r, "Lead Type", "leadType", "lead_type"),
    stage:    pick(r, "Stage", "stage", "Lead Stage"),
  })).filter(r => r.date);
}

/**
 * Transforms raw sheet rows into SALES format
 */
export function transformSales(rows) {
  return rows.map(r => ({
    date:     pick(r, "Date", "date"),
    customer: pick(r, "Customer Name", "customer", "Customer"),
    user:     pick(r, "User", "user"),
    leadType: pick(r, "Lead Type", "leadType", "lead_type"),
    amount:   parseFloat(pick(r, "Amount", "amount", "Sale Amount", "Revenue") || "0") || 0,
    state:    pick(r, "State", "state"),
  })).filter(r => r.date);
}
