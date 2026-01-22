import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VacancyFormData, defaultVacancyFormData } from "@/types/vacancy";
import { FormStepIndicator } from "./form/FormStepIndicator";
import { BasicInfoStep } from "./form/BasicInfoStep";
import { EligibilityStep } from "./form/EligibilityStep";
import { TimelineStep } from "./form/TimelineStep";
import { FeeStep } from "./form/FeeStep";
import { SelectionStep } from "./form/SelectionStep";
import { DocumentsStep } from "./form/DocumentsStep";
import { AdvertisementStep } from "./form/AdvertisementStep";
import { ChevronLeft, ChevronRight, Send, Save } from "lucide-react";

interface CreateVacancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VacancyFormData) => void;
}

const formSteps = [
  { id: 1, title: 'Basic Information', shortTitle: 'Basic Info' },
  { id: 2, title: 'Eligibility Criteria', shortTitle: 'Eligibility' },
  { id: 3, title: 'Timeline', shortTitle: 'Timeline' },
  { id: 4, title: 'Application Fee', shortTitle: 'Fees' },
  { id: 5, title: 'Selection Process', shortTitle: 'Selection' },
  { id: 6, title: 'Documents', shortTitle: 'Documents' },
  { id: 7, title: 'Advertisement', shortTitle: 'Publish' },
];

export const CreateVacancyDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateVacancyDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VacancyFormData>(defaultVacancyFormData);

  // Generate vacancy ID on open
  useEffect(() => {
    if (open && !formData.vacancyId) {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 900) + 100;
      setFormData(prev => ({
        ...prev,
        vacancyId: `VAC-${year}-${randomNum}`,
        advertisement: {
          ...prev.advertisement,
          notificationNumber: `AVSER/REC/${year}/${randomNum}`,
        },
      }));
    }
  }, [open]);

  const updateFormData = (data: Partial<VacancyFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.postName || !formData.department || !formData.location) {
      toast.error("Please fill in all required fields in Basic Information");
      setCurrentStep(1);
      return;
    }
    onSubmit(formData);
    setFormData(defaultVacancyFormData);
    setCurrentStep(1);
    onOpenChange(false);
    toast.success("Vacancy published successfully!");
  };

  const handleSaveDraft = () => {
    toast.success("Vacancy saved as draft");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <EligibilityStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <TimelineStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <FeeStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <SelectionStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <DocumentsStep formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <AdvertisementStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
              <span className="text-sm font-bold text-accent">A+</span>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Create New Vacancy
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                AVSER+ Recruitment Portal | Govt. of India
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="py-4 border-b border-border shrink-0">
          <FormStepIndicator
            steps={formSteps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-6 px-1">
          {renderStep()}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-border pt-4 shrink-0 gap-2 sm:gap-0">
          <div className="flex w-full justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < formSteps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="gap-2 bg-success text-success-foreground hover:bg-success/90"
                >
                  <Send className="h-4 w-4" />
                  Publish Vacancy
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export type { VacancyFormData };
