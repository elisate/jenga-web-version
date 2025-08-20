// types/report.ts

// Complete report type based on your JSON structure
export type ReportData = {
  instructions?: {
    verbalInstructions?: string;
    writtenInstructions?: string;
    date?: string;
    purposes?: string[];
    inspectedDate?: string;
    inspectedBy?: string;
  };
  definitionOfValues?: string;
  basisOfValuation?: string;
  limitingCondition?: string;
  assumptions?: string;
  declaration?: {
    techName?: string;
    techPosition?: string;
    techDate?: string;
    techSignature?: string;
    techStatement?: string;
    assistantName?: string;
    assistantDate?: string;
    assistantSignature?: string;
    assistantStatement?: string;
    finalStatement?: string;
    finalSignature?: string;
  };
  property?: {
    id?: number;
    propertyUPI?: string;
    upi?: string;
    owner?: string;
    address?: string;
    district?: string;
    province?: string;
    sector?: string;
    village?: string;
    cell?: string;
    country?: string;
    location?: string;
    coordinates?: string;
    imgs?: string[];
    geographical_coordinate?: string;
    location_maps?: string;
  };
  landTenure?: {
    id?: string;
    tenure?: string;
    occupancy?: string;
    nla_zoning?: string;
    plot_shape?: string;
    encumbrances?: string;
    tenure_years?: number;
    plot_size_sqm?: number;
    land_title_use?: string;
    lot_size_notes?: string;
    permitted_uses?: string;
    prohibited_uses?: string;
    land_current_use?: string;
    tenure_start_date?: string;
    map_from_nla?: string;
    map_from_masterplan?: string;
  };
  siteWorks?: {
    id?: string;
    site_name?: string;
    walls?: string[];
    lighting?: string[];
    finishing?: string[];
    gate_types?: string[];
    yard_types?: string[];
    access_types?: string[];
    supply_types?: string[];
    foundation_types?: string[];
    has_boundary_wall?: boolean;
    cctv_installed?: string;
    playground_sqm?: number;
    swimming_pool_sqm?: number;
    solar_system_installed?: string;
    pictures?: string | string[];
  };
  building?: {
    id?: string;
    house_name?: string;
    condition?: string;
    doors?: string[];
    walls?: string[];
    ceiling?: string[];
    windows?: string[];
    fittings?: string[];
    flooring?: string[];
    foundation?: string[];
    roof_member?: string;
    roof_covering?: string[];
    wall_finishing?: string[];
    accommodation_units?: string[];
    other_accommodation_unit?: string[];
    pictures?: string | string[];
  };
  generalRemarks?: string;
  valuationTable?: {
    main?: Array<Array<string | number>>;
    land?: Array<string | number>;
    summary?: Array<Array<string | number>>;
  };
};
