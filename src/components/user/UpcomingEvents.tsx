import { CandidateApplication } from "@/types/candidate";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpcomingEventsProps {
  applications: CandidateApplication[];
}

interface Event {
  id: string;
  type: "exam" | "interview";
  title: string;
  applicationNo: string;
  date: string;
  time: string;
  venue: string;
  mode?: "online" | "offline" | "hybrid";
}

export const UpcomingEvents = ({ applications }: UpcomingEventsProps) => {
  const events: Event[] = [];

  applications.forEach((app) => {
    if (app.examDetails && !app.examDetails.marksObtained) {
      events.push({
        id: `exam-${app.id}`,
        type: "exam",
        title: app.vacancyTitle,
        applicationNo: app.applicationNo,
        date: app.examDetails.examDate,
        time: app.examDetails.examTime,
        venue: app.examDetails.venue,
      });
    }
    if (app.interviewDetails && !app.interviewDetails.marksObtained) {
      events.push({
        id: `interview-${app.id}`,
        type: "interview",
        title: app.vacancyTitle,
        applicationNo: app.applicationNo,
        date: app.interviewDetails.interviewDate,
        time: app.interviewDetails.interviewTime,
        venue: app.interviewDetails.venue,
        mode: app.interviewDetails.mode,
      });
    }
  });

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Calendar className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-xs sm:text-sm text-muted-foreground">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div
          key={event.id}
          className={cn(
            "p-3 rounded-lg border",
            event.type === "exam" ? "border-warning/30 bg-warning/5" : "border-primary/30 bg-primary/5"
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  event.type === "exam" ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                )}
              >
                {event.type === "exam" ? "Exam" : "Interview"}
              </Badge>
              {event.mode && (
                <Badge variant="outline" className="text-[10px] h-4">
                  {event.mode}
                </Badge>
              )}
            </div>
            
            <h4 className="font-medium text-xs sm:text-sm text-foreground line-clamp-1">{event.title}</h4>

            <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              {event.type === "exam" && (
                <Button size="sm" variant="outline" className="text-[10px] sm:text-xs h-7 flex-1">
                  Admit Card
                </Button>
              )}
              <Button size="sm" variant="ghost" className="text-[10px] sm:text-xs h-7 flex-1">
                Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
