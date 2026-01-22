import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileSpreadsheet, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Mail, 
  AlertCircle,
  Download,
} from "lucide-react";

interface ReportsPanelProps {
  onDownload?: (reportType: string) => void;
}

const reports = [
  {
    id: "summary",
    name: "Application Summary Report",
    description: "Complete overview of all applications",
    icon: FileSpreadsheet,
    format: "Excel",
  },
  {
    id: "category",
    name: "Category-wise List",
    description: "Applications grouped by reservation category",
    icon: FileText,
    format: "PDF",
  },
  {
    id: "fee",
    name: "Fee Collection Report",
    description: "Payment status and transaction details",
    icon: DollarSign,
    format: "Excel",
  },
  {
    id: "progress",
    name: "Daily Progress Chart",
    description: "Application trends and statistics",
    icon: TrendingUp,
    format: "PDF",
  },
  {
    id: "email",
    name: "Applicant Email List",
    description: "Contact details for communication",
    icon: Mail,
    format: "Excel",
  },
  {
    id: "incomplete",
    name: "Incomplete Applications",
    description: "List of applications with missing documents",
    icon: AlertCircle,
    format: "PDF",
  },
];

export const ReportsPanel = ({ onDownload }: ReportsPanelProps) => {
  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Download Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.map((report) => (
          <Button
            key={report.id}
            variant="outline"
            className="w-full justify-start h-auto py-3 px-4"
            onClick={() => onDownload?.(report.id)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <report.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-foreground">{report.name}</p>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                {report.format}
              </span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
