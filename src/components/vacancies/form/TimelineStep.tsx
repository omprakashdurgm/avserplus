import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VacancyFormData } from "@/types/vacancy";
import { Calendar, Clock } from "lucide-react";

interface TimelineStepProps {
  formData: VacancyFormData;
  updateFormData: (data: Partial<VacancyFormData>) => void;
}

export const TimelineStep = ({ formData, updateFormData }: TimelineStepProps) => {
  const updateDates = (field: keyof typeof formData.dates, value: string) => {
    updateFormData({
      dates: {
        ...formData.dates,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <Calendar className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Important Dates & Timeline</h3>
          <p className="text-sm text-muted-foreground">Set the recruitment schedule and deadlines</p>
        </div>
      </div>

      {/* Advertisement & Application Dates */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Advertisement & Applications
        </Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="advDate">
              Advertisement Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="advDate"
              type="date"
              value={formData.dates.advertisementDate}
              onChange={(e) => updateDates('advertisementDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastFeeDate">
              Last Date for Fee Payment
            </Label>
            <Input
              id="lastFeeDate"
              type="date"
              value={formData.dates.lastDateForFee}
              onChange={(e) => updateDates('lastDateForFee', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Application Window */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Application Window
        </Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-success">Start</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="appStartDate" className="text-xs text-muted-foreground">
                  Date
                </Label>
                <Input
                  id="appStartDate"
                  type="date"
                  className="bg-background"
                  value={formData.dates.applicationStartDate}
                  onChange={(e) => updateDates('applicationStartDate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="appStartTime" className="text-xs text-muted-foreground">
                  Time
                </Label>
                <Input
                  id="appStartTime"
                  type="time"
                  className="bg-background"
                  value={formData.dates.applicationStartTime}
                  onChange={(e) => updateDates('applicationStartTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-destructive">End</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="appEndDate" className="text-xs text-muted-foreground">
                  Date
                </Label>
                <Input
                  id="appEndDate"
                  type="date"
                  className="bg-background"
                  value={formData.dates.applicationEndDate}
                  onChange={(e) => updateDates('applicationEndDate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="appEndTime" className="text-xs text-muted-foreground">
                  Time
                </Label>
                <Input
                  id="appEndTime"
                  type="time"
                  className="bg-background"
                  value={formData.dates.applicationEndTime}
                  onChange={(e) => updateDates('applicationEndTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correction Window */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Correction Window
        </Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="corrStart" className="text-xs text-muted-foreground">
              Start Date
            </Label>
            <Input
              id="corrStart"
              type="date"
              value={formData.dates.correctionWindowStart}
              onChange={(e) => updateDates('correctionWindowStart', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="corrEnd" className="text-xs text-muted-foreground">
              End Date
            </Label>
            <Input
              id="corrEnd"
              type="date"
              value={formData.dates.correctionWindowEnd}
              onChange={(e) => updateDates('correctionWindowEnd', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Exam & Admit Card */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Examination Schedule
        </Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admitCard">
              Admit Card Release
            </Label>
            <Input
              id="admitCard"
              type="date"
              value={formData.dates.admitCardRelease}
              onChange={(e) => updateDates('admitCardRelease', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="examDate">
              Examination Date
            </Label>
            <Input
              id="examDate"
              type="date"
              placeholder="To be notified"
              value={formData.dates.examinationDate}
              onChange={(e) => updateDates('examinationDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <Label className="text-xs font-medium text-primary uppercase tracking-wide mb-3 block">
          Timeline Preview
        </Label>
        <div className="space-y-2">
          {[
            { label: 'Advertisement', value: formData.dates.advertisementDate },
            { label: 'Applications Open', value: formData.dates.applicationStartDate },
            { label: 'Applications Close', value: formData.dates.applicationEndDate },
            { label: 'Correction Window', value: formData.dates.correctionWindowStart && formData.dates.correctionWindowEnd 
              ? `${formData.dates.correctionWindowStart} - ${formData.dates.correctionWindowEnd}` : '' },
            { label: 'Admit Card', value: formData.dates.admitCardRelease },
            { label: 'Examination', value: formData.dates.examinationDate || 'To be notified' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-medium">{item.value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
