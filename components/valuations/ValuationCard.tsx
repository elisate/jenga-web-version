import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { ValuationListItem } from "@/types/valuations";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  MapPin,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ValuationCardProps {
  valuation: ValuationListItem;
  onDelete?: (
    id: number
  ) => Promise<{ success: boolean; error: string | null }>;
}

export function ValuationCard({ valuation, onDelete }: ValuationCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // PDF generation hook
  const { isGenerating, downloadPDF, previewPDF } = usePDFGeneration({
    valuationId: valuation.id,
  });

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      const result = await onDelete(valuation.id);
      if (result.success) {
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting valuation:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "finalized":
        return "bg-green-100 text-green-800 border-green-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "finalized":
        return <CheckCircle className="w-4 h-4" />;
      case "under_review":
        return <Clock className="w-4 h-4" />;
      case "draft":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "finalized":
        return "Finalized";
      case "under_review":
        return "Under Review";
      case "draft":
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const getPurposeLabel = (purpose: string | null) => {
    if (!purpose) return "-";
    return (
      purpose.charAt(0).toUpperCase() + purpose.slice(1).replace(/_/g, " ")
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-slate-800">
                {valuation.propertyAddress}
              </h3>
              <Badge className={`${getStatusColor(valuation.status)}`}>
                {getStatusIcon(valuation.status)}
                <span className="ml-1">{getStatusLabel(valuation.status)}</span>
              </Badge>
              {valuation.purpose && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{getPurposeLabel(valuation.purpose)}</span>
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {valuation.clientName}
                  </p>
                  <p className="text-xs text-slate-600">
                    {valuation.clientContact || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {valuation.location}
                  </p>
                  <p className="text-xs text-slate-600">
                    UPI: {valuation.propertyUPI}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(valuation.valuationDate)}
                  </p>
                  <p className="text-xs text-slate-600">Valuation Date</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-xs text-slate-600">
                <span className="font-medium">Created:</span>{" "}
                {formatDate(valuation.createdAt)}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-medium">Inspection:</span>{" "}
                {formatDate(valuation.inspectionDate)}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-medium">Instruction:</span>{" "}
                {formatDate(valuation.instructionDate)}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-medium">Condition:</span>{" "}
                {valuation.propertyCondition}
              </div>
            </div>

            {(valuation.generalNotes || valuation.assessmentNotes) && (
              <p className="text-sm text-slate-600 mt-3">
                {valuation.generalNotes || valuation.assessmentNotes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Link href={`/dashboard/valuations/${valuation.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-slate-200"
                title="Edit Valuation"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={previewPDF}
              disabled={isGenerating}
              className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
              title="Preview PDF"
            >
              <Eye className="w-4 h-4" color="blue" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={downloadPDF}
              disabled={isGenerating}
              className="border-2 border-green-200 hover:border-green-300 hover:bg-green-50"
              title="Download PDF"
            >
              <Download className="w-4 h-4" color="green" />
            </Button>

            {onDelete && (
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 "
                  >
                    <Trash2 className="w-4 h-4" color="red" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader className="space-y-2">
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                      <Trash2 className="w-5 h-5" />
                      Delete Valuation
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                      Are you sure you want to delete this valuation for{" "}
                      <span className="font-semibold">
                        {valuation.propertyAddress}
                      </span>
                      ?
                      <br />
                      <span className="text-red-600 text-sm">
                        This action cannot be undone and will permanently remove
                        all valuation data.
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
