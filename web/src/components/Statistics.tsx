'use client';

import { useEffect, useState } from 'react';

interface Stats {
  messages: number;
  contributors: number;
  daysUntil: number;
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    messages: 0,
    contributors: 0,
    daysUntil: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/statistics');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-pulse"
          >
            <div className="h-8 bg-white/20 rounded mb-2"></div>
            <div className="h-12 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard
        icon="🔒"
        label="Messages Sealed"
        value={stats.messages.toLocaleString()}
        color="blue"
      />
      <StatCard
        icon="👥"
        label="Contributors"
        value={stats.contributors.toLocaleString()}
        color="purple"
      />
      <StatCard
        icon="⏰"
        label="Days Until 2035"
        value={stats.daysUntil.toLocaleString()}
        color="pink"
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: 'blue' | 'purple' | 'pink';
}) {
  const colorClasses = {
    blue: 'border-blue-500/50 bg-blue-500/10',
    purple: 'border-purple-500/50 bg-purple-500/10',
    pink: 'border-pink-500/50 bg-pink-500/10',
  };

  return (
    <div
      className={`${colorClasses[color]} backdrop-blur-sm rounded-xl p-6 border`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-white text-4xl font-bold">{value}</div>
    </div>
  );
}
