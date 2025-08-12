import { Card, CardContent } from "@/components/ui/card";
import { ValuationStats } from "@/types/valuations";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

interface ValuationStatsProps {
  stats: ValuationStats;
}

export function ValuationStatsComponent({ stats }: ValuationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-1 border-slate-200 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Valuations
              </p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-1 border-slate-200 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Draft</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.draft}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-1 border-slate-200 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.underReview}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-1 border-slate-200 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Finalized</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.finalized}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
