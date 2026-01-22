import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import {
    Calendar,
    MapPin,
    Users,
    Briefcase,
    Search,
    LogIn,
    ShieldCheck,
    Clock,
    FileText,
    TrendingUp,
    Archive,
    ChevronRight,
    Bell,
    Sparkles,
    Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - will be replaced with API calls
    const ongoingRecruitments = [
        {
            id: 1,
            title: 'Assistant Engineer (Civil)',
            department: 'Public Works Department',
            vacancies: 45,
            location: 'Multiple Locations',
            lastDate: '2026-02-15',
            postedDate: '2026-01-10',
            status: 'Active',
            category: ['General: 20', 'OBC: 12', 'SC: 8', 'ST: 5'],
            qualification: 'B.E./B.Tech in Civil Engineering',
            experience: '0-2 years',
        },
        {
            id: 2,
            title: 'Junior Clerk',
            department: 'Revenue Department',
            vacancies: 120,
            location: 'State-wide',
            lastDate: '2026-02-20',
            postedDate: '2026-01-12',
            status: 'Active',
            category: ['General: 60', 'OBC: 32', 'SC: 18', 'ST: 10'],
            qualification: '12th Pass with Computer Knowledge',
            experience: 'Fresher',
        },
        {
            id: 3,
            title: 'Medical Officer',
            department: 'Health & Family Welfare',
            vacancies: 30,
            location: 'District Hospitals',
            lastDate: '2026-02-10',
            postedDate: '2026-01-05',
            status: 'Active',
            category: ['General: 15', 'OBC: 8', 'SC: 4', 'ST: 3'],
            qualification: 'MBBS with valid registration',
            experience: '1-3 years',
        },
    ];

    const archivedRecruitments = [
        {
            id: 4,
            title: 'Police Constable',
            department: 'Police Department',
            vacancies: 500,
            location: 'State-wide',
            closedDate: '2025-12-31',
            status: 'Closed',
        },
        {
            id: 5,
            title: 'Teacher (Primary)',
            department: 'Education Department',
            vacancies: 200,
            location: 'Multiple Districts',
            closedDate: '2025-12-25',
            status: 'Closed',
        },
    ];

    const getDaysRemaining = (lastDate: string) => {
        const today = new Date();
        const deadline = new Date(lastDate);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50/30 to-blue-50">
            {/* Floating Header - Glassmorphic */}
            <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4 sm:pt-4">
                <div className="mx-auto max-w-[1400px]">
                    <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-blue-900/5 px-4 sm:px-6 md:px-8">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Logo size="sm" showText={false} />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl hover:bg-blue-50 h-9 sm:h-10 md:h-11 px-3 sm:px-4 text-xs sm:text-sm font-medium"
                                onClick={() => navigate('/login')}
                            >
                                <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Button>
                            <Button
                                size="sm"
                                className="gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 h-9 sm:h-10 md:h-11 px-3 sm:px-4 text-xs sm:text-sm font-semibold"
                                onClick={() => navigate('/admin/login')}
                            >
                                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Admin</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section - Enhanced */}
            <section className="relative overflow-hidden px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-8 md:pb-12">
                <div className="mx-auto max-w-[1400px]">
                    {/* Glassmorphic Hero Card */}
                    <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden shadow-2xl shadow-blue-900/20">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-400/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
                                <div className="inline-flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-orange-300 animate-pulse" />
                                    <Badge className="rounded-full bg-orange-500/90 backdrop-blur-sm text-white border-white/20 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-sm shadow-lg font-semibold">
                                        Government Recruitment Portal
                                    </Badge>
                                    <Sparkles className="h-4 w-4 text-orange-300 animate-pulse" />
                                </div>

                                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight animate-fade-in">
                                    Find Your Dream
                                    <br />
                                    <span className="bg-gradient-to-r from-orange-300 via-orange-200 to-orange-100 bg-clip-text text-transparent">
                                        Government Job
                                    </span>
                                </h2>

                                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100 max-w-2xl mx-auto px-4 leading-relaxed">
                                    Apply for latest government vacancies across various departments
                                </p>

                                {/* Enhanced Search Bar */}
                                <div className="max-w-3xl mx-auto mt-4 sm:mt-6 md:mt-8">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-50 transition-all duration-300" />
                                        <div className="relative flex items-center rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-white/20">
                                            <Search className="absolute left-3 sm:left-4 md:left-5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search jobs, departments, or locations..."
                                                className="h-11 sm:h-12 md:h-14 pl-10 sm:pl-12 md:pl-14 pr-4 text-xs sm:text-sm md:text-base border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Stats */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-6 sm:mt-8 md:mt-10 max-w-4xl mx-auto">
                                    <div className="group rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 sm:p-4 md:p-5 lg:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                        <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-2">
                                            <div className="relative">
                                                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-300 group-hover:scale-110 transition-transform" />
                                                <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full animate-ping" />
                                            </div>
                                            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                                {ongoingRecruitments.length}
                                            </div>
                                            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-blue-200 text-center leading-tight font-medium">
                                                Active Jobs
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 sm:p-4 md:p-5 lg:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                        <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-2">
                                            <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-300 group-hover:scale-110 transition-transform" />
                                            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                                {ongoingRecruitments.reduce((sum, r) => sum + r.vacancies, 0)}
                                            </div>
                                            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-blue-200 text-center leading-tight font-medium">
                                                Vacancies
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 sm:p-4 md:p-5 lg:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                        <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-2">
                                            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-300 group-hover:scale-110 transition-transform" />
                                            <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                                {new Set(ongoingRecruitments.map(r => r.department)).size}
                                            </div>
                                            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-blue-200 text-center leading-tight font-medium">
                                                Departments
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-12">
                <div className="mx-auto max-w-[1400px]">
                    <Tabs defaultValue="ongoing" className="w-full">
                        {/* Enhanced Tabs */}
                        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                            <TabsList className="inline-flex rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg p-1 sm:p-1.5 md:p-2">
                                <TabsTrigger
                                    value="ongoing"
                                    className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl md:rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold transition-all"
                                >
                                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                                    <span>Ongoing</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="archive"
                                    className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl md:rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold transition-all"
                                >
                                    <Archive className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                                    Archive
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Ongoing Recruitments Tab */}
                        <TabsContent value="ongoing" className="space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between px-1">
                                <div>
                                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                        Current Openings
                                        <Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                                    </h3>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5">Apply before deadline</p>
                                </div>
                                <Badge className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg px-2.5 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 text-[10px] sm:text-xs md:text-sm font-bold">
                                    {ongoingRecruitments.length} Active
                                </Badge>
                            </div>

                            {/* Enhanced Grid */}
                            <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                                {ongoingRecruitments
                                    .filter(job =>
                                        searchQuery === '' ||
                                        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        job.location.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((job) => {
                                        const daysLeft = getDaysRemaining(job.lastDate);
                                        const isUrgent = daysLeft <= 7;

                                        return (
                                            <Card
                                                key={job.id}
                                                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                                            >
                                                {/* Enhanced Gradient Border Effect */}
                                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* New Tag for Featured */}
                                                {job.id === 1 && (
                                                    <div className="absolute top-3 right-3 z-10">
                                                        <Badge className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg text-[9px] sm:text-xs px-2 py-0.5 font-bold">
                                                            Featured
                                                        </Badge>
                                                    </div>
                                                )}

                                                <div className="relative">
                                                    <CardHeader className="pb-3 sm:pb-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                                                                    {job.title}
                                                                </CardTitle>
                                                                <CardDescription className="mt-1 sm:mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                                                                    <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-blue-500" />
                                                                    <span className="line-clamp-1 font-medium">{job.department}</span>
                                                                </CardDescription>
                                                            </div>
                                                            {isUrgent && (
                                                                <Badge className="rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg animate-pulse flex-shrink-0 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 font-bold">
                                                                    <Bell className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                                                    Urgent
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="space-y-3 sm:space-y-4 pb-4">
                                                        {/* Enhanced Key Info */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-2.5 sm:p-3 border border-blue-100">
                                                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0">
                                                                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-gray-600 font-medium">Vacancies</p>
                                                                    <p className="text-sm sm:text-base font-bold text-gray-900">{job.vacancies}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-2.5 sm:p-3 border border-orange-100">
                                                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg flex-shrink-0">
                                                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-gray-600 font-medium">Days Left</p>
                                                                    <p className={`text-sm sm:text-base font-bold ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                                                                        {daysLeft}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 rounded-xl bg-gray-50/50 p-2.5 sm:p-3 border border-gray-100">
                                                            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                                                            <span className="line-clamp-1 font-medium">{job.location}</span>
                                                        </div>

                                                        {/* Desktop: Show more details */}
                                                        <div className="hidden lg:block space-y-2">
                                                            <div className="flex items-start gap-2 text-xs text-gray-600 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 border border-gray-100">
                                                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="font-semibold text-gray-700 mb-0.5">Qualification</p>
                                                                    <p className="line-clamp-2">{job.qualification}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 rounded-xl bg-gray-50/50 p-3 border border-gray-100">
                                                                <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                                <div>
                                                                    <span className="font-semibold text-gray-700">Experience:</span> {job.experience}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="rounded-xl bg-gradient-to-br from-blue-50/50 to-orange-50/30 p-3 sm:p-4 space-y-2 border border-blue-100/50">
                                                            <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                                                <Award className="h-3 w-3 text-orange-500" />
                                                                Category-wise Vacancies
                                                            </p>
                                                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                                {job.category.map((cat, idx) => (
                                                                    <Badge
                                                                        key={idx}
                                                                        variant="secondary"
                                                                        className="rounded-full text-[10px] sm:text-xs bg-white/80 backdrop-blur border-0 shadow-sm px-2 sm:px-3 py-0.5 sm:py-1 font-medium"
                                                                    >
                                                                        {cat}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-0">
                                                        <Button
                                                            className="w-full sm:flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 h-11 sm:h-12 text-sm sm:text-base font-bold group"
                                                            onClick={() => navigate(`/vacancies/${job.id}`)}
                                                        >
                                                            View Details
                                                            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full sm:w-auto rounded-2xl border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 h-11 sm:h-12 text-sm sm:text-base font-semibold px-6"
                                                            onClick={() => navigate(`/apply/${job.id}`)}
                                                        >
                                                            Apply Now
                                                        </Button>
                                                    </CardFooter>
                                                </div>
                                            </Card>
                                        );
                                    })}
                            </div>

                            {ongoingRecruitments.filter(job =>
                                searchQuery === '' ||
                                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                job.location.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length === 0 && (
                                    <div className="text-center py-12 sm:py-16 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/20">
                                        <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                                        <p className="text-sm text-gray-600">Try adjusting your search terms</p>
                                    </div>
                                )}
                        </TabsContent>

                        {/* Archive Tab */}
                        <TabsContent value="archive" className="space-y-4 sm:space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between px-1">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Archived Recruitments</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Past recruitment drives</p>
                                </div>
                                <Badge className="rounded-full bg-gray-200 text-gray-700 border-0 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold">
                                    {archivedRecruitments.length} Closed
                                </Badge>
                            </div>

                            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {archivedRecruitments.map((job) => (
                                    <Card
                                        key={job.id}
                                        className="rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base sm:text-lg font-bold text-gray-700 line-clamp-2">
                                                        {job.title}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm">
                                                        <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                                        <span className="line-clamp-1">{job.department}</span>
                                                    </CardDescription>
                                                </div>
                                                <Badge className="rounded-full bg-gray-200 text-gray-700 border-0 flex-shrink-0 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1">
                                                    Closed
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-2.5 sm:space-y-3 pb-4">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 rounded-xl bg-gray-50/50 p-2.5">
                                                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                                <span className="font-medium text-gray-900">{job.vacancies}</span> Vacancies
                                            </div>

                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 rounded-xl bg-gray-50/50 p-2.5">
                                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                                <span className="line-clamp-1">{job.location}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 rounded-xl bg-gray-50/50 p-2.5">
                                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                                Closed: {formatDate(job.closedDate)}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-0">
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-2xl border-2 border-gray-200 hover:bg-gray-50 h-11 text-sm sm:text-base font-semibold"
                                                onClick={() => navigate(`/vacancies/${job.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="px-3 sm:px-4 pb-4 sm:pb-6 mt-8 sm:mt-12">
                <div className="mx-auto max-w-[1400px]">
                    <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg p-6 sm:p-8">
                        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-blue-600" />
                                    About AVSER+
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    Transparent and efficient government recruitment platform for aspiring candidates.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-3">Quick Links</h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                                    <li><a href="#" className="hover:text-orange-600 transition-colors font-medium">How to Apply</a></li>
                                    <li><a href="#" className="hover:text-orange-600 transition-colors font-medium">FAQs</a></li>
                                    <li><a href="#" className="hover:text-orange-600 transition-colors font-medium">Contact Us</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-3">Contact</h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                                    <li className="font-medium">support@avserplus.gov.in</li>
                                    <li className="font-medium">1800-XXX-XXXX</li>
                                    <li>Mon-Fri, 9 AM - 6 PM</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-600">
                            <p className="font-medium">© 2026 AVSER+ Recruitment Portal. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
