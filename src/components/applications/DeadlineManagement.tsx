import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, AlertTriangle, RefreshCw, Bell } from "lucide-react";

interface DeadlineManagementProps {
  closingDate: string;
  closingTime: string;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
  };
  onExtend?: (newDate: string, reason: string) => void;
}

export const DeadlineManagement = ({
  closingDate,
  closingTime,
  timeRemaining,
  onExtend,
}: DeadlineManagementProps) => {
  const [settings, setSettings] = useState({
    stopAccepting: true,
    allowPendingFee: true,
    pendingFeeBuffer: 2,
    sendFinalReminder: true,
    reminderHours: 24,
    generateClosureReport: true,
  });

  const [extensionDays, setExtensionDays] = useState("");
  const [extensionReason, setExtensionReason] = useState("");
  const [customDate, setCustomDate] = useState("");

  const handleExtend = (days: number) => {
    const date = new Date(closingDate);
    date.setDate(date.getDate() + days);
    onExtend?.(date.toISOString().split("T")[0], extensionReason);
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Deadline Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Deadline */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Closing Date:</span>
            </div>
            <span className="font-semibold text-foreground">{closingDate}, {closingTime}</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="text-xl font-bold text-warning">
                {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Auto-Close Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Auto-Close Settings</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="stopAccepting" className="text-sm cursor-pointer">
                  Stop accepting applications at deadline
                </Label>
              </div>
              <Switch
                id="stopAccepting"
                checked={settings.stopAccepting}
                onCheckedChange={(checked) => setSettings({ ...settings, stopAccepting: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="allowPendingFee" className="text-sm cursor-pointer">
                  Allow pending fee payments (+{settings.pendingFeeBuffer} hours)
                </Label>
              </div>
              <Switch
                id="allowPendingFee"
                checked={settings.allowPendingFee}
                onCheckedChange={(checked) => setSettings({ ...settings, allowPendingFee: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sendReminder" className="text-sm cursor-pointer">
                  Send final reminder ({settings.reminderHours} hours before)
                </Label>
              </div>
              <Switch
                id="sendReminder"
                checked={settings.sendFinalReminder}
                onCheckedChange={(checked) => setSettings({ ...settings, sendFinalReminder: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="generateReport" className="text-sm cursor-pointer">
                  Generate closure report automatically
                </Label>
              </div>
              <Switch
                id="generateReport"
                checked={settings.generateClosureReport}
                onCheckedChange={(checked) => setSettings({ ...settings, generateClosureReport: checked })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Extension Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Extension Options
          </h4>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExtend(7)}
              className="flex-1"
            >
              +7 Days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExtend(15)}
              className="flex-1"
            >
              +15 Days
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDate" className="text-sm">Custom Date</Label>
            <Input
              id="customDate"
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm">Reason for Extension</Label>
            <Input
              id="reason"
              placeholder="Enter reason for extension..."
              value={extensionReason}
              onChange={(e) => setExtensionReason(e.target.value)}
            />
          </div>

          <Button 
            variant="default" 
            className="w-full gap-2"
            disabled={!customDate && !extensionReason}
            onClick={() => onExtend?.(customDate, extensionReason)}
          >
            <RefreshCw className="h-4 w-4" />
            Apply Extension
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
