import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Application, ApplicationStatus } from "@/types/application";
import { cn } from "@/lib/utils";

interface ApplicationListTableProps {
  applications: Application[];
  onView: (application: Application) => void;
}

const statusConfig: Record<ApplicationStatus, { label: string; icon: React.ReactNode; className: string }> = {
  complete: {
    label: "Complete",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    className: "bg-success/10 text-success border-success/20",
  },
  incomplete: {
    label: "Incomplete",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  pending: {
    label: "Pending",
    icon: <Clock className="h-3.5 w-3.5" />,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  verified: {
    label: "Verified",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="h-3.5 w-3.5" />,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  shortlisted: {
    label: "Shortlisted",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    className: "bg-success/10 text-success border-success/20",
  },
};

const feeStatusConfig = {
  success: { label: "Paid", icon: "✅", className: "text-success" },
  pending: { label: "Pending", icon: "⏳", className: "text-warning" },
  failed: { label: "Failed", icon: "❌", className: "text-destructive" },
};

export const ApplicationListTable = ({
  applications,
  onView,
}: ApplicationListTableProps) => {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Application No.</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold text-center">Fee</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Submitted</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const status = statusConfig[application.status];
            const feeStatus = feeStatusConfig[application.payment.status];
            
            return (
              <TableRow
                key={application.id}
                className="transition-colors hover:bg-muted/30 cursor-pointer"
                onClick={() => onView(application)}
              >
                <TableCell>
                  <span className="font-mono font-medium text-primary">
                    {application.applicationNo}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{application.personalDetails.name}</p>
                    <p className="text-xs text-muted-foreground">{application.contactInfo.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase text-xs">
                    {application.personalDetails.category}
                    {application.personalDetails.pwbd && " (PwBD)"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("text-lg", feeStatus.className)}>
                    {feeStatus.icon}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("gap-1", status.className)}>
                    {status.icon}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {application.submittedOn.split(",")[0]}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(application);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="font-medium text-foreground">No applications found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};
