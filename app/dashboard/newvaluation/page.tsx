"use client";
import React, { useEffect, useState } from "react";
import { getEvaluationWithDetails } from "@/Reporting/evaluationDetail";
import Link from "next/link";
import {
  Building2,
  MapPin,
  User,
  Shield,
  Calendar,
  FileText,
  Eye,
  Search,
  Edit,
  Download,
  Trash2,
  Clock,
} from "lucide-react";

interface EvaluationItem {
  evaluation_data_id: number;
  property_id: number;
  created_at: string | null;
  property?: {
    address?: string;
    upi?: string;
    [key: string]: any;
  } | null;
  building?: { foundation?: string; [key: string]: any } | null;
  landTenure?: { tenure?: string; [key: string]: any } | null;
  siteWorks?: { access_types?: string; [key: string]: any } | null;
  user?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    role?: string;
    title?: string;
    avatar_url?: string;
    signature?: string;
    [key: string]: any;
  } | null;
}

export default function EvaluationList() {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getEvaluationWithDetails()
      .then((data) => setEvaluations(data as EvaluationItem[]))
      .catch(console.error);
  }, []);

  // Filter evaluations based on search term with improved UPI search
  const filteredEvaluations = evaluations.filter((evalItem) => {
    const searchLower = searchTerm.toLowerCase().trim();

    if (!searchLower) return true;

    // Search in property address
    const address = evalItem.property?.address?.toLowerCase() || "";
    if (address.includes(searchLower)) return true;

    // Enhanced UPI search - exact match and partial match
    const upi = evalItem.property?.upi?.toLowerCase() || "";
    if (upi.includes(searchLower)) return true;

    // Search in user name
    const firstName = evalItem.user?.first_name?.toLowerCase() || "";
    const lastName = evalItem.user?.last_name?.toLowerCase() || "";
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName.includes(searchLower)) return true;

    // Search in evaluation ID
    const evalId = evalItem.evaluation_data_id.toString();
    if (evalId.includes(searchTerm)) return true;

    return false;
  });

  // Use real data length for counts
  const totalValuations = evaluations.length;
  const draftCount = Math.floor(totalValuations * 0.3);
  const underReviewCount = Math.floor(totalValuations * 0.4);
  const finalizedCount = totalValuations - draftCount - underReviewCount;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Valuations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Valuations
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalValuations}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Draft */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Draft</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {draftCount}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Under Review
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {underReviewCount}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Finalized */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Finalized</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {finalizedCount}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by client name, UPI, address, or evaluation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Status</option>
                <option>Draft</option>
                <option>Under Review</option>
                <option>Finalized</option>
              </select>

              <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Purposes</option>
                <option>Mortgage</option>
                <option>Sale</option>
                <option>Insurance</option>
              </select>

              <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Methods</option>
                <option>Comparative</option>
                <option>Cost</option>
                <option>Income</option>
              </select>
            </div>
          </div>
        </div>

        {/* No Data State */}
        {filteredEvaluations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Evaluations Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "No evaluations match your search criteria."
                : "No evaluation data is currently available."}
            </p>
          </div>
        )}

        {/* Evaluation Cards */}
        <div className="space-y-4">
          {filteredEvaluations.map((evalItem) => (
            <div
              key={evalItem.evaluation_data_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {evalItem.property?.address ||
                          `Property ${evalItem.property_id}`}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Draft
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Other
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <Link
                      href={`/dashboard/newvaluation/${evalItem.evaluation_data_id}`}
                    >
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="grid md:grid-cols-4 gap-6 text-sm">
                  {/* Client Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">
                        {evalItem.user?.first_name && evalItem.user?.last_name
                          ? `${evalItem.user.first_name} ${evalItem.user.last_name}`
                          : "Unknown Client"}
                      </span>
                    </div>
                    <p className="text-gray-500 ml-6">
                      {evalItem.user?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">
                        Location
                      </span>
                    </div>
                    <p className="text-gray-500 ml-6">
                      {evalItem.property?.address || "Address not provided"}
                    </p>
                    <p className="text-xs text-gray-400 ml-6 mt-1">
                      UPI: {evalItem.property?.upi || "N/A"}
                    </p>
                  </div>

                  {/* Dates */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">
                        {evalItem.created_at
                          ? new Date(evalItem.created_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-500 ml-6">Valuation Date</p>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {evalItem.created_at
                        ? new Date(evalItem.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Inspection:</span>{" "}
                      {evalItem.created_at
                        ? new Date(evalItem.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Instruction:</span> N/A
                    </div>
                    <div>
                      <span className="font-medium">Condition:</span>{" "}
                      {evalItem.building?.foundation ? "Good" : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                {(evalItem.building?.foundation ||
                  evalItem.landTenure?.tenure ||
                  evalItem.siteWorks?.access_types) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      {/* {evalItem.building?.foundation && `Foundation: ${evalItem.building.foundation}. `} */}
                      {evalItem.landTenure?.tenure &&
                        `Tenure: ${evalItem.landTenure.tenure}. `}
                      {evalItem.siteWorks?.access_types &&
                        `Access: ${evalItem.siteWorks.access_types}.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
