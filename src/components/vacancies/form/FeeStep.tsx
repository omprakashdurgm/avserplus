import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VacancyFormData } from "@/types/vacancy";
import { IndianRupee, CreditCard } from "lucide-react";

interface FeeStepProps {
  formData: VacancyFormData;
  updateFormData: (data: Partial<VacancyFormData>) => void;
}

export const FeeStep = ({ formData, updateFormData }: FeeStepProps) => {
  const updateFee = (field: keyof typeof formData.fee, value: any) => {
    updateFormData({
      fee: {
        ...formData.fee,
        [field]: value,
      },
    });
  };

  const togglePaymentMode = (mode: string) => {
    const currentModes = formData.fee.paymentModes;
    if (currentModes.includes(mode)) {
      updateFee('paymentModes', currentModes.filter((m) => m !== mode));
    } else {
      updateFee('paymentModes', [...currentModes, mode]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-accent/10">
          <IndianRupee className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Application Fee Structure</h3>
          <p className="text-sm text-muted-foreground">Configure fee amounts and payment options</p>
        </div>
      </div>

      {/* Fee Amounts */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Fee by Category
        </Label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="feeGeneral" className="flex items-center gap-1">
              General / OBC / EWS
              <span className="text-xs text-muted-foreground">(₹)</span>
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="feeGeneral"
                type="number"
                min="0"
                className="pl-9"
                value={formData.fee.generalOBCEWS || ''}
                onChange={(e) => updateFee('generalOBCEWS', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feeReserved" className="flex items-center gap-1">
              SC / ST / PwBD / Women
              <span className="text-xs text-muted-foreground">(₹)</span>
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="feeReserved"
                type="number"
                min="0"
                className="pl-9"
                value={formData.fee.scStPwbdWomen || ''}
                onChange={(e) => updateFee('scStPwbdWomen', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feeExam" className="flex items-center gap-1">
              Examination Fee
              <span className="text-xs text-muted-foreground">(if applicable)</span>
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="feeExam"
                type="number"
                min="0"
                className="pl-9"
                value={formData.fee.examinationFee || ''}
                onChange={(e) => updateFee('examinationFee', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Payment Modes</Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-card">
            <Checkbox
              id="online"
              checked={formData.fee.paymentModes.includes('online')}
              onCheckedChange={() => togglePaymentMode('online')}
            />
            <div className="space-y-1">
              <Label htmlFor="online" className="text-sm font-medium cursor-pointer">
                Online Payment
              </Label>
              <p className="text-xs text-muted-foreground">
                Credit/Debit Card, Net Banking, UPI
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-card">
            <Checkbox
              id="offline"
              checked={formData.fee.paymentModes.includes('offline')}
              onCheckedChange={() => togglePaymentMode('offline')}
            />
            <div className="space-y-1">
              <Label htmlFor="offline" className="text-sm font-medium cursor-pointer">
                Offline Payment
              </Label>
              <p className="text-xs text-muted-foreground">
                Challan at designated banks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Policy */}
      <div className="space-y-2">
        <Label htmlFor="refundPolicy">Refund Policy</Label>
        <Select
          value={formData.fee.refundPolicy}
          onValueChange={(value) => updateFee('refundPolicy', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select refund policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Non-refundable">Non-refundable</SelectItem>
            <SelectItem value="Refundable before deadline">Refundable before deadline</SelectItem>
            <SelectItem value="Partial refund (50%)">Partial refund (50%)</SelectItem>
            <SelectItem value="Full refund if cancelled">Full refund if cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fee Summary Card */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <Label className="text-xs font-medium text-primary uppercase tracking-wide mb-3 block">
          Fee Summary
        </Label>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Category</span>
            <span className="text-sm font-medium">Amount</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">General / OBC / EWS</span>
            <span className="font-semibold">₹{formData.fee.generalOBCEWS.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">SC / ST / PwBD / Women</span>
            <span className="font-semibold">₹{formData.fee.scStPwbdWomen.toLocaleString()}</span>
          </div>
          {formData.fee.examinationFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Examination Fee</span>
              <span className="font-semibold">₹{formData.fee.examinationFee.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Payment Modes:</span>
              <span className="capitalize">{formData.fee.paymentModes.join(', ') || 'None selected'}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
              <span>Refund:</span>
              <span>{formData.fee.refundPolicy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
