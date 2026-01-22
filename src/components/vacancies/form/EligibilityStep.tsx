import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { VacancyFormData } from "@/types/vacancy";
import { GraduationCap, Clock, Award, Plus, X } from "lucide-react";

interface EligibilityStepProps {
  formData: VacancyFormData;
  updateFormData: (data: Partial<VacancyFormData>) => void;
}

export const EligibilityStep = ({ formData, updateFormData }: EligibilityStepProps) => {
  const updateEligibility = (field: keyof typeof formData.eligibility, value: any) => {
    updateFormData({
      eligibility: {
        ...formData.eligibility,
        [field]: value,
      },
    });
  };

  const updateAgeLimit = (field: keyof typeof formData.eligibility.ageLimit, value: any) => {
    updateFormData({
      eligibility: {
        ...formData.eligibility,
        ageLimit: {
          ...formData.eligibility.ageLimit,
          [field]: value,
        },
      },
    });
  };

  const addQualification = (type: 'essentialQualifications' | 'desirableQualifications') => {
    const currentList = formData.eligibility[type];
    updateEligibility(type, [...currentList, '']);
  };

  const removeQualification = (type: 'essentialQualifications' | 'desirableQualifications', index: number) => {
    const currentList = formData.eligibility[type];
    updateEligibility(type, currentList.filter((_, i) => i !== index));
  };

  const updateQualification = (type: 'essentialQualifications' | 'desirableQualifications', index: number, value: string) => {
    const currentList = [...formData.eligibility[type]];
    currentList[index] = value;
    updateEligibility(type, currentList);
  };

  const toggleOtherRequirement = (requirement: string) => {
    const currentList = formData.eligibility.otherRequirements;
    if (currentList.includes(requirement)) {
      updateEligibility('otherRequirements', currentList.filter((r) => r !== requirement));
    } else {
      updateEligibility('otherRequirements', [...currentList, requirement]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <GraduationCap className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Eligibility Criteria</h3>
          <p className="text-sm text-muted-foreground">Define qualifications, age limits, and experience requirements</p>
        </div>
      </div>

      {/* Essential Qualifications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            Essential Qualifications <span className="text-destructive">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addQualification('essentialQualifications')}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {formData.eligibility.essentialQualifications.map((qual, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`e.g. ${index === 0 ? "PhD in Computer Science/IT" : "Master's Degree with 55% marks"}`}
                value={qual}
                onChange={(e) => updateQualification('essentialQualifications', index, e.target.value)}
              />
              {formData.eligibility.essentialQualifications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQualification('essentialQualifications', index)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desirable Qualifications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            Desirable Qualifications
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addQualification('desirableQualifications')}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {formData.eligibility.desirableQualifications.map((qual, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`e.g. ${index === 0 ? "Publications in peer-reviewed journals" : "Teaching experience > 3 years"}`}
                value={qual}
                onChange={(e) => updateQualification('desirableQualifications', index, e.target.value)}
              />
              {formData.eligibility.desirableQualifications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQualification('desirableQualifications', index)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Age Limit */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Age Limit (as on closing date)</Label>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minAge" className="text-xs text-muted-foreground">
              Minimum (years)
            </Label>
            <Input
              id="minAge"
              type="number"
              min="18"
              value={formData.eligibility.ageLimit.minimum || ''}
              onChange={(e) => updateAgeLimit('minimum', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAge" className="text-xs text-muted-foreground">
              Maximum (years)
            </Label>
            <Input
              id="maxAge"
              type="number"
              min="18"
              value={formData.eligibility.ageLimit.maximum || ''}
              onChange={(e) => updateAgeLimit('maximum', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Age Relaxation
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label htmlFor="relaxOBC" className="text-xs text-muted-foreground">
                OBC (+years)
              </Label>
              <Input
                id="relaxOBC"
                type="number"
                className="h-9 bg-background"
                value={formData.eligibility.ageLimit.relaxationOBC || ''}
                onChange={(e) => updateAgeLimit('relaxationOBC', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="relaxSCST" className="text-xs text-muted-foreground">
                SC/ST (+years)
              </Label>
              <Input
                id="relaxSCST"
                type="number"
                className="h-9 bg-background"
                value={formData.eligibility.ageLimit.relaxationSCST || ''}
                onChange={(e) => updateAgeLimit('relaxationSCST', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="relaxPwBD" className="text-xs text-muted-foreground">
                PwBD (+years)
              </Label>
              <Input
                id="relaxPwBD"
                type="number"
                className="h-9 bg-background"
                value={formData.eligibility.ageLimit.relaxationPwBD || ''}
                onChange={(e) => updateAgeLimit('relaxationPwBD', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="relaxEx" className="text-xs text-muted-foreground">
                Ex-Servicemen
              </Label>
              <Input
                id="relaxEx"
                className="h-9 bg-background"
                placeholder="As per rules"
                value={formData.eligibility.ageLimit.relaxationExServicemen}
                onChange={(e) => updateAgeLimit('relaxationExServicemen', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="teachingExp">Teaching Experience</Label>
          <Input
            id="teachingExp"
            placeholder="e.g. 3 years in higher education"
            value={formData.eligibility.teachingExperience}
            onChange={(e) => updateEligibility('teachingExperience', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="researchExp">Research Experience</Label>
          <Input
            id="researchExp"
            placeholder="e.g. Publications/Projects"
            value={formData.eligibility.researchExperience}
            onChange={(e) => updateEligibility('researchExperience', e.target.value)}
          />
        </div>
      </div>

      {/* Other Requirements */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Other Requirements</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            'NET/SLET/SET qualified',
            'GATE qualified',
            'Valid driving license',
            'Computer proficiency',
            'Language proficiency',
            'Physical fitness',
          ].map((requirement) => (
            <div key={requirement} className="flex items-center space-x-2">
              <Checkbox
                id={requirement}
                checked={formData.eligibility.otherRequirements.includes(requirement)}
                onCheckedChange={() => toggleOtherRequirement(requirement)}
              />
              <Label htmlFor={requirement} className="text-sm font-normal cursor-pointer">
                {requirement}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
