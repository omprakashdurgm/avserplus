import { Search, Filter, SlidersHorizontal, LayoutGrid, Table2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  departmentFilter: string;
  onDepartmentChange: (dept: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
}

const departments = [
  "All Departments",
  "IT & Electronics",
  "Administration",
  "Finance",
  "Legal",
  "Research & Development",
  "Public Relations",
  "Human Resources",
];

const sortOptions = [
  { value: "latest", label: "Latest First" },
  { value: "deadline", label: "By Deadline" },
  { value: "applications", label: "By Applications" },
  { value: "progress", label: "By Progress" },
];

export const SearchFilters = ({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: SearchFiltersProps) => {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Vacancy ID, Title, or Department..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 bg-card border-border"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        <Select value={departmentFilter} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-[180px] h-9 bg-card">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 ml-auto">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort:</span>
          </div>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[150px] h-9 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg ml-2 bg-card">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("cards")}
              className={cn(
                "h-9 px-3 rounded-r-none",
                viewMode === "cards" && "bg-accent/10 text-accent"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("table")}
              className={cn(
                "h-9 px-3 rounded-l-none border-l border-border",
                viewMode === "table" && "bg-accent/10 text-accent"
              )}
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
