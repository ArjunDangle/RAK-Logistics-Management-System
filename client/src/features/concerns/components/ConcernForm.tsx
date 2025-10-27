import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IssueType } from "../types";

interface ConcernFormProps {
  orderNumber: string;
  onSubmit: (data: { issueType: IssueType; logisticsNotes: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConcernForm = ({ orderNumber, onSubmit, onCancel, isLoading }: ConcernFormProps) => {
  const [issueType, setIssueType] = useState<IssueType | "">("");
  const [logisticsNotes, setLogisticsNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !logisticsNotes.trim()) return;
    
    onSubmit({
      issueType: issueType as IssueType,
      logisticsNotes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Order Number</Label>
        <div className="text-sm font-medium text-foreground">{orderNumber}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="issueType">Issue Type *</Label>
        <Select value={issueType} onValueChange={(value) => setIssueType(value as IssueType)}>
          <SelectTrigger id="issueType">
            <SelectValue placeholder="Select issue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VAT&TAX&TARIFF payment">VAT&TAX&TARIFF payment</SelectItem>
            <SelectItem value="Import Customs Clearance">Import Customs Clearance</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logisticsNotes">Logistics Notes *</Label>
        <Textarea
          id="logisticsNotes"
          placeholder="Describe the issue and what support is needed..."
          value={logisticsNotes}
          onChange={(e) => setLogisticsNotes(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!issueType || !logisticsNotes.trim() || isLoading}>
          Create Concern
        </Button>
      </div>
    </form>
  );
};
