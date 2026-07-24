export function SkeletonStatCard() {
  return (
    <div className="p-[18px] rounded-[16px] animate-pulse" style={{ background: "#F5F5F5" }}>
      <div className="flex items-center gap-[12px]">
        <div className="w-[38px] h-[38px] rounded-xl" style={{ background: "#E8E8E8" }} />
        <div className="flex-1">
          <div className="h-[10px] w-[60%] rounded mb-[6px]" style={{ background: "#E0E0E0" }} />
          <div className="h-[18px] w-[40%] rounded" style={{ background: "#E0E0E0" }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse" style={{ width: "100%" }}>
      {/* Header */}
      <div className="flex gap-[16px] mb-[12px] px-[16px] py-[12px]" style={{ background: "#F8F9FF", borderRadius: "12px" }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-[10px] rounded flex-1" style={{ background: "#E0E0E0" }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-[16px] px-[16px] py-[14px]" style={{ borderTop: "1px solid #F0F0F0" }}>
          <div className="flex items-center gap-[10px] flex-1">
            <div className="w-[30px] h-[30px] rounded-full" style={{ background: "#E8E8E8" }} />
            <div className="h-[12px] w-[60%] rounded" style={{ background: "#E8E8E8" }} />
          </div>
          {Array.from({ length: cols - 1 }).map((_, c) => (
            <div key={c} className="h-[12px] rounded flex-1" style={{ background: "#E8E8E8" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="animate-pulse p-[20px] rounded-[16px]" style={{ background: "#F5F5F5" }}>
      <div className="flex items-center gap-[10px] mb-[16px]">
        <div className="w-[36px] h-[36px] rounded-xl" style={{ background: "#E0E0E0" }} />
        <div className="h-[14px] w-[140px] rounded" style={{ background: "#E0E0E0" }} />
      </div>
      <div className="flex items-end gap-[8px] h-[80px]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 rounded" style={{ height: `${20 + Math.random() * 50}px`, background: "#E0E0E0" }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="animate-pulse rounded-[20px] p-[32px] mb-[24px]" style={{ background: "linear-gradient(135deg, #E8E8F0, #D8D8E8)" }}>
      <div className="h-[12px] w-[200px] rounded mb-[8px]" style={{ background: "#C8C8D8" }} />
      <div className="h-[22px] w-[300px] rounded mb-[6px]" style={{ background: "#C8C8D8" }} />
      <div className="h-[12px] w-[400px] rounded" style={{ background: "#C8C8D8" }} />
    </div>
  );
}
