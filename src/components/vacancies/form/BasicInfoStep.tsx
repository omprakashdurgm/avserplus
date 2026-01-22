import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VacancyFormData, departments, payBands, gradePays, locations } from "@/types/vacancy";
import { Briefcase, Building2, MapPin, IndianRupee, Users } from "lucide-react";

interface BasicInfoStepProps {
  formData: VacancyFormData;
  updateFormData: (data: Partial<VacancyFormData>) => void;
}

export const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const updateReservation = (category: keyof typeof formData.reservationCategory, value: number) => {
    updateFormData({
      reservationCategory: {
        ...formData.reservationCategory,
        [category]: value,
      },
    });
  };

  const updatePayScale = (field: keyof typeof formData.payScale, value: string) => {
    updateFormData({
      payScale: {
        ...formData.payScale,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <Briefcase className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Basic Information</h3>
          <p className="text-sm text-muted-foreground">Enter the post details and reservation categories</p>
        </div>
      </div>

      {/* Post Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="postName">
            Post Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postName"
            placeholder="e.g. Assistant Professor - Computer Science"
            value={formData.postName}
            onChange={(e) => updateFormData({ postName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">
            Department <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.department}
            onValueChange={(value) => updateFormData({ department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vacancyId">
            Vacancy ID <span className="text-muted-foreground text-xs">(Auto-generated)</span>
          </Label>
          <Input
            id="vacancyId"
            placeholder="VAC-2024-XXX"
            value={formData.vacancyId}
            onChange={(e) => updateFormData({ vacancyId: e.target.value })}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            Place of Posting <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.location}
            onValueChange={(value) => updateFormData({ location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfPosts">
            Number of Posts <span className="text-destructive">*</span>
          </Label>
          <Input
            id="numberOfPosts"
            type="number"
            min="1"
            placeholder="e.g. 2"
            value={formData.numberOfPosts || ''}
            onChange={(e) => updateFormData({ numberOfPosts: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Reservation Category */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Reservation Category Distribution</Label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { key: 'general', label: 'General (UR)' },
            { key: 'obc', label: 'OBC' },
            { key: 'sc', label: 'SC' },
            { key: 'st', label: 'ST' },
            { key: 'ews', label: 'EWS' },
            { key: 'pwbd', label: 'PwBD' },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="text-xs text-muted-foreground">
                {label}
              </Label>
              <Input
                id={key}
                type="number"
                min="0"
                className="h-9"
                value={formData.reservationCategory[key as keyof typeof formData.reservationCategory] || ''}
                onChange={(e) =>
                  updateReservation(key as keyof typeof formData.reservationCategory, parseInt(e.target.value) || 0)
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Employment Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Employment Type</Label>
        </div>
        <RadioGroup
          value={formData.employmentType}
          onValueChange={(value) => updateFormData({ employmentType: value as VacancyFormData['employmentType'] })}
          className="flex flex-wrap gap-4"
        >
          {[
            { value: 'permanent', label: 'Permanent' },
            { value: 'temporary', label: 'Temporary' },
            { value: 'contract', label: 'Contract' },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value} className="font-normal cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Pay Scale */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Pay Scale / Salary</Label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="payBand" className="text-xs text-muted-foreground">
              Pay Band
            </Label>
            <Select
              value={formData.payScale.payBand}
              onValueChange={(value) => updatePayScale('payBand', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pay band" />
              </SelectTrigger>
              <SelectContent>
                {payBands.map((band) => (
                  <SelectItem key={band} value={band}>
                    {band}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradePay" className="text-xs text-muted-foreground">
              Grade Pay
            </Label>
            <Select
              value={formData.payScale.gradePay}
              onValueChange={(value) => updatePayScale('gradePay', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade pay" />
              </SelectTrigger>
              <SelectContent>
                {gradePays.map((gp) => (
                  <SelectItem key={gp} value={gp}>
                    {gp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agp" className="text-xs text-muted-foreground">
              AGP (Academic Grade Pay)
            </Label>
            <Input
              id="agp"
              placeholder="e.g. ₹9,000"
              value={formData.payScale.agp}
              onChange={(e) => updatePayScale('agp', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalEmoluments" className="text-xs text-muted-foreground">
              Total Emoluments (Range)
            </Label>
            <Input
              id="totalEmoluments"
              placeholder="e.g. ₹67,700 - ₹2,08,700"
              value={formData.payScale.totalEmoluments}
              onChange={(e) => updatePayScale('totalEmoluments', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
