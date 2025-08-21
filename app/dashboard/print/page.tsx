"use client";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import {
  FileText,
  Download,
  Building2,
  User,
  Calendar,
  Loader2,
  FolderOpen,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  property?: string;
  owner?: string;
  created_at?: string;
}

// Component for a single report item
function ReportItem({
  report,
  onDownload,
  loading,
}: {
  report: Report;
  onDownload: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Report Icon */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>

          {/* Report Details */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {report.title}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Property:</span>
                <span>{report.property ?? "Unknown Property"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Owner:</span>
                <span>{report.owner ?? "Unknown Owner"}</span>
              </div>

              {report.created_at && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Created:</span>
                  <span>
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={() => onDownload(report.id)}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Downloading…
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingReports, setLoadingReports] = useState(true);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const { data, error } = await supabaseClient.from("reports").select(`
          id,
          evaluation_id,
          created_at,
          evaluation_data:evaluation_id (
            evaluation_data_id,
            property:property_id ( id, owner, address )
          )
        `);

      if (error) throw error;

      console.log("Fetched reports:", data);

      const formattedReports: Report[] = data.map((r: any) => ({
        id: r.id,
        title: r.evaluation_id
          ? `Evaluation Report ${r.evaluation_id}`
          : `Report ${r.id}`,
        property: r.evaluation_data?.property?.address || "Unknown Property",
        owner: r.evaluation_data?.property?.owner || "Unknown Owner",
        created_at: r.created_at,
      }));

      setReports(formattedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (reportId: string) => {
    try {
      setLoadingId(reportId);
      const res = await fetch(`/api/reports/${reportId}`);
      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">
                Manage and download your evaluation reports
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reports
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingReports ? "..." : reports.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Available for download</p>
                <p className="text-sm font-medium text-green-600">
                  {loadingReports
                    ? "Loading..."
                    : `${reports.length} PDF files`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {loadingReports ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Loading reports…</p>
              </div>
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                onDownload={handleDownload}
                loading={loadingId === report.id}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Reports Available
              </h3>
              <p className="text-gray-500">
                No evaluation reports have been generated yet. Create an
                evaluation to generate your first report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
