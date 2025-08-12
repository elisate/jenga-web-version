"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PaginationControls } from "./PaginationControls";
import { ValuationStatusBadge } from "./ValuationStatusBadge";

interface Valuation {
  id: number;
  client_name?: string | null;
  status: string | null;
  valuation_method?: string | null;
  created_at: string;
  properties: {
    upi: string;
  } | null;
}

interface ValuationsTableProps {
  valuations: Valuation[];
  loading: boolean;
  paginationLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function ValuationsTable({
  valuations,
  loading,
  paginationLoading,
  totalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
}: ValuationsTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-flex items-center gap-3 text-gray-600">
            <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <span>Loading your valuations...</span>
          </div>
        </div>
      </div>
    );
  }

  if (valuations.length === 0 && totalCount === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              No valuations yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Start building your portfolio by creating your first property
              valuation assessment.
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/valuations/new")}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            Create Your First Valuation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="relative overflow-x-auto">
        {paginationLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                Client
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                Property UPI
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                Method
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                Created
              </th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700 uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {valuations.map((valuation, index) => (
              <motion.tr
                key={valuation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-purple-50 transition-colors duration-150"
              >
                <td className="py-4 px-6">
                  <span className="font-medium text-gray-900">
                    {valuation.client_name || "—"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600 font-mono text-sm">
                    {valuation.properties?.upi || "—"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <ValuationStatusBadge status={valuation.status || "draft"} />
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600 capitalize">
                    {valuation.valuation_method || "—"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600 text-sm">
                    {new Date(valuation.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      router.push(`/dashboard/valuations/${valuation.id}`)
                    }
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 inline-flex items-center gap-1"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          isLoading={paginationLoading}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
