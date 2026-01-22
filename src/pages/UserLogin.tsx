import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const UserLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Call backend API
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                // Show success message
                alert(`Welcome back, ${data.data.user.name}! Registration Number: ${data.data.user.registrationNumber}`);

                // Redirect to user dashboard
                navigate('/user');
            } else {
                // Show error message
                alert(data.message || 'Login failed. Please check your credentials.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Server error. Please make sure the backend is running.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50/30 to-blue-50 flex items-center justify-center p-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-4 gap-2 hover:bg-white/50 rounded-2xl"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button>

                {/* Login Card */}
                <Card className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 text-white">
                        <div className="absolute inset-0 bg-grid-white/10" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-4">
                                <Logo size="md" showText={false} />
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold text-center mb-2">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-center text-blue-100 text-sm sm:text-base">
                                Sign in to your AVSER+ account
                            </CardDescription>
                        </div>
                    </div>

                    <form onSubmit={handleLogin}>
                        <CardContent className="p-6 sm:p-8 space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot password?
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 p-6 sm:p-8 pt-0">
                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 text-base font-bold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <LogIn className="h-5 w-5" />
                                        Sign In
                                    </div>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">
                                        Don't have an account?
                                    </span>
                                </div>
                            </div>

                            {/* Register Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 rounded-xl border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-base font-semibold"
                                onClick={() => navigate('/register')}
                            >
                                Create Account
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Need help?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
