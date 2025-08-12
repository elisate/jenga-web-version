"use client";
import {
  StatsOverview,
  ValuationsTable,
  useDashboardData,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/lib/hooks";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const isMounted = useMounted();

  const { valuations, loading, paginationLoading, stats, totalCount } =
    useDashboardData(page, itemsPerPage);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" space-y-8">
      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Recent Activity */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Recent Activity
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Latest property valuations and their current status in your
            workflow.
          </p>
        </div>

        <ValuationsTable
          valuations={valuations}
          loading={loading}
          paginationLoading={paginationLoading}
          totalCount={totalCount}
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />

        {totalCount > itemsPerPage && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/valuations")}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200"
            >
              View All Valuations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
