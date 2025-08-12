"use client";

import { Button } from "@/components/ui/button";
import {
  ValuationFilters,
  ValuationStats,
  ValuationsList,
} from "@/components/valuations";
import { useValuations } from "@/hooks/useValuations";
import { useMounted } from "@/lib/hooks";

export default function ValuationsPage() {
  const isMounted = useMounted();
  const {
    valuations,
    loading,
    error,
    stats,
    filters,
    setFilters,
    deleteValuation,
  } = useValuations();

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading valuations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading valuations: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Valuations
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <ValuationStats stats={stats} />

      {/* Filters */}
      <ValuationFilters filters={filters} onFiltersChange={setFilters} />

      {/* Valuations List */}
      <ValuationsList
        valuations={valuations}
        loading={loading}
        onDelete={deleteValuation}
      />
    </div>
  );
}
