import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Clock, Mail, MessageSquare } from "lucide-react";
import { defaultMessageTemplates } from "@/types/application";

interface CommunicationPanelProps {
  totalApplicants: number;
  incompleteCount: number;
  feePendingCount: number;
  onSend?: (data: { recipients: string; template: string; message: string; channels: string[] }) => void;
}

export const CommunicationPanel = ({
  totalApplicants,
  incompleteCount,
  feePendingCount,
  onSend,
}: CommunicationPanelProps) => {
  const [recipients, setRecipients] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [channels, setChannels] = useState<string[]>(["email"]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = defaultMessageTemplates.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.body);
    }
  };

  const handleChannelToggle = (channel: string) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const handleSend = () => {
    onSend?.({
      recipients,
      template: selectedTemplate,
      message,
      channels,
    });
  };

  const getRecipientCount = () => {
    switch (recipients) {
      case "all":
        return totalApplicants;
      case "incomplete":
        return incompleteCount;
      case "fee_pending":
        return feePendingCount;
      default:
        return 0;
    }
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Send Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recipients */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider">Send To</Label>
          <RadioGroup value={recipients} onValueChange={setRecipients}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">
                All applicants ({totalApplicants})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="incomplete" id="incomplete" />
              <Label htmlFor="incomplete" className="cursor-pointer">
                Incomplete applications ({incompleteCount})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fee_pending" id="fee_pending" />
              <Label htmlFor="fee_pending" className="cursor-pointer">
                Fee pending ({feePendingCount})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">
                Custom selection
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Message Template */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider">Message Template</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template..." />
            </SelectTrigger>
            <SelectContent>
              {defaultMessageTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider">Message</Label>
          <Textarea
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Available placeholders: [POST_NAME], [CLOSING_DATE], [APPLICATION_NO]
          </p>
        </div>

        {/* Channels */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider">Send Via</Label>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email"
                checked={channels.includes("email")}
                onCheckedChange={() => handleChannelToggle("email")}
              />
              <Label htmlFor="email" className="cursor-pointer flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sms"
                checked={channels.includes("sms")}
                onCheckedChange={() => handleChannelToggle("sms")}
              />
              <Label htmlFor="sms" className="cursor-pointer flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                SMS
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 gap-2">
            <Clock className="h-4 w-4" />
            Schedule Send
          </Button>
          <Button 
            className="flex-1 gap-2 bg-primary hover:bg-primary/90" 
            onClick={handleSend}
            disabled={!message || channels.length === 0}
          >
            <Send className="h-4 w-4" />
            Send Now ({getRecipientCount()})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
