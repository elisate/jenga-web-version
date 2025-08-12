"use client";

interface StatsOverviewProps {
  stats: {
    total: number;
    draft: number;
    under_review: number;
    finalized: number;
    templates: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      label: "Total Valuations",
      value: stats.total,
      description: "Properties assessed",
      color: "text-gray-900",
    },

    {
      label: "In Progress",
      value: stats.draft + stats.under_review,
      description: "Active assessments",
      color: "text-purple-600",
    },
    {
      label: "Completed",
      value: stats.finalized,
      description: "Finalized reports",
      color: "text-emerald-600",
    },
    {
      label: "Templates",
      value: stats.templates,
      description: "Available templates",
      color: "text-blue-600",
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm hover:border-purple-200 transition-all duration-200"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
