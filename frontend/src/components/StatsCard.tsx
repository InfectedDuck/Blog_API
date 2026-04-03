'use client';

interface StatsCardProps {
  label: string;
  value: number;
  sublabel?: string;
  bgColor: string;
}

export default function StatsCard({ label, value, sublabel, bgColor }: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl shadow-sm p-6`}>
      <div className="text-3xl font-bold text-text-primary">{value}</div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
      {sublabel && (
        <div className="text-xs text-text-muted mt-1">{sublabel}</div>
      )}
    </div>
  );
}
