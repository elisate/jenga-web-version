import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ValuationFilters } from "@/types/valuations";
import { Search } from "lucide-react";

interface ValuationFiltersProps {
  filters: ValuationFilters;
  onFiltersChange: (filters: ValuationFilters) => void;
}

export function ValuationFiltersComponent({
  filters,
  onFiltersChange,
}: ValuationFiltersProps) {
  const updateFilter = (key: keyof ValuationFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-[2] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search by client name or UPI..."
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10 border-2 border-slate-200 focus:border-violet-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-40 border-2 border-slate-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="finalized">Finalized</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.purpose || "all"}
          onValueChange={(value) => updateFilter("purpose", value)}
        >
          <SelectTrigger className="w-40 border-2 border-slate-200">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Purposes</SelectItem>
            <SelectItem value="mortgage_security">Mortgage Security</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="purchase">Purchase</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="taxation">Taxation</SelectItem>
            <SelectItem value="probate">Probate</SelectItem>
            <SelectItem value="litigation">Litigation</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="rental">Rental</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.method || "all"}
          onValueChange={(value) => updateFilter("method", value)}
        >
          <SelectTrigger className="w-40 border-2 border-slate-200">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="comparative">Comparative</SelectItem>
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="residual">Residual</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
