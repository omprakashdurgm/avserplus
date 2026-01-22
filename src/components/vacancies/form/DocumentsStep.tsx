import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { VacancyFormData, DocumentRequirement } from "@/types/vacancy";
import { FileText, Camera, FileSignature, GraduationCap, Award, Shield } from "lucide-react";

interface DocumentsStepProps {
  formData: VacancyFormData;
  updateFormData: (data: Partial<VacancyFormData>) => void;
}

const documentIcons: Record<string, React.ReactNode> = {
  'Recent passport-size photograph': <Camera className="h-4 w-4" />,
  'Signature': <FileSignature className="h-4 w-4" />,
  '10th Marksheet/Certificate': <GraduationCap className="h-4 w-4" />,
  '12th Marksheet/Certificate': <GraduationCap className="h-4 w-4" />,
  'Graduation Degree & Marksheets': <GraduationCap className="h-4 w-4" />,
  'Post-Graduation Degree & Marksheets': <GraduationCap className="h-4 w-4" />,
  'PhD Degree (Provisional/Final)': <Award className="h-4 w-4" />,
  'NET/SLET Certificate': <Award className="h-4 w-4" />,
  'Caste Certificate': <Shield className="h-4 w-4" />,
  'PwBD Certificate': <Shield className="h-4 w-4" />,
  'EWS Certificate': <Shield className="h-4 w-4" />,
  'Experience Certificates': <FileText className="h-4 w-4" />,
  'Publications/Research Papers': <FileText className="h-4 w-4" />,
};

export const DocumentsStep = ({ formData, updateFormData }: DocumentsStepProps) => {
  const toggleMandatory = (docId: string) => {
    const updatedDocs = formData.documents.map((doc) =>
      doc.id === docId ? { ...doc, mandatory: !doc.mandatory } : doc
    );
    updateFormData({ documents: updatedDocs });
  };

  const mandatoryDocs = formData.documents.filter((doc) => doc.mandatory);
  const optionalDocs = formData.documents.filter((doc) => !doc.mandatory);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <FileText className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Document Requirements</h3>
          <p className="text-sm text-muted-foreground">Configure which documents applicants must upload</p>
        </div>
      </div>

      {/* Format Note */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 flex items-start gap-3">
        <FileText className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-medium text-warning">File Format Guidelines:</span>
          <span className="text-foreground ml-1">
            PDF format only. Maximum file size: 2 MB each (50 KB for photo, 20 KB for signature)
          </span>
        </div>
      </div>

      {/* Mandatory Documents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive"></span>
            Mandatory Documents
          </Label>
          <span className="text-xs text-muted-foreground">{mandatoryDocs.length} selected</span>
        </div>
        <div className="grid gap-2">
          {formData.documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                doc.mandatory
                  ? 'bg-destructive/5 border-destructive/20'
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${doc.mandatory ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                  {documentIcons[doc.name] || <FileText className="h-4 w-4" />}
                </div>
                <div>
                  <span className="text-sm font-medium">{doc.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (Max: {doc.maxSize}, {doc.format})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${doc.mandatory ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {doc.mandatory ? 'Required' : 'Optional'}
                </span>
                <Switch
                  checked={doc.mandatory}
                  onCheckedChange={() => toggleMandatory(doc.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-destructive"></span>
            <Label className="text-sm font-medium">Mandatory</Label>
          </div>
          <div className="text-2xl font-bold text-destructive">{mandatoryDocs.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Documents required from all applicants
          </p>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
            <Label className="text-sm font-medium">Optional</Label>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">{optionalDocs.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Documents based on eligibility/category
          </p>
        </div>
      </div>

      {/* Document Checklist Preview */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <Label className="text-xs font-medium text-primary uppercase tracking-wide mb-3 block">
          Applicant Document Checklist
        </Label>
        <div className="space-y-2">
          {mandatoryDocs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 border-2 border-primary rounded flex items-center justify-center text-primary">
                ✓
              </span>
              <span>{doc.name}</span>
              <span className="text-xs text-muted-foreground">({doc.maxSize})</span>
            </div>
          ))}
          {optionalDocs.length > 0 && (
            <>
              <div className="pt-2 mt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">If applicable:</span>
              </div>
              {optionalDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4 border border-border rounded"></span>
                  <span>{doc.name}</span>
                  <span className="text-xs">({doc.maxSize})</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
