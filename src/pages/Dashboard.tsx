import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SearchFilters } from "@/components/dashboard/SearchFilters";
import { RecruitmentCard } from "@/components/dashboard/RecruitmentCard";
import { RecruitmentTableView } from "@/components/dashboard/RecruitmentTableView";
import { RecruitmentDetail } from "@/components/dashboard/RecruitmentDetail";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { AlertsToggle } from "@/components/dashboard/AlertsToggle";
import { CreateVacancyDialog, VacancyFormData } from "@/components/vacancies/CreateVacancyDialog";

import { mockRecruitments, mockAlerts, mockDashboardStats } from "@/data/mockRecruitments";
import { Recruitment, RecruitmentStatus, Alert } from "@/types/recruitment";

const Dashboard = () => {
  // State
  const [recruitments] = useState<Recruitment[]>(mockRecruitments);
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [stats] = useState(mockDashboardStats);
  
  const [activeFilter, setActiveFilter] = useState<RecruitmentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  
  const [selectedRecruitment, setSelectedRecruitment] = useState<Recruitment | null>(null);
  const [alertsPanelOpen, setAlertsPanelOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Filtered recruitments
  const filteredRecruitments = useMemo(() => {
    let result = [...recruitments];

    // Status filter
    if (activeFilter !== "all") {
      result = result.filter((r) => r.status === activeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.vacancyId.toLowerCase().includes(query) ||
          r.department.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (departmentFilter !== "All Departments") {
      result = result.filter((r) => r.department === departmentFilter);
    }

    // Sorting
    switch (sortBy) {
      case "deadline":
        result.sort((a, b) => a.daysLeft - b.daysLeft);
        break;
      case "applications":
        result.sort((a, b) => b.totalApplications - a.totalApplications);
        break;
      case "progress":
        result.sort((a, b) => b.stageProgress - a.stageProgress);
        break;
      default:
        // latest - keep original order
        break;
    }

    return result;
  }, [recruitments, activeFilter, searchQuery, departmentFilter, sortBy]);

  // Handlers
  const handleViewRecruitment = (id: string) => {
    const recruitment = recruitments.find((r) => r.id === id);
    if (recruitment) {
      setSelectedRecruitment(recruitment);
    }
  };

  const handleActionRecruitment = (id: string) => {
    toast.info("Taking action on recruitment " + id);
  };

  const handleAlertClick = (alert: Alert) => {
    if (alert.recruitmentId) {
      handleViewRecruitment(alert.recruitmentId);
    }
    setAlertsPanelOpen(false);
  };

  const handleCreateVacancy = (data: VacancyFormData) => {
    toast.success("Vacancy created: " + data.postName);
  };

  // Detail view
  if (selectedRecruitment) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
          <DashboardHeader />
          <main className="p-6">
            <RecruitmentDetail
              recruitment={selectedRecruitment}
              onBack={() => setSelectedRecruitment(null)}
              onAction={(action) => toast.info(`Action: ${action}`)}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className={cn(
        "flex-1 ml-20 lg:ml-64 transition-all duration-300",
        alertsPanelOpen && "mr-80"
      )}>
        <DashboardHeader notificationCount={mockAlerts.filter(a => a.type === "urgent").length} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">
                Admin Dashboard
              </p>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                Recruitment Overview
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Aspirant Verification, Screening, Evaluation & Recruitment
              </p>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md gap-2"
            >
              <Plus className="h-4 w-4" />
              Publish New Vacancy
            </Button>
          </div>

          {/* Summary Cards */}
          <SummaryCards
            stats={stats}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Search & Filters */}
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Recruitment List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Recruitments ({filteredRecruitments.length})
              </h2>
            </div>

            {viewMode === "cards" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredRecruitments.map((recruitment) => (
                  <RecruitmentCard
                    key={recruitment.id}
                    recruitment={recruitment}
                    onView={handleViewRecruitment}
                    onAction={handleActionRecruitment}
                  />
                ))}
              </div>
            ) : (
              <RecruitmentTableView
                recruitments={filteredRecruitments}
                onView={handleViewRecruitment}
              />
            )}

            {filteredRecruitments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="font-medium text-foreground">No recruitments found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Alerts Panel */}
      <AlertsPanel
        alerts={alerts}
        onAlertClick={handleAlertClick}
        onDismiss={(id) => toast.info("Dismissed alert " + id)}
        onClose={() => setAlertsPanelOpen(false)}
        isOpen={alertsPanelOpen}
      />

      {/* Floating Alerts Button */}
      <AlertsToggle
        count={alerts.filter((a) => a.type === "urgent").length}
        onClick={() => setAlertsPanelOpen(!alertsPanelOpen)}
        isOpen={alertsPanelOpen}
      />

      {/* Create Vacancy Dialog */}
      <CreateVacancyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateVacancy}
      />
    </div>
  );
};

export default Dashboard;
