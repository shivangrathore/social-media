export function CircularProgress({
  size = 120,
  strokeWidth = 8,
  progress = 0,
}: {
  size?: number;
  strokeWidth?: number;
  progress?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        r={radius}
        cx={center}
        cy={center}
        stroke={"currentColor"}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
