const paths = {
  right: "M4 12h15M13 6l6 6-6 6",
  external: "M7 17 17 7M8 7h9v9",
  down: "M12 4v15M6 13l6 6 6-6",
  up: "M12 20V5M6 11l6-6 6 6",
  check: "M5 12.5l4.5 4.5L19 7",
  close: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
};

export function Icon({
  name,
  className = "",
}: {
  name: keyof typeof paths | "dot";
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {name === "dot" ? (
        <circle cx="12" cy="12" r="5" fill="currentColor" />
      ) : (
        <path
          d={paths[name]}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
      )}
    </svg>
  );
}
