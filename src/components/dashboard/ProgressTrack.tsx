"use client";

export type NodeState = "completed" | "current" | "future";

export interface ProgressNode {
  id: string;
  label: string;
  state: NodeState;
}

interface ProgressTrackProps {
  nodes: ProgressNode[];
}

/** Winding path for 6 nodes: zigzag pattern */
const PATH_D = [
  "M 40 24",      // Node 0
  "L 40 80",
  "L 200 80",     // Node 1
  "L 200 136",
  "L 40 136",     // Node 2
  "L 40 192",
  "L 200 192",    // Node 3
  "L 200 248",
  "L 40 248",     // Node 4
  "L 40 304",
  "L 200 304",    // Node 5
].join(" ");

const NODE_POSITIONS = [
  { x: 40, y: 24 },
  { x: 200, y: 80 },
  { x: 40, y: 136 },
  { x: 200, y: 192 },
  { x: 40, y: 248 },
  { x: 200, y: 304 },
];

const NODE_R = 16;

export function ProgressTrack({ nodes }: ProgressTrackProps) {
  return (
    <div
      className="overflow-x-auto overflow-y-hidden py-6 -mx-4"
      role="region"
      aria-label="Your progress ladder"
    >
      <div className="min-w-[280px] px-4">
        <svg
          viewBox="0 0 240 328"
          className="w-full max-w-[280px] mx-auto"
          aria-hidden
        >
          {/* Path line */}
          <path
            d={PATH_D}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-300"
          />
          {/* Nodes */}
          {nodes.map((node, i) => {
            const pos = NODE_POSITIONS[i] ?? { x: 40, y: 24 };
            const isCompleted = node.state === "completed";
            const isCurrent = node.state === "current";
            const isFuture = node.state === "future";

            return (
              <g key={node.id}>
                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R}
                  fill={isCompleted ? "var(--color-accent-100)" : "transparent"}
                  stroke={
                    isCurrent
                      ? "var(--color-accent-500)"
                      : isFuture
                        ? "var(--color-brand-300)"
                        : "var(--color-accent-400)"
                  }
                  strokeWidth={isCurrent ? 3 : 1.5}
                  className={isCurrent ? "animate-pulse-soft" : undefined}
                />
                {/* Checkmark for completed */}
                {isCompleted && (
                  <g
                    transform={`translate(${pos.x - 8}, ${pos.y - 8})`}
                    fill="none"
                    stroke="var(--color-accent-600)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 8l4 4 8-8" />
                  </g>
                )}
                {/* Current: subtle inner dot */}
                {isCurrent && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={4}
                    fill="var(--color-accent-500)"
                  />
                )}
              </g>
            );
          })}
        </svg>
        {/* Current step label */}
        {nodes.find((n) => n.state === "current") && (
          <p className="mt-3 text-sm text-ink-muted text-center">
            Step{" "}
            <span className="font-medium text-ink">
              {nodes.findIndex((n) => n.state === "current") + 1}
            </span>{" "}
            of {nodes.length}
          </p>
        )}
      </div>
    </div>
  );
}
