export interface ValuationFormData {
  // Property data
  address: string;
  upi: string;
  owner: string;
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;

  // Valuation data
  client_name: string;
  client_contact: string;
  assessed_value: string;
  status: string;
  valuation_method: string;
  purpose: string;
  property_condition: string;
  valuation_date: string;
  inspection_date: string;
  instruction_date: string;
  general_notes: string;
  assessment_notes: string;
  rental_income: string;
  operating_expenses: string;
  cap_rate: string;
  vacancy_rate: string;

  // Valuation data sections
  valuation_data: Array<{
    id?: number;
    section: string;
    value: string;
    display_order: number;
  }>;
}

export interface ValuationDataItem {
  id?: number;
  section: string;
  value: string;
  display_order: number;
}
