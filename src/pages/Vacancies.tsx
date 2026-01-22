import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { VacancyTable, Vacancy } from "@/components/vacancies/VacancyTable";
import { CreateVacancyDialog, VacancyFormData } from "@/components/vacancies/CreateVacancyDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";

const initialVacancies: Vacancy[] = [
  {
    id: "1",
    title: "Senior Technical Officer (Grade-I)",
    department: "IT & Electronics",
    location: "New Delhi",
    type: "Regular",
    applicants: 45,
    status: "active",
    postedDate: "Jan 5, 2026",
    closingDate: "Feb 5, 2026",
  },
  {
    id: "2",
    title: "Administrative Officer",
    department: "Administration",
    location: "Mumbai",
    type: "Regular",
    applicants: 32,
    status: "active",
    postedDate: "Jan 3, 2026",
    closingDate: "Jan 31, 2026",
  },
  {
    id: "3",
    title: "Junior Analyst",
    department: "Finance",
    location: "Chennai",
    type: "Deputation",
    applicants: 28,
    status: "active",
    postedDate: "Jan 1, 2026",
    closingDate: "Jan 25, 2026",
  },
  {
    id: "4",
    title: "Research Associate",
    department: "Research & Development",
    location: "Bangalore",
    type: "Contract",
    applicants: 15,
    status: "draft",
    postedDate: "Dec 28, 2025",
    closingDate: "Jan 28, 2026",
  },
  {
    id: "5",
    title: "Assistant Director",
    department: "Administration",
    location: "New Delhi",
    type: "Regular",
    applicants: 52,
    status: "closed",
    postedDate: "Dec 15, 2025",
    closingDate: "Jan 5, 2026",
  },
  {
    id: "6",
    title: "Section Officer",
    department: "Legal",
    location: "Kolkata",
    type: "Regular",
    applicants: 19,
    status: "active",
    postedDate: "Jan 4, 2026",
    closingDate: "Feb 4, 2026",
  },
  {
    id: "7",
    title: "Deputy Director (HR)",
    department: "Human Resources",
    location: "Mumbai",
    type: "Deputation",
    applicants: 8,
    status: "active",
    postedDate: "Jan 2, 2026",
    closingDate: "Jan 30, 2026",
  },
];

const Vacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const handleCreateVacancy = (data: VacancyFormData) => {
    const employmentTypeMap = {
      permanent: "Regular",
      temporary: "Temporary",
      contract: "Contract",
    };
    
    const newVacancy: Vacancy = {
      id: Date.now().toString(),
      title: data.postName,
      department: data.department,
      location: data.location,
      type: employmentTypeMap[data.employmentType] || "Regular",
      applicants: 0,
      status: "active",
      postedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      closingDate: data.dates.applicationEndDate
        ? new Date(data.dates.applicationEndDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "TBD",
    };
    setVacancies([newVacancy, ...vacancies]);
  };

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vacancy.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || vacancy.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(vacancies.map((v) => v.department))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent font-semibold">Vacancy Management</p>
            <h1 className="text-2xl font-bold tracking-tight mt-1">All Vacancies</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage government job postings and recruitment advertisements
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md gap-2"
          >
            <Plus className="h-4 w-4" />
            Publish New Vacancy
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vacancies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-6 text-sm">
          <span className="text-muted-foreground">
            Total:{" "}
            <span className="font-semibold text-foreground">
              {filteredVacancies.length}
            </span>
          </span>
          <span className="text-muted-foreground">
            Active:{" "}
            <span className="font-semibold text-success">
              {filteredVacancies.filter((v) => v.status === "active").length}
            </span>
          </span>
          <span className="text-muted-foreground">
            Draft:{" "}
            <span className="font-semibold text-warning">
              {filteredVacancies.filter((v) => v.status === "draft").length}
            </span>
          </span>
          <span className="text-muted-foreground">
            Closed:{" "}
            <span className="font-semibold">
              {filteredVacancies.filter((v) => v.status === "closed").length}
            </span>
          </span>
        </div>

        {/* Table */}
        <VacancyTable vacancies={filteredVacancies} />
      </div>

      <CreateVacancyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateVacancy}
      />
    </AdminLayout>
  );
};

export default Vacancies;
