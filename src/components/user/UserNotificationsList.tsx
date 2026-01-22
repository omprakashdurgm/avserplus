import { CandidateNotification } from "@/types/candidate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertCircle, CheckCircle, Info, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserNotificationsListProps {
  notifications: CandidateNotification[];
  maxItems?: number;
  onViewAll?: () => void;
}

export const UserNotificationsList = ({
  notifications,
  maxItems = 5,
  onViewAll,
}: UserNotificationsListProps) => {
  const displayNotifications = notifications.slice(0, maxItems);

  const getTypeIcon = (type: CandidateNotification["type"]) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      case "success":
        return <CheckCircle className="h-3.5 w-3.5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-3.5 w-3.5 text-warning" />;
      default:
        return <Info className="h-3.5 w-3.5 text-primary" />;
    }
  };

  const getTypeBg = (type: CandidateNotification["type"]) => {
    switch (type) {
      case "urgent":
        return "bg-destructive/10";
      case "success":
        return "bg-success/10";
      case "warning":
        return "bg-warning/10";
      default:
        return "bg-primary/10";
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-xs sm:text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayNotifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-start gap-2 p-2.5 sm:p-3 rounded-lg border transition-colors",
            notification.read
              ? "border-border bg-card"
              : "border-primary/20 bg-primary/5"
          )}
        >
          <div className={cn("flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0", getTypeBg(notification.type))}>
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className={cn("text-xs sm:text-sm font-medium truncate", !notification.read && "text-foreground")}>
                {notification.title}
              </p>
              {!notification.read && (
                <Badge variant="secondary" className="text-[8px] sm:text-[10px] h-3.5 sm:h-4 px-1">New</Badge>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{notification.message}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
              {new Date(notification.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          {notification.actionUrl && (
            <Button variant="ghost" size="icon" className="flex-shrink-0 h-6 w-6">
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}

      {notifications.length > maxItems && onViewAll && (
        <Button variant="ghost" className="w-full mt-2 h-8 text-xs" onClick={onViewAll}>
          View All ({notifications.length})
        </Button>
      )}
    </div>
  );
};
