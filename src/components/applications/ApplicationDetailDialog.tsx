import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Printer,
  Shield,
} from "lucide-react";
import { Application } from "@/types/application";
import { cn } from "@/lib/utils";

interface ApplicationDetailDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify?: (application: Application) => void;
  onReject?: (application: Application) => void;
}

export const ApplicationDetailDialog = ({
  application,
  open,
  onOpenChange,
  onVerify,
  onReject,
}: ApplicationDetailDialogProps) => {
  if (!application) return null;

  const { personalDetails, contactInfo, qualifications, experience, publications, documents, payment } = application;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Application No.</p>
              <DialogTitle className="text-xl font-mono text-primary mt-1">
                {application.applicationNo}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{application.vacancyTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn(
                  application.status === "complete" && "bg-success/10 text-success border-success/20",
                  application.status === "incomplete" && "bg-destructive/10 text-destructive border-destructive/20",
                  application.status === "pending" && "bg-warning/10 text-warning border-warning/20",
                  application.status === "verified" && "bg-primary/10 text-primary border-primary/20",
                )}
              >
                {application.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Personal Details */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-primary" />
                Personal Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{personalDetails.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Father's Name:</span>
                  <p className="font-medium">{personalDetails.fatherName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mother's Name:</span>
                  <p className="font-medium">{personalDetails.motherName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <p className="font-medium">{personalDetails.dateOfBirth} (Age: {personalDetails.age})</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <p className="font-medium capitalize">{personalDetails.gender}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium uppercase">{personalDetails.category}{personalDetails.pwbd ? " (PwBD)" : ""}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nationality:</span>
                  <p className="font-medium">{personalDetails.nationality}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Marital Status:</span>
                  <p className="font-medium">{personalDetails.maritalStatus}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Contact Information */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4 text-primary" />
                Contact Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Mobile:</span>
                    <p className="font-medium">{contactInfo.mobile}</p>
                  </div>
                </div>
                {contactInfo.altMobile && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Alt. Mobile:</span>
                      <p className="font-medium">{contactInfo.altMobile}</p>
                    </div>
                  </div>
                )}
                <div className="col-span-full flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p className="font-medium">{contactInfo.address}, {contactInfo.city}, {contactInfo.state} - {contactInfo.pincode}</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Educational Qualifications */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <GraduationCap className="h-4 w-4 text-primary" />
                Educational Qualifications
              </h3>
              <div className="space-y-3">
                {qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{qual.degree}</p>
                      <p className="text-sm text-muted-foreground">{qual.university} • {qual.year} • {qual.percentage}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary">
                      <FileText className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>

              {application.netGateQualification && (
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary">
                        UGC-{application.netGateQualification.type}: Qualified ({application.netGateQualification.year})
                      </p>
                      <p className="text-sm text-muted-foreground">Roll No: {application.netGateQualification.rollNo}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                </div>
              )}
            </section>

            <Separator />

            {/* Experience */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <Briefcase className="h-4 w-4 text-primary" />
                Experience
              </h3>
              <div className="space-y-3">
                {experience.map((exp, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{exp.position}</p>
                      <p className="text-sm text-muted-foreground">{exp.institution} • {exp.duration} ({exp.years} years)</p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary">
                      <FileText className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Publications */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary" />
                Research & Publications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-foreground">{publications.total}</p>
                  <p className="text-xs text-muted-foreground">Total Publications</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-primary">{publications.international}</p>
                  <p className="text-xs text-muted-foreground">International Journals</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-foreground">{publications.national}</p>
                  <p className="text-xs text-muted-foreground">National Journals</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-foreground">{publications.conferences}</p>
                  <p className="text-xs text-muted-foreground">Conferences</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Uploaded Documents */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary" />
                Uploaded Documents
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {documents.map((doc, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-sm",
                      doc.uploaded ? "bg-success/10" : "bg-destructive/10"
                    )}
                  >
                    {doc.uploaded ? (
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <span className={cn(
                      "truncate",
                      doc.uploaded ? "text-success" : "text-destructive"
                    )}>{doc.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Payment Details */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Details
              </h3>
              <div className={cn(
                "p-4 rounded-lg border",
                payment.status === "success" && "bg-success/5 border-success/20",
                payment.status === "pending" && "bg-warning/5 border-warning/20",
                payment.status === "failed" && "bg-destructive/5 border-destructive/20",
              )}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <p className="font-mono font-medium">{payment.transactionId || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-medium">₹{payment.amount}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="font-medium">{payment.date || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mode:</span>
                    <p className="font-medium">{payment.mode || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-muted-foreground text-sm">Status:</span>
                  <Badge className={cn(
                    "uppercase",
                    payment.status === "success" && "bg-success text-success-foreground",
                    payment.status === "pending" && "bg-warning text-warning-foreground",
                    payment.status === "failed" && "bg-destructive text-destructive-foreground",
                  )}>
                    {payment.status === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {payment.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                    {payment.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </section>

            <Separator />

            {/* Declaration */}
            <section>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-primary" />
                Declaration
              </h3>
              <div className="p-4 rounded-lg bg-muted/50 text-sm">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                  I hereby declare that all information provided is correct to the best of my knowledge.
                </p>
                <div className="mt-3 text-muted-foreground text-xs">
                  <p>Submitted on: {application.submittedOn}</p>
                  <p>IP Address: {application.ipAddress}</p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {application.verificationStatus !== "verified" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onReject?.(application)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-success hover:bg-success/90"
                  onClick={() => onVerify?.(application)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Verify
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
