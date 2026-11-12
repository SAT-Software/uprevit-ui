const connectors = [
  "M222 92C300 92 290 170 366 170",
  "M222 198C290 198 300 180 366 180",
  "M222 294C300 294 290 190 366 190",
];

const statuses = [
  {
    label: "Draft",
    width: 54,
    fill: "var(--badge-neutral)",
    color: "var(--badge-neutral-foreground)",
  },
  {
    label: "In review",
    width: 74,
    fill: "var(--badge-warning)",
    color: "var(--badge-warning-foreground)",
  },
  {
    label: "Released",
    width: 72,
    fill: "var(--badge-feature)",
    color: "var(--badge-feature-foreground)",
  },
];

const textBars = (x: number, y: number, widths: number[]) =>
  widths.map((width, index) => (
    <rect
      key={index}
      x={x}
      y={y + index * 12}
      width={width}
      height={5}
      rx={2.5}
      fill="var(--muted-foreground)"
      opacity={0.2}
    />
  ));

function SymbolChip({ x, children }: { x: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} 142)`}>
      <rect
        width={44}
        height={26}
        rx={6}
        fill="var(--muted)"
        stroke="var(--border)"
      />
      <g transform="translate(22 13)">{children}</g>
    </g>
  );
}

function BoxSymbol({ label }: { label: string }) {
  return (
    <>
      <rect
        x={-13}
        y={-7}
        width={26}
        height={14}
        rx={1}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth={1.2}
      />
      <text
        y={3}
        textAnchor="middle"
        fontSize={8}
        fontWeight={600}
        fill="var(--foreground)"
      >
        {label}
      </text>
    </>
  );
}

export function WhatIsUprevitCover() {
  return (
    <div className="relative size-full overflow-hidden bg-background [background-image:linear-gradient(to_right,var(--separator-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--separator-primary)_1px,transparent_1px)] [background-size:40px_40px]">
      <svg
        viewBox="0 0 640 360"
        className="size-full font-sans"
        fill="none"
        aria-hidden
      >
        <g transform="rotate(-3 130 92)">
          <rect
            x={40}
            y={44}
            width={180}
            height={96}
            rx={10}
            fill="var(--card)"
            stroke="var(--border)"
          />
          <rect
            x={54}
            y={56}
            width={10}
            height={10}
            rx={2}
            fill="var(--muted-foreground)"
            opacity={0.4}
          />
          <text x={70} y={65} fontSize={11} fill="var(--muted-foreground)">
            specs_final_v2.xlsx
          </text>
          <rect
            x={54}
            y={76}
            width={152}
            height={54}
            fill="none"
            stroke="var(--border)"
          />
          {[94, 112].map((y) => (
            <line
              key={y}
              x1={54}
              x2={206}
              y1={y}
              y2={y}
              stroke="var(--border)"
            />
          ))}
          {[92, 130, 168].map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1={76}
              y2={130}
              stroke="var(--border)"
            />
          ))}
          {[
            [59, 83],
            [97, 83],
            [135, 101],
            [59, 119],
            [173, 119],
          ].map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={24}
              height={4}
              rx={2}
              fill="var(--muted-foreground)"
              opacity={0.25}
            />
          ))}
        </g>

        <g transform="rotate(2 140 198)">
          <rect
            x={60}
            y={156}
            width={160}
            height={84}
            rx={10}
            fill="var(--card)"
            stroke="var(--border)"
          />
          <text x={74} y={177} fontSize={11} fill="var(--muted-foreground)">
            label_v7_FINAL.docx
          </text>
          {textBars(74, 190, [120, 96, 108, 70])}
        </g>

        <g transform="rotate(-1.5 130 294)">
          <rect
            x={40}
            y={258}
            width={180}
            height={72}
            rx={10}
            fill="var(--card)"
            stroke="var(--border)"
          />
          <circle
            cx={58}
            cy={279}
            r={7}
            fill="var(--muted)"
            stroke="var(--border)"
          />
          <text
            x={72}
            y={283}
            fontSize={11}
            fontWeight={500}
            fill="var(--foreground)"
          >
            RE: RE: Fwd: label change
          </text>
          {textBars(54, 298, [140, 96])}
        </g>

        {connectors.map((d) => (
          <g key={d}>
            <path d={d} stroke="var(--border)" strokeDasharray="4 4" />
            <path
              d={d}
              pathLength={100}
              stroke="var(--primary)"
              strokeWidth={1.5}
              strokeLinecap="round"
              className="blog-cover-flow"
            />
          </g>
        ))}
        {[92, 198, 294].map((y) => (
          <circle
            key={y}
            cx={222}
            cy={y}
            r={3}
            fill="var(--muted)"
            stroke="var(--border)"
          />
        ))}

        <rect
          x={366}
          y={54}
          width={248}
          height={252}
          rx={18}
          fill="var(--muted)"
          stroke="var(--border)"
        />
        <rect
          x={372}
          y={60}
          width={236}
          height={240}
          rx={14}
          fill="var(--card)"
          stroke="var(--border)"
        />

        <rect
          x={386}
          y={74}
          width={28}
          height={28}
          rx={8}
          fill="var(--foreground)"
        />
        <path
          d="M400 81L406 84.5V91.5L400 95L394 91.5V84.5L400 81ZM394 84.5L400 88L406 84.5M400 88V95"
          stroke="var(--background)"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        <text
          x={424}
          y={86}
          fontSize={14}
          fontWeight={600}
          fill="var(--foreground)"
        >
          Peripheral Catheter
        </text>
        <text x={424} y={101} fontSize={11} fill="var(--muted-foreground)">
          One record for every label
        </text>
        <line x1={386} x2={594} y1={116} y2={116} stroke="var(--border)" />

        <text
          x={386}
          y={134}
          fontSize={10}
          fontWeight={500}
          letterSpacing="0.06em"
          fill="var(--muted-foreground)"
        >
          SYMBOLS
        </text>
        <SymbolChip x={386}>
          <BoxSymbol label="REF" />
        </SymbolChip>
        <SymbolChip x={438}>
          <BoxSymbol label="LOT" />
        </SymbolChip>
        <SymbolChip x={490}>
          <path
            d="M-5 -6H5L-5 6H5Z"
            stroke="var(--foreground)"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </SymbolChip>
        <SymbolChip x={542}>
          <path
            d="M-7 6V-2L-3 -5V-2L1 -5V-2L5 -5V-7H7V6Z"
            fill="var(--foreground)"
          />
        </SymbolChip>

        {[
          ["Standards", "ISO 15223-1 · EU MDR", 192],
          ["Label components", "12", 212],
          ["Specifications", "3 sheets", 232],
        ].map(([label, value, y]) => (
          <g key={label}>
            <text x={386} y={y} fontSize={11} fill="var(--muted-foreground)">
              {label}
            </text>
            <text
              x={594}
              y={y}
              fontSize={11}
              fontWeight={500}
              textAnchor="end"
              fill="var(--foreground)"
            >
              {value}
            </text>
          </g>
        ))}
        <line x1={386} x2={594} y1={248} y2={248} stroke="var(--border)" />

        {statuses.map((status, index) => (
          <g
            key={status.label}
            className="blog-cover-status"
            style={{
              animationDelay: `${-((3 - index) % 3) * 3}s`,
              opacity: index === statuses.length - 1 ? 1 : 0,
            }}
          >
            <rect
              x={386}
              y={260}
              width={status.width}
              height={22}
              rx={11}
              fill={status.fill}
            />
            <circle cx={398} cy={271} r={3} fill={status.color} />
            <text
              x={406}
              y={275}
              fontSize={11}
              fontWeight={500}
              fill={status.color}
            >
              {status.label}
            </text>
          </g>
        ))}
        <text
          x={594}
          y={275}
          fontSize={11}
          textAnchor="end"
          fill="var(--muted-foreground)"
        >
          Version 3
        </text>
      </svg>
    </div>
  );
}
