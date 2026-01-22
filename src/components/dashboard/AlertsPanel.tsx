import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Bell, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/types/recruitment";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onDismiss: (alertId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const alertConfig = {
  urgent: {
    icon: AlertCircle,
    label: "URGENT",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10 border-destructive/20",
    dotClass: "bg-destructive",
  },
  important: {
    icon: AlertTriangle,
    label: "IMPORTANT",
    colorClass: "text-warning",
    bgClass: "bg-warning/10 border-warning/20",
    dotClass: "bg-warning",
  },
  reminder: {
    icon: Bell,
    label: "REMINDERS",
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted/50 border-muted",
    dotClass: "bg-muted-foreground",
  },
};

export const AlertsPanel = ({
  alerts,
  onAlertClick,
  onDismiss,
  onClose,
  isOpen,
}: AlertsPanelProps) => {
  const urgentAlerts = alerts.filter((a) => a.type === "urgent");
  const importantAlerts = alerts.filter((a) => a.type === "important");
  const reminderAlerts = alerts.filter((a) => a.type === "reminder");

  const AlertGroup = ({
    type,
    items,
  }: {
    type: "urgent" | "important" | "reminder";
    items: Alert[];
  }) => {
    const config = alertConfig[type];
    const Icon = config.icon;

    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <div className={cn("flex items-center gap-1.5 text-xs font-semibold mb-2", config.colorClass)}>
          <Icon className="h-3.5 w-3.5" />
          {config.label} ({items.length})
        </div>
        <div className="space-y-2">
          {items.map((alert) => (
            <button
              key={alert.id}
              onClick={() => onAlertClick(alert)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-sm",
                config.bgClass
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {alert.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {alert.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-40 h-screen w-80 bg-card border-l border-border shadow-elevated transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-accent" />
          <h2 className="font-semibold text-foreground">Attention Required</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-64px)] p-4">
        <AlertGroup type="urgent" items={urgentAlerts} />
        <AlertGroup type="important" items={importantAlerts} />
        <AlertGroup type="reminder" items={reminderAlerts} />

        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <AlertCircle className="h-6 w-6 text-success" />
            </div>
            <p className="font-medium text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">
              No pending actions at the moment.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
