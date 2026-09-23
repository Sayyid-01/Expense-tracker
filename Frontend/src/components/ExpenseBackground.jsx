const ExpenseBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f5f2]">

      <div className="pointer-events-none absolute inset-0">

        {/* Soft background glow */}
        <div className="absolute -left-40 -top-40 h-150 w-150 rounded-full bg-white blur-[90px]" />
        <div className="absolute -bottom-48 -right-40 h-162.5 w-162.5 rounded-full bg-[#deded9] blur-[100px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.07) 10px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
          }}
        />

        {/* Large decorative circles */}
        <div className="absolute -left-24 top-[18%] h-105 w-105 rounded-full border border-black/10" />
        <div className="absolute -left-10 top-[23%] h-75 w-75 rounded-full border border-black/8" />

        <div className="absolute -right-32 top-[8%] h-125 w-125 rounded-full border border-black/8" />
        <div className="absolute -right-10 top-[14%] h-90 w-90 rounded-full border border-black/6" />

        {/* Decorative finance chart */}
        <svg
          className="absolute bottom-0 left-0 h-90 w-full"
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
        >
          {/* area */}
          <path
            d="M0 320 C140 300 170 250 290 270 S450 310 560 220 S700 100 820 190 S980 270 1080 150 S1260 100 1440 40 L1440 360 L0 360 Z"
            fill="rgba(0,0,0,0.035)"
          />

          {/* chart line */}
          <path
            d="M0 320 C140 300 170 250 290 270 S450 310 560 220 S700 100 820 190 S980 270 1080 150 S1260 100 1440 40"
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="2"
          />

          {/* second line */}
          <path
            d="M0 340 C160 330 240 290 350 305 S540 250 650 270 S820 300 940 220 S1120 180 1440 120"
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Chart points */}
        <div className="absolute bottom-[20%] left-[39%] h-3 w-3 rounded-full border-2 border-black/20 bg-[#f5f5f2]" />
        <div className="absolute bottom-[27%] left-[57%] h-3 w-3 rounded-full border-2 border-black/20 bg-[#f5f5f2]" />
        <div className="absolute bottom-[19%] left-[75%] h-3 w-3 rounded-full border-2 border-black/20 bg-[#f5f5f2]" />

        {/* Decorative bars */}
        <div className="absolute bottom-[9%] left-[7%] flex items-end gap-2 opacity-20">
          <div className="h-8 w-3 rounded-t bg-black" />
          <div className="h-14 w-3 rounded-t bg-black" />
          <div className="h-11 w-3 rounded-t bg-black" />
          <div className="h-20 w-3 rounded-t bg-black" />
          <div className="h-16 w-3 rounded-t bg-black" />
          <div className="h-24 w-3 rounded-t bg-black" />
        </div>
        
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ExpenseBackground;