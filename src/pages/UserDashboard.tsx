import { useState } from "react";
import { UserLayout } from "@/components/user/UserLayout";
import { UserStatsCards } from "@/components/user/UserStatsCards";
import { ApplicationCard } from "@/components/user/ApplicationCard";
import { UserNotificationsList } from "@/components/user/UserNotificationsList";
import { UpcomingEvents } from "@/components/user/UpcomingEvents";
import { ApplicationTracker } from "@/components/user/ApplicationTracker";
import { mockCandidateProfile, mockCandidateApplications } from "@/data/mockCandidateData";
import { CandidateApplication } from "@/types/candidate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  FileText, 
  Calendar, 
  MapPin, 
  CheckCircle,
  Award,
  Clock
} from "lucide-react";

const UserDashboard = () => {
  const [selectedApplication, setSelectedApplication] = useState<CandidateApplication | null>(null);
  const profile = mockCandidateProfile;
  const applications = mockCandidateApplications;

  // Calculate stats
  const selectedCount = applications.filter((a) => a.status === "selected").length;
  const pendingActions = applications.filter(
    (a) => a.offerDetails?.responseStatus === "pending"
  ).length;

  // Get all notifications from all applications
  const allNotifications = applications
    .flatMap((a) => a.notifications)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  return (
    <UserLayout userName={profile.name} unreadNotifications={unreadCount}>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
            Welcome, {profile.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track your applications and stay updated.
          </p>
        </div>

        {/* Stats Cards */}
        <UserStatsCards
          totalApplications={profile.totalApplications}
          activeApplications={profile.activeApplications}
          selectedCount={selectedCount}
          pendingActions={pendingActions}
        />

        {/* Mobile: Tabs for Events & Notifications */}
        <div className="lg:hidden">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="applications" className="text-xs">Applications</TabsTrigger>
              <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs relative">
                Alerts
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="applications" className="mt-3 space-y-3">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={setSelectedApplication}
                />
              ))}
            </TabsContent>
            <TabsContent value="events" className="mt-3">
              <Card>
                <CardContent className="p-3">
                  <UpcomingEvents applications={applications} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="mt-3">
              <Card>
                <CardContent className="p-3">
                  <UserNotificationsList
                    notifications={allNotifications}
                    maxItems={10}
                    onViewAll={() => {}}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Applications - Main Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base lg:text-lg font-semibold text-foreground">My Applications</h2>
              <Button variant="outline" size="sm" className="text-xs h-8">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={setSelectedApplication}
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <UpcomingEvents applications={applications} />
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Recent Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px]">
                      {unreadCount} new
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <UserNotificationsList
                  notifications={allNotifications}
                  maxItems={4}
                  onViewAll={() => {}}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Detail Dialog - Responsive */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg lg:max-w-3xl max-h-[90vh] p-0 gap-0">
          {selectedApplication && (
            <>
              <DialogHeader className="p-4 sm:p-6 pb-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                    {selectedApplication.applicationNo}
                  </span>
                  <Badge
                    className={
                      selectedApplication.status === "selected"
                        ? "bg-success text-success-foreground text-[10px]"
                        : "bg-primary text-primary-foreground text-[10px]"
                    }
                  >
                    {selectedApplication.status === "selected" ? "Selected" : "In Progress"}
                  </Badge>
                </div>
                <DialogTitle className="text-base sm:text-lg pr-8">{selectedApplication.vacancyTitle}</DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">{selectedApplication.department}</p>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] px-4 sm:px-6 pb-4 sm:pb-6">
                <Tabs defaultValue="progress" className="mt-4">
                  <TabsList className="grid w-full grid-cols-4 h-8 sm:h-9">
                    <TabsTrigger value="progress" className="text-[10px] sm:text-xs">Progress</TabsTrigger>
                    <TabsTrigger value="exam" className="text-[10px] sm:text-xs">Exam</TabsTrigger>
                    <TabsTrigger value="interview" className="text-[10px] sm:text-xs">Interview</TabsTrigger>
                    <TabsTrigger value="documents" className="text-[10px] sm:text-xs">Docs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="progress" className="mt-3">
                    <Card>
                      <CardContent className="pt-4 sm:pt-6">
                        <ApplicationTracker stages={selectedApplication.stageProgress} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="exam" className="mt-3">
                    {selectedApplication.examDetails ? (
                      <Card>
                        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Date</p>
                              <p className="font-medium text-xs sm:text-sm">{selectedApplication.examDetails.examDate}</p>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Time</p>
                              <p className="font-medium text-xs sm:text-sm">{selectedApplication.examDetails.examTime}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Venue</p>
                              <p className="font-medium text-xs sm:text-sm flex items-center gap-1">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                {selectedApplication.examDetails.venue}
                              </p>
                            </div>
                          </div>

                          {selectedApplication.examDetails.marksObtained !== undefined && (
                            <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-xs sm:text-sm">
                              <div className="flex items-center justify-between">
                                <span>Marks</span>
                                <span className="text-base sm:text-lg font-bold">
                                  {selectedApplication.examDetails.marksObtained}/{selectedApplication.examDetails.totalMarks}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Status</span>
                                <Badge className={selectedApplication.examDetails.qualified ? "bg-success text-[10px]" : "bg-destructive text-[10px]"}>
                                  {selectedApplication.examDetails.qualified ? "Qualified" : "Not Qualified"}
                                </Badge>
                              </div>
                              {selectedApplication.examDetails.rank && (
                                <div className="flex items-center justify-between">
                                  <span>Rank</span>
                                  <span className="font-bold text-primary flex items-center gap-1">
                                    <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                                    #{selectedApplication.examDetails.rank}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {selectedApplication.examDetails.admitCardUrl && (
                            <Button className="w-full h-8 sm:h-9 text-xs sm:text-sm" variant="outline">
                              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Download Admit Card
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-xs sm:text-sm">No examination scheduled</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="interview" className="mt-3">
                    {selectedApplication.interviewDetails ? (
                      <Card>
                        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Date</p>
                              <p className="font-medium text-xs sm:text-sm">{selectedApplication.interviewDetails.interviewDate}</p>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Time</p>
                              <p className="font-medium text-xs sm:text-sm">{selectedApplication.interviewDetails.interviewTime}</p>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Mode</p>
                              <Badge variant="outline" className="capitalize text-[10px]">
                                {selectedApplication.interviewDetails.mode}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Panel</p>
                              <p className="font-medium text-xs sm:text-sm">{selectedApplication.interviewDetails.panelInfo || "TBA"}</p>
                            </div>
                          </div>

                          {selectedApplication.interviewDetails.marksObtained !== undefined && (
                            <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-xs sm:text-sm">
                              <div className="flex items-center justify-between">
                                <span>Marks</span>
                                <span className="text-base sm:text-lg font-bold">
                                  {selectedApplication.interviewDetails.marksObtained}/{selectedApplication.interviewDetails.totalMarks}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Status</span>
                                <Badge className={selectedApplication.interviewDetails.qualified ? "bg-success text-[10px]" : "bg-destructive text-[10px]"}>
                                  {selectedApplication.interviewDetails.qualified ? "Qualified" : "Not Qualified"}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-xs sm:text-sm">No interview scheduled</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="documents" className="mt-3">
                    {selectedApplication.documents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedApplication.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg border border-border bg-card"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex-shrink-0">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-xs sm:text-sm truncate">{doc.name}</p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                  {new Date(doc.generatedDate).toLocaleDateString("en-IN")}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="h-7 sm:h-8 text-[10px] sm:text-xs flex-shrink-0">
                              <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-xs sm:text-sm">No documents available</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Offer Section */}
                {selectedApplication.offerDetails && (
                  <Card className="mt-4 border-success/30 bg-success/5">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success/20 flex-shrink-0">
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                        </div>
                        <div className="flex-1 w-full">
                          <h4 className="font-semibold text-success text-sm sm:text-base mb-1">🎉 Congratulations!</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                            Selected for {selectedApplication.offerDetails.position}
                          </p>
                          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Pay Scale</p>
                              <p className="font-medium text-[11px] sm:text-sm">{selectedApplication.offerDetails.payScale}</p>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Location</p>
                              <p className="font-medium text-[11px] sm:text-sm">{selectedApplication.offerDetails.location}</p>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Joining</p>
                              <p className="font-medium text-[11px] sm:text-sm">{selectedApplication.offerDetails.joiningDate}</p>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Deadline</p>
                              <p className="font-medium text-[11px] sm:text-sm text-destructive">{selectedApplication.offerDetails.acceptanceDeadline}</p>
                            </div>
                          </div>
                          {selectedApplication.offerDetails.responseStatus === "pending" && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button className="bg-success hover:bg-success/90 h-8 sm:h-9 text-xs sm:text-sm flex-1 sm:flex-none">
                                Accept Offer
                              </Button>
                              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 h-8 sm:h-9 text-xs sm:text-sm flex-1 sm:flex-none">
                                Decline
                              </Button>
                              <Button variant="ghost" className="h-8 sm:h-9 text-xs sm:text-sm">
                                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Offer Letter
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
};

export default UserDashboard;
