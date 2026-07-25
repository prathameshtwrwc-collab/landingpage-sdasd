"use client";

import { useState, useCallback, useMemo } from "react";
import { Download, CheckSquare, Square } from "lucide-react";

type ColumnDef = { key: string; label: string };

type ExportMode = "full" | "contacts" | "emails";

function escapeCsv(val: unknown): string {
  const s = val === null || val === undefined ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function generateCsv(rows: string[][]): string {
  return rows.map((row) => row.join(",")).join("\r\n");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;bom" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Hook for managing checkbox selection state */
export function useCsvSelection<T>(items: T[]) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const allSelected = items.length > 0 && selected.size === items.length;

  const toggleAll = useCallback(() => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(items.map((_, i) => i)));
  }, [allSelected, items.length]);

  const toggle = useCallback((idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  return { selected, allSelected, toggleAll, toggle, clear };
}

/** Export the selected (or all) rows as CSV */
export function exportCsv<T>(
  items: T[],
  selected: Set<number>,
  columns: ColumnDef[],
  mode: ExportMode,
  filename: string,
) {
  const rows = selected.size > 0 ? items.filter((_, i) => selected.has(i)) : items;
  if (rows.length === 0) return;

  let visibleColumns: ColumnDef[];
  if (mode === "emails") visibleColumns = columns.filter((c) => /email/i.test(c.key));
  else if (mode === "contacts") visibleColumns = columns.filter((c) => /name|email|phone|contact|first_name|last_name|source_type|organization/i.test(c.key));
  else visibleColumns = columns;

  if (visibleColumns.length === 0) visibleColumns = columns;

  const csvRows: string[][] = [visibleColumns.map((c) => c.label)];
  rows.forEach((row) => {
    csvRows.push(visibleColumns.map((c) => escapeCsv((row as Record<string, unknown>)[c.key])));
  });

  downloadCsv(generateCsv(csvRows), `${filename}-${mode}`);
}

/** Toolbar with export mode selector and export button */
export function CsvToolbar({
  selectedCount,
  totalCount,
  onExport,
}: {
  selectedCount: number;
  totalCount: number;
  onExport: (mode: ExportMode) => void;
}) {
  const [mode, setMode] = useState<ExportMode>("full");

  return (
    <div className="flex items-center gap-[10px] flex-wrap">
      <select value={mode} onChange={(e) => setMode(e.target.value as ExportMode)}
        className="px-[10px] py-[7px] rounded-lg border text-[11px] cursor-pointer outline-none"
        style={{ borderColor: "#E0E0E0", color: "#555", background: "#FFF", fontFamily: "Poppins, sans-serif" }}>
        <option value="full">Full Details</option>
        <option value="contacts">Contacts Only</option>
        <option value="emails">Emails Only</option>
      </select>
      <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>
        {selectedCount || totalCount} of {totalCount} selected
      </span>
      <button type="button" onClick={() => onExport(mode)}
        className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-lg border-none cursor-pointer text-[11px] font-semibold text-white transition-colors"
        style={{ background: "#35319B", fontFamily: "Poppins, sans-serif" }}>
        <Download size={13} /> Export CSV
      </button>
    </div>
  );
}

/** Checkbox header cell */
export function CheckAllCell({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="inline-flex items-center bg-transparent border-none cursor-pointer p-[2px]">
      {checked ? <CheckSquare size={14} stroke="#35319B" /> : <Square size={14} stroke="#BBB" />}
    </button>
  );
}

/** Checkbox row cell */
export function CheckRowCell({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="inline-flex items-center bg-transparent border-none cursor-pointer p-[2px]">
      {checked ? <CheckSquare size={14} stroke="#35319B" /> : <Square size={14} stroke="#CCC" />}
    </button>
  );
}
