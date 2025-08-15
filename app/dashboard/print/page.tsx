"use client";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";

interface Report {
  id: string;
  title: string;
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
    <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
      <span>{report.title}</span>
      <button
        onClick={() => onDownload(report.id)}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Downloading…" : "Download PDF"}
      </button>
    </div>
  );
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingReports, setLoadingReports] = useState(true);

  // Fetch all reports from Supabase
  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const { data, error } = await supabaseClient
        .from("reports")
        .select("id, evaluation_id");
      if (error) throw error;

      const formattedReports = data.map((r: any) => ({
        id: r.id,
        title: r.evaluation_id || `Report ${r.id}`,
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

  // Download PDF directly
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
    <div className="space-y-3">
      {loadingReports ? (
        <p className="text-gray-500">Loading reports…</p>
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
        <p className="text-gray-500">No reports available.</p>
      )}
    </div>
  );
}
