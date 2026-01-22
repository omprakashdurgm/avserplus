import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { VacancyFormData } from "@/types/vacancy";
import { Megaphone, Globe, Newspaper, Mail, Share2, FileDown, FileText, FileSpreadsheet } from "lucide-react";

interface AdvertisementStepProps {
  formData: VacancyFormData;
  updateFormData: (data: Partial<VacancyFormData>) => void;
}

export const AdvertisementStep = ({ formData, updateFormData }: AdvertisementStepProps) => {
  const updateAdvertisement = (field: keyof typeof formData.advertisement, value: any) => {
    updateFormData({
      advertisement: {
        ...formData.advertisement,
        [field]: value,
      },
    });
  };

  const togglePublishChannel = (channel: keyof typeof formData.advertisement.publishTo) => {
    updateFormData({
      advertisement: {
        ...formData.advertisement,
        publishTo: {
          ...formData.advertisement.publishTo,
          [channel]: !formData.advertisement.publishTo[channel],
        },
      },
    });
  };

  const updateNewspaperDetails = (type: 'national' | 'regional', value: number) => {
    updateFormData({
      advertisement: {
        ...formData.advertisement,
        newspaperDetails: {
          ...formData.advertisement.newspaperDetails,
          [type]: value,
        },
      },
    });
  };

  const publishChannels = [
    { key: 'officialWebsite', label: 'Official Website', icon: Globe, description: 'Publish on organization website' },
    { key: 'employmentNews', label: 'Employment News', icon: Newspaper, description: 'Weekly employment publication' },
    { key: 'newspapers', label: 'Newspapers', icon: Newspaper, description: 'National & regional newspapers' },
    { key: 'emailNotification', label: 'Email Notification', icon: Mail, description: 'Alert registered users' },
    { key: 'socialMedia', label: 'Social Media', icon: Share2, description: 'LinkedIn, Twitter/X' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <Megaphone className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Advertisement & Notification</h3>
          <p className="text-sm text-muted-foreground">Configure publishing channels and notification settings</p>
        </div>
      </div>

      {/* Notification Number */}
      <div className="space-y-2">
        <Label htmlFor="notificationNumber">
          Notification Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="notificationNumber"
          placeholder="e.g. AVSER/REC/2024/045"
          value={formData.advertisement.notificationNumber}
          onChange={(e) => updateAdvertisement('notificationNumber', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Unique identifier for this recruitment advertisement
        </p>
      </div>

      {/* Publish Channels */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Publish Advertisement To</Label>
        <div className="grid gap-3">
          {publishChannels.map(({ key, label, icon: Icon, description }) => (
            <div
              key={key}
              className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                formData.advertisement.publishTo[key]
                  ? 'bg-accent/5 border-accent/30'
                  : 'bg-card border-border hover:border-accent/20'
              }`}
              onClick={() => togglePublishChannel(key)}
            >
              <Checkbox
                id={key}
                checked={formData.advertisement.publishTo[key]}
                onCheckedChange={() => togglePublishChannel(key)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${formData.advertisement.publishTo[key] ? 'text-accent' : 'text-muted-foreground'}`} />
                  <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                    {label}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newspaper Details */}
      {formData.advertisement.publishTo.newspapers && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <Label className="text-sm font-medium">Newspaper Distribution</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="national" className="text-xs text-muted-foreground">
                National Newspapers
              </Label>
              <Input
                id="national"
                type="number"
                min="0"
                max="10"
                className="bg-background"
                value={formData.advertisement.newspaperDetails.national || ''}
                onChange={(e) => updateNewspaperDetails('national', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regional" className="text-xs text-muted-foreground">
                Regional Newspapers
              </Label>
              <Input
                id="regional"
                type="number"
                min="0"
                max="10"
                className="bg-background"
                value={formData.advertisement.newspaperDetails.regional || ''}
                onChange={(e) => updateNewspaperDetails('regional', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Job Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Additional Information / Job Description</Label>
        <Textarea
          id="description"
          placeholder="Enter any additional details about the post, duties, responsibilities, or special instructions for applicants..."
          rows={5}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
      </div>

      {/* Download Options Preview */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <Label className="text-xs font-medium text-primary uppercase tracking-wide mb-3 block">
          Documents to be Generated
        </Label>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            disabled
          >
            <FileDown className="h-4 w-4 text-accent" />
            Detailed Advertisement PDF
            <span className="ml-auto text-xs text-muted-foreground">Auto-generated</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            disabled
          >
            <FileText className="h-4 w-4 text-accent" />
            Quick Information Bulletin
            <span className="ml-auto text-xs text-muted-foreground">Auto-generated</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            disabled
          >
            <FileSpreadsheet className="h-4 w-4 text-accent" />
            Application Format
            <span className="ml-auto text-xs text-muted-foreground">Auto-generated</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          These documents will be generated automatically after publishing the vacancy.
        </p>
      </div>

      {/* Publish Summary */}
      <div className="bg-success/5 border border-success/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="h-5 w-5 text-success" />
          <Label className="font-medium text-success">Ready to Publish</Label>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Notification:</span> {formData.advertisement.notificationNumber || 'Not set'}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Channels:</span>{' '}
            {Object.entries(formData.advertisement.publishTo)
              .filter(([_, enabled]) => enabled)
              .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
              .join(', ') || 'None selected'}
          </p>
        </div>
      </div>
    </div>
  );
};
