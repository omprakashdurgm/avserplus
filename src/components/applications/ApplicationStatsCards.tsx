import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { ApplicationStats } from "@/types/application";
import { cn } from "@/lib/utils";

interface ApplicationStatsCardsProps {
  stats: ApplicationStats;
}

export const ApplicationStatsCards = ({ stats }: ApplicationStatsCardsProps) => {
  return (
    <div className="space-y-6">
      {/* Main Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Received</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-3 w-3" />
                    +{stats.today} today
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fee Paid</p>
                <p className="text-3xl font-bold text-success mt-1">{stats.feeStatus.paid}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-muted-foreground">
                    {Math.round((stats.feeStatus.paid / stats.total) * 100)}% of total
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fee Pending</p>
                <p className="text-3xl font-bold text-warning mt-1">{stats.feeStatus.pending}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-warning">
                  <Clock className="h-3 w-3" />
                  Awaiting payment
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incomplete</p>
                <p className="text-3xl font-bold text-destructive mt-1">{stats.completionStatus.incomplete}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  Missing documents
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Category Breakdown */}
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Category-wise Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.categoryWise).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground uppercase">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          category === "general" && "bg-primary",
                          category === "obc" && "bg-blue-500",
                          category === "sc" && "bg-purple-500",
                          category === "st" && "bg-green-500",
                          category === "ews" && "bg-orange-500",
                          category === "pwbd" && "bg-pink-500",
                        )}
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Gender Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Male</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(stats.genderWise.male / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{stats.genderWise.male}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Female</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-500 rounded-full"
                      style={{ width: `${(stats.genderWise.female / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{stats.genderWise.female}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Other</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(stats.genderWise.other / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{stats.genderWise.other}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Stats */}
        <Card className="border-border bg-card shadow-card">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-lg font-bold text-foreground">{stats.today}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Yesterday</span>
                <span className="text-lg font-bold text-foreground">{stats.yesterday}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="text-lg font-bold text-foreground">{stats.thisWeek}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
