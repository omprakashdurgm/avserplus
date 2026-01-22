import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FormStep {
  id: number;
  title: string;
  shortTitle: string;
}

interface FormStepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const FormStepIndicator = ({ steps, currentStep, onStepClick }: FormStepIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                className={cn(
                  "flex flex-col items-center group transition-all",
                  onStepClick && "cursor-pointer hover:opacity-80"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all border-2",
                    isCompleted && "bg-success border-success text-success-foreground",
                    isCurrent && "bg-accent border-accent text-accent-foreground",
                    !isCompleted && !isCurrent && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center hidden sm:block",
                    isCurrent && "text-accent",
                    isCompleted && "text-success",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.shortTitle}
                </span>
              </button>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 rounded-full transition-all",
                    currentStep > step.id ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
