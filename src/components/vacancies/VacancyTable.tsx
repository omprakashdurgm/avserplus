import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number;
  status: "active" | "closed" | "draft";
  postedDate: string;
  closingDate: string;
}

interface VacancyTableProps {
  vacancies: Vacancy[];
  onEdit?: (vacancy: Vacancy) => void;
  onDelete?: (vacancy: Vacancy) => void;
  onView?: (vacancy: Vacancy) => void;
}

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground border-muted",
  draft: "bg-warning/10 text-warning border-warning/20",
};

export const VacancyTable = ({
  vacancies,
  onEdit,
  onDelete,
  onView,
}: VacancyTableProps) => {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden animate-slide-up">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold text-center">Applicants</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Closing Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vacancies.map((vacancy, index) => (
            <TableRow
              key={vacancy.id}
              className="transition-colors hover:bg-muted/30"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell>
                <div>
                  <p className="font-medium">{vacancy.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted {vacancy.postedDate}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {vacancy.department}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {vacancy.location}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {vacancy.type}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                  <Users className="h-3.5 w-3.5" />
                  {vacancy.applicants}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusStyles[vacancy.status])}
                >
                  {vacancy.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {vacancy.closingDate}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onView?.(vacancy)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(vacancy)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(vacancy)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
