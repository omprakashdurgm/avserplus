import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VacancyFormData } from "@/types/vacancy";
import { ClipboardCheck, Award, Plus, X, GripVertical } from "lucide-react";

interface SelectionStepProps {
  formData: VacancyFormData;
  updateFormData: (data: Partial<VacancyFormData>) => void;
}

export const SelectionStep = ({ formData, updateFormData }: SelectionStepProps) => {
  const updateSelection = (field: keyof typeof formData.selection, value: any) => {
    updateFormData({
      selection: {
        ...formData.selection,
        [field]: value,
      },
    });
  };

  const updateInterviewMarking = (field: keyof typeof formData.selection.interviewMarking, value: number) => {
    updateFormData({
      selection: {
        ...formData.selection,
        interviewMarking: {
          ...formData.selection.interviewMarking,
          [field]: value,
        },
      },
    });
  };

  const updateMinQualifyingMarks = (field: keyof typeof formData.selection.minimumQualifyingMarks, value: number) => {
    updateFormData({
      selection: {
        ...formData.selection,
        minimumQualifyingMarks: {
          ...formData.selection.minimumQualifyingMarks,
          [field]: value,
        },
      },
    });
  };

  const addStage = () => {
    const newStage = {
      stage: formData.selection.stages.length + 1,
      name: '',
    };
    updateSelection('stages', [...formData.selection.stages, newStage]);
  };

  const removeStage = (index: number) => {
    const newStages = formData.selection.stages
      .filter((_, i) => i !== index)
      .map((stage, i) => ({ ...stage, stage: i + 1 }));
    updateSelection('stages', newStages);
  };

  const updateStage = (index: number, name: string) => {
    const newStages = [...formData.selection.stages];
    newStages[index] = { ...newStages[index], name };
    updateSelection('stages', newStages);
  };

  const totalMarks = 
    formData.selection.interviewMarking.subjectKnowledge +
    formData.selection.interviewMarking.teachingSkills +
    formData.selection.interviewMarking.researchPublications +
    formData.selection.interviewMarking.generalAwareness;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <ClipboardCheck className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Selection Process</h3>
          <p className="text-sm text-muted-foreground">Define selection stages and evaluation criteria</p>
        </div>
      </div>

      {/* Selection Stages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Selection Stages</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStage}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Stage
          </Button>
        </div>
        <div className="space-y-2">
          {formData.selection.stages.map((stage, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-semibold text-accent w-16">
                Stage {stage.stage}
              </span>
              <Input
                placeholder={`e.g. ${
                  index === 0 ? 'Document Verification' : 
                  index === 1 ? 'Written Test/Screening' : 
                  'Interview/Presentation'
                }`}
                value={stage.name}
                onChange={(e) => updateStage(index, e.target.value)}
                className="flex-1 bg-background"
              />
              {formData.selection.stages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStage(index)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interview Marking Scheme */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Interview/Evaluation Marking Scheme</Label>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'subjectKnowledge', label: 'Subject Knowledge' },
              { key: 'teachingSkills', label: 'Teaching Skills' },
              { key: 'researchPublications', label: 'Research & Publications' },
              { key: 'generalAwareness', label: 'General Awareness' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm">
                  {label}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    max="100"
                    className="bg-background"
                    value={formData.selection.interviewMarking[key as keyof typeof formData.selection.interviewMarking] || ''}
                    onChange={(e) =>
                      updateInterviewMarking(key as keyof typeof formData.selection.interviewMarking, parseInt(e.target.value) || 0)
                    }
                  />
                  <span className="text-sm text-muted-foreground">marks</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t border-border flex justify-between items-center">
            <span className="text-sm font-medium">Total Marks</span>
            <span className={`text-lg font-bold ${totalMarks === 100 ? 'text-success' : 'text-warning'}`}>
              {totalMarks} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Minimum Qualifying Marks */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Minimum Qualifying Marks (%)</Label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="minGeneral" className="text-xs text-muted-foreground">
              General / EWS
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="minGeneral"
                type="number"
                min="0"
                max="100"
                value={formData.selection.minimumQualifyingMarks.general || ''}
                onChange={(e) => updateMinQualifyingMarks('general', parseInt(e.target.value) || 0)}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minOBC" className="text-xs text-muted-foreground">
              OBC
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="minOBC"
                type="number"
                min="0"
                max="100"
                value={formData.selection.minimumQualifyingMarks.obc || ''}
                onChange={(e) => updateMinQualifyingMarks('obc', parseInt(e.target.value) || 0)}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minSCST" className="text-xs text-muted-foreground">
              SC / ST / PwBD
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="minSCST"
                type="number"
                min="0"
                max="100"
                value={formData.selection.minimumQualifyingMarks.scStPwbd || ''}
                onChange={(e) => updateMinQualifyingMarks('scStPwbd', parseInt(e.target.value) || 0)}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <Label className="text-xs font-medium text-primary uppercase tracking-wide mb-3 block">
          Selection Overview
        </Label>
        <div className="space-y-3">
          <div>
            <span className="text-xs text-muted-foreground">Stages:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.selection.stages.map((stage) => (
                <span
                  key={stage.stage}
                  className="px-2 py-1 bg-background rounded text-xs font-medium"
                >
                  {stage.stage}. {stage.name || 'Unnamed'}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-success">{formData.selection.minimumQualifyingMarks.general}%</div>
              <div className="text-xs text-muted-foreground">General</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">{formData.selection.minimumQualifyingMarks.obc}%</div>
              <div className="text-xs text-muted-foreground">OBC</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">{formData.selection.minimumQualifyingMarks.scStPwbd}%</div>
              <div className="text-xs text-muted-foreground">SC/ST/PwBD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
