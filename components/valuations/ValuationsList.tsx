import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ValuationListItem } from "@/types/valuations";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ValuationCard } from "./ValuationCard";

interface ValuationsListProps {
  valuations: ValuationListItem[];
  loading: boolean;
  onDelete?: (
    id: number
  ) => Promise<{ success: boolean; error: string | null }>;
}

export function ValuationsList({
  valuations,
  loading,
  onDelete,
}: ValuationsListProps) {
  const [deleteMessage, setDeleteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDelete = async (id: number) => {
    if (!onDelete)
      return { success: false, error: "Delete function not provided" };

    const result = await onDelete(id);

    if (result.success) {
      setDeleteMessage({
        type: "success",
        text: "Valuation deleted successfully!",
      });
    } else {
      setDeleteMessage({
        type: "error",
        text: result.error || "Failed to delete valuation",
      });
    }

    // Clear message after 5 seconds
    setTimeout(() => setDeleteMessage(null), 5000);

    return result;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (valuations.length === 0) {
    return (
      <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No valuations found
          </h3>
          <p className="text-slate-600 mb-4">
            Try adjusting your search or filter criteria, or create a new
            valuation
          </p>
          <Link href="/dashboard/valuations/new">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Valuation
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {deleteMessage && (
        <div
          className={`p-4 rounded-lg border ${
            deleteMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {deleteMessage.text}
        </div>
      )}

      {valuations.map((valuation) => (
        <ValuationCard
          key={valuation.id}
          valuation={valuation}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
