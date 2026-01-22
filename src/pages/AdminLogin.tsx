import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3001/api/auth/admin-login', {
                email,
                password
            });

            if (response.data.success) {
                // Store admin token and data in localStorage
                localStorage.setItem('adminToken', response.data.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.data.admin));

                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            console.error('Admin login error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-grid-white/5" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-4 gap-2 text-white hover:bg-white/10 rounded-2xl"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button>

                {/* Login Card */}
                <Card className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-8 text-white">
                        <div className="absolute inset-0 bg-grid-white/10" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative">
                                    <Logo size="md" showText={false} />
                                    <div className="absolute -top-1 -right-1">
                                        <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
                                    Admin Portal
                                </CardTitle>
                                <Badge className="rounded-full bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs px-2 py-0.5">
                                    Secure
                                </Badge>
                            </div>
                            <CardDescription className="text-center text-orange-100 text-sm sm:text-base">
                                Administrative access only
                            </CardDescription>
                        </div>
                    </div>

                    <form onSubmit={handleLogin}>
                        <CardContent className="p-6 sm:p-8 space-y-5">
                            {/* Security Notice */}
                            <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-3">
                                <div className="flex items-start gap-2">
                                    <Shield className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Secure Login</p>
                                        <p className="text-xs text-gray-300 mt-0.5">
                                            This is a restricted area. All activities are logged.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-red-400">Login Failed</p>
                                            <p className="text-xs text-red-300 mt-0.5">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="admin-email" className="text-sm font-semibold text-white">
                                    Admin Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="admin-email"
                                        type="email"
                                        placeholder="admin@avserplus.gov.in"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="admin-password" className="text-sm font-semibold text-white">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="admin-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter admin password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="admin-remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                        className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                    />
                                    <label
                                        htmlFor="admin-remember"
                                        className="text-sm font-medium text-white cursor-pointer"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm text-orange-300 hover:text-orange-200 p-0 h-auto font-semibold"
                                    onClick={() => navigate('/admin/forgot-password')}
                                >
                                    Forgot password?
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 p-6 sm:p-8 pt-0">
                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 text-base font-bold group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Admin Sign In
                                    </div>
                                )}
                            </Button>

                            {/* Help Text */}
                            <p className="text-xs text-center text-gray-300">
                                By signing in, you agree to comply with all security policies
                            </p>
                        </CardFooter>
                    </form>
                </Card>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-300">
                        Technical issues?{' '}
                        <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold">
                            Contact IT Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
