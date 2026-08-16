"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationBar({
  page, totalPages, total, limit, onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between pt-[16px] flex-wrap gap-[12px]" style={{ fontFamily: "Poppins, sans-serif" }}>
      <span className="text-[12px]" style={{ color: "#888" }}>
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-[6px]">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: page <= 1 ? "#F5F5F5" : "#35319B", color: page <= 1 ? "#BBB" : "white" }}
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i + 1;
          } else if (page <= 4) {
            pageNum = i + 1;
          } else if (page >= totalPages - 3) {
            pageNum = totalPages - 6 + i;
          } else {
            pageNum = page - 3 + i;
          }
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-none cursor-pointer text-[13px] font-semibold transition-all"
              style={{
                background: pageNum === page ? "#35319B" : "transparent",
                color: pageNum === page ? "white" : "#666",
                fontFamily: "Poppins, sans-serif",
                border: pageNum === page ? "none" : "1px solid #E5E7EB",
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: page >= totalPages ? "#F5F5F5" : "#35319B", color: page >= totalPages ? "#BBB" : "white" }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
