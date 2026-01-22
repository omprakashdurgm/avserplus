import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  feeStatusFilter: string;
  onFeeStatusChange: (value: string) => void;
  completionFilter: string;
  onCompletionChange: (value: string) => void;
  onExport?: () => void;
}

export const ApplicationFilters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  feeStatusFilter,
  onFeeStatusChange,
  completionFilter,
  onCompletionChange,
  onExport,
}: ApplicationFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by Application No., Name, or Email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General (UR)</SelectItem>
            <SelectItem value="obc">OBC</SelectItem>
            <SelectItem value="sc">SC</SelectItem>
            <SelectItem value="st">ST</SelectItem>
            <SelectItem value="ews">EWS</SelectItem>
            <SelectItem value="pwbd">PwBD</SelectItem>
          </SelectContent>
        </Select>

        <Select value={feeStatusFilter} onValueChange={onFeeStatusChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Fee Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fee Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={completionFilter} onValueChange={onCompletionChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Completion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
