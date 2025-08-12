import { Database } from "./supabase";

export type ValuationRow = Database["public"]["Tables"]["valuations"]["Row"];
export type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

export interface ValuationWithProperty extends ValuationRow {
  property: PropertyRow;
}

export interface ValuationListItem {
  id: number;
  propertyAddress: string;
  propertyUPI: string;
  clientName: string;
  clientContact: string | null;
  location: string;
  propertyCondition: string;
  status: Database["public"]["Enums"]["valuation_status_enum"] | null;
  purpose: Database["public"]["Enums"]["valuation_purpose_enum"] | null;
  valuationMethod: Database["public"]["Enums"]["valuation_method_enum"] | null;
  createdAt: string;
  valuationDate: string | null;
  inspectionDate: string | null;
  instructionDate: string | null;
  generalNotes: string | null;
  assessmentNotes: string | null;
}

export interface ValuationFilters {
  search?: string;
  status?: string;
  purpose?: string;
  method?: string;
}

export interface ValuationStats {
  total: number;
  draft: number;
  underReview: number;
  finalized: number;
}
