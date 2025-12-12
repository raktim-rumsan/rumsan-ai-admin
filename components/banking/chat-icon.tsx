export function RobotIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot head */}
      <rect x="12" y="20" width="40" height="32" rx="8" fill="#1a1a1a" />
      {/* Antenna */}
      <circle cx="32" cy="12" r="4" fill="#6366f1" />
      <rect x="30" y="14" width="4" height="8" fill="#6366f1" />
      {/* Eyes */}
      <circle cx="24" cy="34" r="5" fill="#22d3ee" />
      <circle cx="40" cy="34" r="5" fill="#22d3ee" />
      {/* Eye glow */}
      <circle cx="24" cy="34" r="3" fill="#fff" opacity="0.6" />
      <circle cx="40" cy="34" r="3" fill="#fff" opacity="0.6" />
      {/* Mouth */}
      <rect x="22" y="44" width="20" height="3" rx="1.5" fill="#6366f1" />
      {/* Cheeks */}
      <circle cx="16" cy="38" r="2" fill="#f472b6" opacity="0.5" />
      <circle cx="48" cy="38" r="2" fill="#f472b6" opacity="0.5" />
    </svg>
  );
}
