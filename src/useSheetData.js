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
 * Transforms raw sheet rows into VISITORS format
 * Column names in sheet must match exactly (case-sensitive)
 */
export function transformVisitors(rows) {
  return rows.map(r => ({
    date:     r.date     || "",
    leadType: r.leadType || r.lead_type || r["Lead Type"] || "",
    user:     r.user     || r.User || "",
    customer: r.customer || r.Customer || "",
    contact:  r.contact  || r.Contact || "",
    state:    r.state    || r.State || "",
    city:     r.city     || r.City || "",
    existing: r.existing || r.Existing || "",
    remarks:  r.remarks  || r.Remarks || "",
  })).filter(r => r.date);
}

/**
 * Transforms raw sheet rows into LEADS format
 */
export function transformLeads(rows) {
  return rows.map(r => ({
    date:     r.date     || "",
    uqn:      r.uqn      || r.UQN || "",
    source:   r.source   || r.Source || "",
    user:     r.user     || r.User || "",
    customer: r.customer || r.Customer || "",
    contact:  r.contact  || r.Contact || "",
    mobile:   r.mobile   || r.Mobile || "",
    remarks:  r.remarks  || r.Remarks || "",
    state:    r.state    || r.State || "",
    leadType: r.leadType || r.lead_type || r["Lead Type"] || "",
    stage:    r.stage    || r.Stage || "",
  })).filter(r => r.date);
}

/**
 * Transforms raw sheet rows into SALES format
 */
export function transformSales(rows) {
  return rows.map(r => ({
    date:     r.date     || "",
    customer: r.customer || r.Customer || "",
    user:     r.user     || r.User || "",
    leadType: r.leadType || r.lead_type || r["Lead Type"] || "",
    amount:   parseFloat(r.amount || r.Amount || "0") || 0,
    state:    r.state    || r.State || "",
  })).filter(r => r.date);
}
