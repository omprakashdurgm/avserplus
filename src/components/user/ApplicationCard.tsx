import { CandidateApplication } from "@/types/candidate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationTracker } from "./ApplicationTracker";
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Download, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Timer
} from "lucide-react";

interface ApplicationCardProps {
  application: CandidateApplication;
  onViewDetails: (app: CandidateApplication) => void;
}

export const ApplicationCard = ({ application, onViewDetails }: ApplicationCardProps) => {
  const getStatusBadge = () => {
    switch (application.status) {
      case "selected":
        return <Badge className="bg-success text-success-foreground text-[10px] sm:text-xs">Selected</Badge>;
      case "waitlisted":
        return <Badge className="bg-warning text-warning-foreground text-[10px] sm:text-xs">Waitlisted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="text-[10px] sm:text-xs">Not Selected</Badge>;
      case "withdrawn":
        return <Badge variant="secondary" className="text-[10px] sm:text-xs">Withdrawn</Badge>;
      default:
        return <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs">In Progress</Badge>;
    }
  };

  const getCurrentAction = () => {
    if (application.offerDetails?.responseStatus === "pending") {
      return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
          <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-success">Action Required: Accept Offer</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Deadline: {new Date(application.offerDetails.acceptanceDeadline).toLocaleDateString("en-IN")}
            </p>
          </div>
          <Button size="sm" className="bg-success hover:bg-success/90 w-full sm:w-auto text-xs h-8">
            Accept Offer
          </Button>
        </div>
      );
    }

    if (application.interviewDetails && !application.interviewDetails.marksObtained) {
      return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Timer className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-primary">Upcoming Interview</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {new Date(application.interviewDetails.interviewDate).toLocaleDateString("en-IN")} at {application.interviewDetails.interviewTime}
            </p>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs h-8">View Details</Button>
        </div>
      );
    }

    if (application.examDetails && !application.examDetails.marksObtained) {
      return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-warning">Upcoming Examination</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {new Date(application.examDetails.examDate).toLocaleDateString("en-IN")} at {application.examDetails.examTime}
            </p>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs h-8">
            <Download className="h-3 w-3 mr-1" />
            Admit Card
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="overflow-hidden hover:shadow-card transition-shadow">
      <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                {application.applicationNo}
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2">{application.vacancyTitle}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{application.department}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(application)}
            className="flex-shrink-0 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
        {/* Quick Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Applied: {new Date(application.appliedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
          {application.examDetails?.venue && (
            <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate max-w-[180px]">{application.examDetails.venue}</span>
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="py-1">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-2">Progress</p>
          <ApplicationTracker stages={application.stageProgress} compact />
        </div>

        {/* Current Action */}
        {getCurrentAction()}

        {/* Documents Available */}
        {application.documents.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {application.documents.length} document(s)
            </span>
            <Button variant="link" size="sm" className="ml-auto h-auto p-0 text-[10px] sm:text-xs">
              View
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
