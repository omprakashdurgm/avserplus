import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ApplicationStatsCards } from "@/components/applications/ApplicationStatsCards";
import { ApplicationFilters } from "@/components/applications/ApplicationFilters";
import { ApplicationListTable } from "@/components/applications/ApplicationListTable";
import { ApplicationDetailDialog } from "@/components/applications/ApplicationDetailDialog";
import { DeadlineManagement } from "@/components/applications/DeadlineManagement";
import { ReportsPanel } from "@/components/applications/ReportsPanel";
import { CommunicationPanel } from "@/components/applications/CommunicationPanel";

import { mockApplications, mockApplicationStats } from "@/data/mockApplications";
import { Application } from "@/types/application";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const navigate = useNavigate();
  
  // State
  const [applications] = useState<Application[]>(mockApplications);
  const [stats] = useState(mockApplicationStats);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [feeStatusFilter, setFeeStatusFilter] = useState("all");
  const [completionFilter, setCompletionFilter] = useState("all");
  
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.applicationNo.toLowerCase().includes(query) ||
          app.personalDetails.name.toLowerCase().includes(query) ||
          app.contactInfo.email.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      if (categoryFilter === "pwbd") {
        result = result.filter((app) => app.personalDetails.pwbd);
      } else {
        result = result.filter((app) => app.personalDetails.category === categoryFilter);
      }
    }

    // Fee status filter
    if (feeStatusFilter !== "all") {
      result = result.filter((app) => {
        if (feeStatusFilter === "paid") return app.payment.status === "success";
        if (feeStatusFilter === "pending") return app.payment.status === "pending";
        if (feeStatusFilter === "failed") return app.payment.status === "failed";
        return true;
      });
    }

    // Completion filter
    if (completionFilter !== "all") {
      if (completionFilter === "verified") {
        result = result.filter((app) => app.verificationStatus === "verified");
      } else if (completionFilter === "pending") {
        result = result.filter((app) => app.verificationStatus === "pending" || !app.verificationStatus);
      } else {
        result = result.filter((app) => app.status === completionFilter);
      }
    }

    return result;
  }, [applications, searchQuery, categoryFilter, feeStatusFilter, completionFilter]);

  // Handlers
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleVerify = (application: Application) => {
    toast.success(`Application ${application.applicationNo} verified successfully`);
    setDetailDialogOpen(false);
  };

  const handleReject = (application: Application) => {
    toast.error(`Application ${application.applicationNo} rejected`);
    setDetailDialogOpen(false);
  };

  const handleExport = () => {
    toast.info("Exporting applications...");
  };

  const handleDownloadReport = (reportType: string) => {
    toast.info(`Downloading ${reportType} report...`);
  };

  const handleExtendDeadline = (newDate: string, reason: string) => {
    toast.success(`Deadline extended to ${newDate}`);
  };

  const handleSendNotification = (data: { recipients: string; message: string }) => {
    toast.success("Notification sent successfully");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        <DashboardHeader notificationCount={3} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">
                Stage 2: Applications Received
              </p>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                Application Management
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Assistant Professor - Computer Science (VAC-2024-045)
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <ApplicationStatsCards stats={stats} />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Applications List (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              <ApplicationFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                feeStatusFilter={feeStatusFilter}
                onFeeStatusChange={setFeeStatusFilter}
                completionFilter={completionFilter}
                onCompletionChange={setCompletionFilter}
                onExport={handleExport}
              />

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Applications ({filteredApplications.length})
                </h2>
              </div>

              <ApplicationListTable
                applications={filteredApplications}
                onView={handleViewApplication}
              />
            </div>

            {/* Right Sidebar (1/3 width) */}
            <div className="space-y-6">
              <DeadlineManagement
                closingDate="23/01/2026"
                closingTime="11:59 PM"
                timeRemaining={{ days: 7, hours: 14, minutes: 32 }}
                onExtend={handleExtendDeadline}
              />
              
              <ReportsPanel onDownload={handleDownloadReport} />
              
              <CommunicationPanel
                totalApplicants={stats.total}
                incompleteCount={stats.completionStatus.incomplete}
                feePendingCount={stats.feeStatus.pending}
                onSend={handleSendNotification}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Application Detail Dialog */}
      <ApplicationDetailDialog
        application={selectedApplication}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onVerify={handleVerify}
        onReject={handleReject}
      />
    </div>
  );
};

export default Applications;
