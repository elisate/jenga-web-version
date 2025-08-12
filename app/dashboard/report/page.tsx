"use client";
import React, { useState } from 'react';
import { FileText, MapPin, Home, Calculator, Printer, Eye } from 'lucide-react';

interface Owner {
  name: string;
  share: string;
  id: string;
}

interface ValuationItem {
  description: string;
  unit: string;
  condition: string;
  area: number;
  rate: number;
  depRate: number;
}

interface SiteWorkItem {
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  depRate: number;
}

interface Building {
  name: string;
  foundation: string;
  floorFinishing: string;
  walls: string;
  windows: string;
  doors: string;
  wallFinishing: string;
  ceiling: string;
  roofMember: string;
  roofCovering: string;
  condition: string;
  accommodation: {
    livingRoom: number;
    dining: number;
    kitchen: number;
    bedrooms: number;
    showerRooms: number;
    bathRooms: number;
    store: number;
    office: number;
    other: number;
  };
}

interface FormData {
  verbalInstructor: string;
  writtenInstructor: string;
  inspectionDate: string;
  purposes: {
    bank: boolean;
    auction: boolean;
    court: boolean;
    bookkeeping: boolean;
    visa: boolean;
    insurance: boolean;
  };
  banks: {
    ecobank: boolean;
    bankOfKigali: boolean;
    bpr: boolean;
    equity: boolean;
    access: boolean;
    saccoKicukiro: boolean;
    saccoGasabo: boolean;
  };
  village: string;
  cell: string;
  sector: string;
  district: string;
  province: string;
  upi: string;
  coordinates: string;
  tenure: string;
  years: string;
  startDate: string;
  owners: Owner[];
  landTitle: string;
  currentUse: string;
  plotSize: string;
  plotShape: string;
  access: string;
  electricity: boolean;
  water: boolean;
  internet: boolean;
  buildings: Building[];
  valuationData: ValuationItem[];
  siteWorkData: SiteWorkItem[];
  landRate: number;
  landArea: number;
}

const PropertyValuationForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('instructions');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    // Instructions Section
    verbalInstructor: 'NIYITEGEKA DAMASCENE',
    writtenInstructor: '',
    inspectionDate: '2025-08-15',
    purposes: {
      bank: false,
      auction: false,
      court: false,
      bookkeeping: false,
      visa: false,
      insurance: false
    },
    banks: {
      ecobank: false,
      bankOfKigali: false,
      bpr: false,
      equity: false,
      access: false,
      saccoKicukiro: false,
      saccoGasabo: false
    },
    
    // Property Location
    village: 'Ngororero Village',
    cell: 'Kazabe Cell',
    sector: 'Ngororero Sector',
    district: 'Ngororero District',
    province: 'Western Province',
    upi: '1/03/05/04/259',
    coordinates: '1.9770464,30.1006159',
    
    // Tenure Details
    tenure: 'Emphyteutic Lease',
    years: '43',
    startDate: '2023-12-02',
    owners: [
      { name: 'MUHAWENIMANA JOSELINE', share: '50%', id: '1 198570102014070' },
      { name: 'NIYITEGEKA DAMASCENE', share: '50%', id: '1 198580102018020' }
    ],
    landTitle: 'Residential',
    currentUse: 'Residential',
    plotSize: '976',
    plotShape: 'Rectangular',
    
    // Services & Site Works
    access: 'Tarmac road',
    electricity: true,
    water: true,
    internet: true,
    
    // Building Details
    buildings: [{
      name: 'Main House',
      foundation: 'Cement & sand mortar and stones',
      floorFinishing: 'Ceramic tiles',
      walls: 'Cement blocks',
      windows: 'Aluminum steel casement type',
      doors: 'Plywood & flush timber doors',
      wallFinishing: 'Plastered & rendered with cement & sand mortar',
      ceiling: 'Gypsum panels & boards',
      roofMember: 'Double pitched',
      roofCovering: 'Modern tiles',
      condition: 'Good & strong structure',
      accommodation: {
        livingRoom: 1,
        dining: 1,
        kitchen: 1,
        bedrooms: 3,
        showerRooms: 2,
        bathRooms: 1,
        store: 1,
        office: 0,
        other: 0
      }
    }],
    
    // Valuation Data
    valuationData: [
      { description: 'Main house (Main area)', unit: 'sqm', condition: 'Good', area: 248.99, rate: 250000, depRate: 6 },
      { description: 'Main house (Porch area)', unit: 'sqm', condition: 'Good', area: 55.17, rate: 250000, depRate: 6 },
      { description: 'Annex house', unit: 'sqm', condition: 'Good', area: 15.12, rate: 200000, depRate: 6 },
      { description: 'Gate house', unit: 'sqm', condition: 'Fair', area: 6.25, rate: 170000, depRate: 6 },
      { description: 'Bungalow house', unit: 'sqm', condition: 'Good', area: 12.58, rate: 200000, depRate: 6 }
    ],
    siteWorkData: [
      { description: 'Entrance gate', unit: 'Pcs', quantity: 1, rate: 800000, depRate: 6 },
      { description: 'Water tanks & stands', unit: 'Pcs', quantity: 2, rate: 400000, depRate: 6 },
      { description: 'Paved (pavers)', unit: 'sqm', quantity: 152, rate: 25000, depRate: 10 },
      { description: 'Boundary walls', unit: 'Lm', quantity: 126, rate: 80000, depRate: 6 }
    ],
    landRate: 225000,
    landArea: 1107
  });

  const updateFormData = <K extends keyof FormData>(
  section: K,
  field: string,
  value: any
): void => {
  setFormData(prev => ({
    ...prev,
    [section]: {
      ...(prev[section] as object),
      [field]: value
    }
  }));
};

  const calculateValues = () => {
    const buildingTotal = formData.valuationData.reduce((sum, item) => {
      const replacementCost = item.area * item.rate;
      const depreciatedValue = replacementCost * (1 - item.depRate / 100);
      return sum + depreciatedValue;
    }, 0);

    const siteWorkTotal = formData.siteWorkData.reduce((sum, item) => {
      const replacementCost = item.quantity * item.rate;
      const depreciatedValue = replacementCost * (1 - item.depRate / 100);
      return sum + depreciatedValue;
    }, 0);

    const landValue = formData.landArea * formData.landRate;
    const openMarketValue = buildingTotal + siteWorkTotal + landValue;
    const forcedSaleValue = openMarketValue * 0.7;
    const insuranceValue = buildingTotal + siteWorkTotal;

    return { buildingTotal, siteWorkTotal, landValue, openMarketValue, forcedSaleValue, insuranceValue };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const numberToWords = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} Billion`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} Million`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} Thousand`;
    return num.toString();
  };

  const tabs = [
    { id: 'instructions', label: 'Instructions', icon: FileText },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'property', label: 'Property Details', icon: Home },
    { id: 'valuation', label: 'Valuation', icon: Calculator }
  ];

  const printReport = (): void => {
    const printContent = document.getElementById('printable-report');
    if (!printContent) {
      alert('Report content not found. Please try again.');
      return;
    }

    const windowPrint = window.open('', '', 'width=900,height=650');
    if (!windowPrint) {
      alert('Unable to open print window. Please check your browser settings.');
      return;
    }

    try {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Property Valuation Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
              th { background-color: #f5f3ff; font-weight: bold; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 25px; }
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
              .value-box { border: 2px solid #8b5cf6; padding: 15px; text-align: center; border-radius: 8px; }
              .signature-area { margin-top: 40px; text-align: center; }
              @media print {
                body { print-color-adjust: exact; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>${printContent.innerHTML}</body>
        </html>
      `);
      windowPrint.document.close();
      windowPrint.focus();
      windowPrint.print();
      windowPrint.close();
    } catch (error) {
      console.error('Print error:', error);
      alert('An error occurred while preparing the report for printing.');
      windowPrint.close();
    }
  };

  const renderInstructionsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Verbal Instructions Given By</label>
          <input
            type="text"
            value={formData.verbalInstructor}
            onChange={(e) => setFormData(prev => ({ ...prev, verbalInstructor: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Written Instructions Given By</label>
          <input
            type="text"
            value={formData.writtenInstructor}
            onChange={(e) => setFormData(prev => ({ ...prev, writtenInstructor: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-violet-200 text-sm font-medium mb-2">Inspection Date</label>
        <input
          type="date"
          value={formData.inspectionDate}
          onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
          className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-violet-200 text-sm font-medium mb-4">Purposes</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.purposes).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer hover:bg-violet-900 hover:bg-opacity-20 p-2 rounded transition-colors duration-200">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateFormData('purposes', key, e.target.checked)}
                className="w-4 h-4 text-violet-400 bg-black bg-opacity-30 border-violet-700 rounded focus:ring-violet-400 focus:ring-2"
              />
              <span className="text-violet-200 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-violet-200 text-sm font-medium mb-4">Banks</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.banks).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer hover:bg-violet-900 hover:bg-opacity-20 p-2 rounded transition-colors duration-200">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateFormData('banks', key, e.target.checked)}
                className="w-4 h-4 text-violet-400 bg-black bg-opacity-30 border-violet-700 rounded focus:ring-violet-400 focus:ring-2"
              />
              <span className="text-violet-200 text-sm uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLocationTab = ()=> (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Village</label>
          <input
            type="text"
            value={formData.village}
            onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Cell</label>
          <input
            type="text"
            value={formData.cell}
            onChange={(e) => setFormData(prev => ({ ...prev, cell: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Sector</label>
          <input
            type="text"
            value={formData.sector}
            onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">District</label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Province</label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Property UPI</label>
          <input
            type="text"
            value={formData.upi}
            onChange={(e) => setFormData(prev => ({ ...prev, upi: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-violet-200 text-sm font-medium mb-2">Geographic Coordinates</label>
        <input
          type="text"
          value={formData.coordinates}
          onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
          className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          placeholder="latitude,longitude"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Plot Size (sqm)</label>
          <input
            type="number"
            value={formData.plotSize}
            onChange={(e) => setFormData(prev => ({ ...prev, plotSize: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Plot Shape</label>
          <select
            value={formData.plotShape}
            onChange={(e) => setFormData(prev => ({ ...prev, plotShape: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          >
            <option value="Rectangular">Rectangular</option>
            <option value="Square">Square</option>
            <option value="Triangle">Triangle</option>
            <option value="Trapezoidal">Trapezoidal</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPropertyTab = ()=> (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Tenure</label>
          <input
            type="text"
            value={formData.tenure}
            onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-violet-200 text-sm font-medium mb-2">Years</label>
          <input
            type="number"
            value={formData.years}
            onChange={(e) => setFormData(prev => ({ ...prev, years: e.target.value }))}
            className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-violet-200 text-sm font-medium mb-2">Start Date</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-violet-200 text-sm font-medium mb-4">Property Owners</label>
        {formData.owners.map((owner, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-black bg-opacity-20 rounded-lg border border-violet-700 border-opacity-30">
            <input
              type="text"
              placeholder="Owner Name"
              value={owner.name}
              onChange={(e) => {
                const newOwners = [...formData.owners];
                newOwners[index].name = e.target.value;
                setFormData(prev => ({ ...prev, owners: newOwners }));
              }}
              className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Share %"
              value={owner.share}
              onChange={(e) => {
                const newOwners = [...formData.owners];
                newOwners[index].share = e.target.value;
                setFormData(prev => ({ ...prev, owners: newOwners }));
              }}
              className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="ID Number"
              value={owner.id}
              onChange={(e) => {
                const newOwners = [...formData.owners];
                newOwners[index].id = e.target.value;
                setFormData(prev => ({ ...prev, owners: newOwners }));
              }}
              className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-violet-200 text-sm font-medium mb-4">Services Available</label>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center space-x-3 cursor-pointer hover:bg-violet-900 hover:bg-opacity-20 p-2 rounded transition-colors duration-200">
            <input
              type="checkbox"
              checked={formData.electricity}
              onChange={(e) => setFormData(prev => ({ ...prev, electricity: e.target.checked }))}
              className="w-4 h-4 text-violet-400 bg-black bg-opacity-30 border-violet-700 rounded focus:ring-violet-400 focus:ring-2"
            />
            <span className="text-violet-200">Electricity</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer hover:bg-violet-900 hover:bg-opacity-20 p-2 rounded transition-colors duration-200">
            <input
              type="checkbox"
              checked={formData.water}
              onChange={(e) => setFormData(prev => ({ ...prev, water: e.target.checked }))}
              className="w-4 h-4 text-violet-400 bg-black bg-opacity-30 border-violet-700 rounded focus:ring-violet-400 focus:ring-2"
            />
            <span className="text-violet-200">Water</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer hover:bg-violet-900 hover:bg-opacity-20 p-2 rounded transition-colors duration-200">
            <input
              type="checkbox"
              checked={formData.internet}
              onChange={(e) => setFormData(prev => ({ ...prev, internet: e.target.checked }))}
              className="w-4 h-4 text-violet-400 bg-black bg-opacity-30 border-violet-700 rounded focus:ring-violet-400 focus:ring-2"
            />
            <span className="text-violet-200">Internet</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderValuationTab = ()=> {
    const { buildingTotal, siteWorkTotal, landValue, openMarketValue, forcedSaleValue, insuranceValue } = calculateValues();

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-violet-200 mb-4">Building Valuation</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-violet-700 border-opacity-50 rounded-lg">
              <thead>
                <tr className="bg-violet-900 bg-opacity-30">
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Description</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Area (m²)</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Rate/m²</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Replacement Cost</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Dep %</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Value</th>
                </tr>
              </thead>
              <tbody>
                {formData.valuationData.map((item, index) => {
                  const replacementCost = item.area * item.rate;
                  const depreciatedValue = replacementCost * (1 - item.depRate / 100);
                  return (
                    <tr key={index} className="bg-black bg-opacity-20 hover:bg-violet-900 hover:bg-opacity-20 transition-colors duration-200">
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{item.description}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{item.area}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{formatCurrency(item.rate)}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{formatCurrency(replacementCost)}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{item.depRate}%</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm font-semibold">{formatCurrency(depreciatedValue)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-violet-900 bg-opacity-50 font-bold">
                  <td colSpan={5} className="border border-violet-700 border-opacity-50 p-3 text-violet-200 text-sm">Building Sub-total</td>
                  <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm font-bold">{formatCurrency(buildingTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-violet-200 mb-4">Site Work Valuation</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-violet-700 border-opacity-50 rounded-lg">
              <thead>
                <tr className="bg-violet-900 bg-opacity-30">
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Description</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Quantity</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Rate</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Replacement Cost</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Dep %</th>
                  <th className="border border-violet-700 border-opacity-50 p-3 text-left text-violet-200 text-sm">Value</th>
                </tr>
              </thead>
              <tbody>
                {formData.siteWorkData.map((item, index) => {
                  const replacementCost = item.quantity * item.rate;
                  const depreciatedValue = replacementCost * (1 - item.depRate / 100);
                  return (
                    <tr key={index} className="bg-black bg-opacity-20 hover:bg-violet-900 hover:bg-opacity-20 transition-colors duration-200">
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{item.description}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{item.quantity}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{formatCurrency(item.rate)}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{formatCurrency(replacementCost)}</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm">{item.depRate}%</td>
                      <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm font-semibold">{formatCurrency(depreciatedValue)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-violet-900 bg-opacity-50 font-bold">
                  <td colSpan={5} className="border border-violet-700 border-opacity-50 p-3 text-violet-200 text-sm">Site Work Sub-total</td>
                  <td className="border border-violet-700 border-opacity-50 p-3 text-white text-sm font-bold">{formatCurrency(siteWorkTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-violet-200 text-sm font-medium mb-2">Land Area (sqm)</label>
            <input
              type="number"
              value={formData.landArea}
              onChange={(e) => setFormData(prev => ({ ...prev, landArea: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-violet-200 text-sm font-medium mb-2">Land Rate per sqm</label>
            <input
              type="number"
              value={formData.landRate}
              onChange={(e) => setFormData(prev => ({ ...prev, landRate: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-black bg-opacity-30 border border-violet-700 border-opacity-50 rounded-lg text-white focus:border-violet-400 focus:outline-none transition-colors duration-200"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-900 from-opacity-30 to-purple-900 to-opacity-30 p-6 rounded-lg border border-violet-700 border-opacity-50">
          <h3 className="text-2xl font-bold text-violet-200 mb-6">Final Valuation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-violet-600 border-opacity-50">
              <h4 className="text-violet-300 font-semibold mb-2">Land Value</h4>
              <p className="text-2xl font-bold text-white">{formatCurrency(landValue)}</p>
            </div>
            <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-green-600 border-opacity-50">
              <h4 className="text-violet-300 font-semibold mb-2">Open Market Value</h4>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(openMarketValue)}</p>
            </div>
            <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-yellow-600 border-opacity-50">
              <h4 className="text-violet-300 font-semibold mb-2">Forced Sale Value</h4>
              <p className="text-2xl font-bold text-yellow-400">{formatCurrency(forcedSaleValue)}</p>
            </div>
            <div className="bg-black bg-opacity-30 p-4 rounded-lg border border-blue-600 border-opacity-50 md:col-span-2 lg:col-span-1">
              <h4 className="text-violet-300 font-semibold mb-2">Insurance Value</h4>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(insuranceValue)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = ()=> {
    const { buildingTotal, siteWorkTotal, landValue, openMarketValue, forcedSaleValue, insuranceValue } = calculateValues();
    
    return (
      <div className="bg-white text-black p-8 max-w-4xl mx-auto" id="printable-report">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-violet-800">PROPERTY VALUATION REPORT</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-violet-600 to-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Professional Valuation Certificate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-violet-800">Property Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Location:</strong> {formData.village}, {formData.cell}, {formData.sector}</p>
              <p><strong>District:</strong> {formData.district}, {formData.province}</p>
              <p><strong>UPI:</strong> {formData.upi}</p>
              <p><strong>Plot Size:</strong> {formData.plotSize} sqm</p>
              <p><strong>Tenure:</strong> {formData.tenure}</p>
              <p><strong>Coordinates:</strong> {formData.coordinates}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3 text-violet-800">Valuation Instructions</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Verbal Instructions:</strong> {formData.verbalInstructor}</p>
              <p><strong>Written Instructions:</strong> {formData.writtenInstructor}</p>
              <p><strong>Inspection Date:</strong> {formData.inspectionDate}</p>
              <p><strong>Purposes:</strong> {Object.entries(formData.purposes).filter(([_, value]) => value).map(([key, _]) => key).join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-violet-800">Property Owners</h3>
          <table className="w-full border border-gray-300">
            <thead className="bg-violet-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left text-sm">Owner Name</th>
                <th className="border border-gray-300 p-2 text-left text-sm">Share</th>
                <th className="border border-gray-300 p-2 text-left text-sm">ID Number</th>
              </tr>
            </thead>
            <tbody>
              {formData.owners.map((owner, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-sm">{owner.name}</td>
                  <td className="border border-gray-300 p-2 text-sm">{owner.share}</td>
                  <td className="border border-gray-300 p-2 text-sm">{owner.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-violet-800">Building Valuation</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-violet-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left text-xs">Description</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Area (m²)</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Rate/m²</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Replacement Cost</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Dep %</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Value (RWF)</th>
                </tr>
              </thead>
              <tbody>
                {formData.valuationData.map((item, index) => {
                  const replacementCost = item.area * item.rate;
                  const depreciatedValue = replacementCost * (1 - item.depRate / 100);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-xs">{item.description}</td>
                      <td className="border border-gray-300 p-2 text-xs">{item.area.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2 text-xs">{item.rate.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2 text-xs">{replacementCost.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2 text-xs">{item.depRate}%</td>
                      <td className="border border-gray-300 p-2 text-xs font-semibold">{depreciatedValue.toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr className="bg-violet-50 font-bold">
                  <td colSpan={5} className="border border-gray-300 p-2 text-violet-800 text-sm">Building Sub-total</td>
                  <td className="border border-gray-300 p-2 text-violet-800 text-sm">{buildingTotal.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-violet-800">Site Work Valuation</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-violet-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left text-xs">Description</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Quantity</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Rate</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Replacement Cost</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Dep %</th>
                  <th className="border border-gray-300 p-2 text-left text-xs">Value (RWF)</th>
                </tr>
              </thead>
              <tbody>
                {formData.siteWorkData.map((item, index) => {
                  const replacementCost = item.quantity * item.rate;
                  const depreciatedValue = replacementCost * (1 - item.depRate / 100);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-xs">{item.description}</td>
                      <td className="border border-gray-300 p-2 text-xs">{item.quantity}</td>
                      <td className="border border-gray-300 p-2 text-xs">{item.rate.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2 text-xs">{replacementCost.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2 text-xs">{item.depRate}%</td>
                      <td className="border border-gray-300 p-2 text-xs font-semibold">{depreciatedValue.toLocaleString()}</td>
                    </tr>
                  );
                })}
                <tr className="bg-violet-50 font-bold">
                  <td colSpan={5} className="border border-gray-300 p-2 text-violet-800 text-sm">Site Work Sub-total</td>
                  <td className="border border-gray-300 p-2 text-violet-800 text-sm">{siteWorkTotal.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-violet-800">Land Valuation</h3>
          <div className="bg-violet-50 p-4 rounded border border-violet-200">
            <p className="mb-2 text-sm"><strong>Land Area:</strong> {formData.landArea} sqm</p>
            <p className="mb-2 text-sm"><strong>Rate per sqm:</strong> RWF {formData.landRate.toLocaleString()}</p>
            <p className="text-lg font-bold text-violet-800"><strong>Land Value:</strong> RWF {landValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-xl mb-6 text-center text-violet-800">VALUATION CERTIFICATE</h3>
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg border-2 border-violet-300">
            <p className="mb-4 text-center text-sm leading-relaxed">
              Based on given instructions, purpose and basis of valuation, property itself and our assumptions, 
              we have valued the subject property situated within {formData.village}, {formData.cell}, {formData.sector}, 
              {formData.district} in {formData.province}, registered under UPI: {formData.upi} as follows:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded border-2 border-green-200 shadow-sm">
                <h4 className="font-bold text-violet-800 mb-2 text-sm">OPEN MARKET VALUE</h4>
                <p className="text-xl font-bold text-green-600 mb-1">RWF {openMarketValue.toLocaleString()}</p>
                <p className="text-xs text-gray-600">({numberToWords(openMarketValue)})</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded border-2 border-orange-200 shadow-sm">
                <h4 className="font-bold text-violet-800 mb-2 text-sm">FORCED SALE VALUE</h4>
                <p className="text-xl font-bold text-orange-600 mb-1">RWF {forcedSaleValue.toLocaleString()}</p>
                <p className="text-xs text-gray-600">({numberToWords(forcedSaleValue)})</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded border-2 border-blue-200 shadow-sm">
                <h4 className="font-bold text-violet-800 mb-2 text-sm">INSURANCE VALUE</h4>
                <p className="text-xl font-bold text-blue-600 mb-1">RWF {insuranceValue.toLocaleString()}</p>
                <p className="text-xs text-gray-600">({numberToWords(insuranceValue)})</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-violet-800 mb-3">Valuation Methodology</h4>
            <div className="text-sm space-y-2 text-gray-700">
              <p><strong>Market Value:</strong> Estimated amount for exchange between willing parties</p>
              <p><strong>Forced Sale Value:</strong> 70% of Open Market Value for auction purposes</p>
              <p><strong>Insurance Value:</strong> Replacement cost excluding land value</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-violet-800 mb-3">General Remarks</h4>
            <div className="text-sm space-y-2 text-gray-700">
              <p>The subject property is a modern residential house with good fittings and finishes.</p>
              <p>Located in a predominantly residential area with access to essential services.</p>
              <p>The property has zero mortgage and zero caveat as per Rwanda Land Management Authority.</p>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-violet-300 pt-6">
          <div className="text-center">
            <p className="font-bold text-lg mb-2 text-violet-800">NIYONGOMBWA Phocas</p>
            <p className="text-sm mb-1 text-gray-600">IRPV Certified & Practicing Valuer</p>
            <p className="text-sm mb-4 text-gray-600">For & On Behalf of Tower Property Consultancy Ltd</p>
            <div className="w-48 h-1 bg-violet-300 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Signature & Stamp</p>
            <p className="text-sm mt-4 text-gray-500">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-black relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 w-32 h-32 bg-violet-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-violet-600 rounded-full blur-3xl animate-pulse opacity-30"></div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-violet-700 border-opacity-50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Property Valuation Report Generator</h1>
              <p className="text-violet-300">Professional Real Estate Valuation Tool</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-lg ${
                showPreview
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'bg-black bg-opacity-30 text-violet-300 border border-violet-700 border-opacity-50 hover:bg-violet-900 hover:bg-opacity-30'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Edit Form' : 'Preview Report'}</span>
            </button>
            {showPreview && (
              <button
                onClick={printReport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {!showPreview ? (
            <>
              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500 shadow-opacity-25'
                          : 'bg-black bg-opacity-30 text-violet-300 border border-violet-700 border-opacity-50 hover:bg-violet-900 hover:bg-opacity-30 hover:border-violet-600 hover:border-opacity-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <div className="bg-black bg-opacity-20 backdrop-blur-xl rounded-2xl border border-violet-700 border-opacity-50 p-8 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                </div>

                {activeTab === 'instructions' && renderInstructionsTab()}
                {activeTab === 'location' && renderLocationTab()}
                {activeTab === 'property' && renderPropertyTab()}
                {activeTab === 'valuation' && renderValuationTab()}
              </div>
            </>
          ) : (
            renderPreview()
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyValuationForm;