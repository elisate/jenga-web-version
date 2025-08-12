import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface ValuationStatusBadgeProps {
  status: string;
}

export function ValuationStatusBadge({ status }: ValuationStatusBadgeProps) {
  const statusConfig = {
    draft: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-3 h-3" />,
    },
    under_review: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <AlertCircle className="w-3 h-3" />,
    },
    finalized: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="w-3 h-3" />,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <Badge
      className={`${config.color} border font-medium px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 w-fit`}
    >
      {config.icon}
      {status.replace("_", " ")}
    </Badge>
  );
}
