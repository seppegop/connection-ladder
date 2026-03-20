"use client";

const EMOTION_OPTIONS: { emoji: string; label: string }[] = [
  { emoji: "😰", label: "Overwhelmed" },
  { emoji: "😬", label: "Nervous" },
  { emoji: "😮‍💨", label: "Relieved" },
  { emoji: "🙂", label: "Okay" },
  { emoji: "😊", label: "Proud" },
  { emoji: "😎", label: "Confident" },
];

/** Display index: 0 = empty, 1–6 = emoji 0–5 */
const DISPLAY_ITEMS = [
  { type: "empty" as const },
  ...EMOTION_OPTIONS.map((opt) => ({ type: "emoji" as const, ...opt })),
];

const LABELS = ["No selection", ...EMOTION_OPTIONS.map((opt) => opt.label)];

interface EmojiScrollerProps {
  value: number | null;
  onChange: (index: number) => void;
}

export function EmojiScroller({ value, onChange }: EmojiScrollerProps) {
  const isEmpty = value === null;
  const displayIndex = isEmpty ? 0 : value;
  const selectedDisplayIndex = isEmpty ? 0 : value + 1;
  const selected = EMOTION_OPTIONS[displayIndex] ?? EMOTION_OPTIONS[0];
  const prevIndex = Math.max(0, displayIndex - 1);
  const nextIndex = Math.min(EMOTION_OPTIONS.length - 1, displayIndex + 1);
  const prev = EMOTION_OPTIONS[prevIndex];
  const next = EMOTION_OPTIONS[nextIndex];

  return (
    <div className="w-full">
      {/* Emoji carousel / empty placeholder */}
      <div className="relative flex items-center justify-center gap-4 py-8 overflow-hidden">
        {/* Previous peek (left) — only when selection exists and not at start */}
        {!isEmpty && displayIndex > 0 && (
          <div
            className="absolute left-0 flex flex-col items-center opacity-40 scale-75 pointer-events-none transition-all duration-200"
            aria-hidden
          >
            <span className="text-3xl">{prev?.emoji}</span>
            <span className="text-xs text-gray-700 mt-1">{prev?.label}</span>
          </div>
        )}

        {/* Emoji container — fixed size, relative, stacked items with opacity toggle */}
        <div className="relative h-48 w-48 flex items-center justify-center flex-shrink-0">
          {DISPLAY_ITEMS.map((item, index) => {
            const isActive = index === selectedDisplayIndex;
            return (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isActive
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                {item.type === "empty" ? (
                  <div
                    className="w-40 h-40 rounded-full border-2 border-dashed border-black bg-amber-100/80"
                    aria-hidden
                  />
                ) : (
                  <span
                    className="select-none inline-block leading-none"
                    style={{ fontSize: "160px" }}
                    role="img"
                    aria-label={item.label}
                  >
                    {item.emoji}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Next peek (right) — only when selection exists and not at end */}
        {!isEmpty && displayIndex < EMOTION_OPTIONS.length - 1 && (
          <div
            className="absolute right-0 flex flex-col items-center opacity-40 scale-75 pointer-events-none transition-all duration-200"
            aria-hidden
          >
            <span className="text-3xl">{next?.emoji}</span>
            <span className="text-xs text-gray-700 mt-1">{next?.label}</span>
          </div>
        )}
      </div>

      {/* Range slider — thumb at far left (0) when empty */}
      <div className="px-2 sm:px-4">
        <input
          type="range"
          min={0}
          max={EMOTION_OPTIONS.length - 1}
          value={displayIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full h-3 appearance-none
            bg-gray-200 rounded-full
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-black
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-neo-sm
            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-black
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black
            [&::-moz-range-thumb]:cursor-pointer
          "
          aria-label="Select how you felt"
          aria-valuemin={0}
          aria-valuemax={EMOTION_OPTIONS.length - 1}
          aria-valuenow={displayIndex}
          aria-valuetext={isEmpty ? "No selection" : selected.label}
        />
        {/* Text label — stacked items with opacity toggle */}
        <div className="relative h-8 mt-3 flex items-center justify-center">
          {LABELS.map((label, index) => {
            const isActive = index === selectedDisplayIndex;
            const isMuted = index === 0;
            return (
              <p
                key={index}
                className={`absolute inset-0 flex items-center justify-center text-lg transition-all duration-300 ease-in-out ${
                  isActive
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                } ${isMuted ? "text-gray-700 font-normal" : "font-semibold text-black"}`}
                aria-hidden={!isActive}
              >
                {label}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { EMOTION_OPTIONS };
