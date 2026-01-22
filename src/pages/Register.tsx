import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import {
    UserPlus,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Phone,
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';

const Register = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Password strength calculation
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

    const getStrengthColor = (strength: number) => {
        if (strength <= 1) return 'bg-red-500';
        if (strength <= 2) return 'bg-orange-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength <= 4) return 'bg-lime-500';
        return 'bg-green-500';
    };

    const getStrengthText = (strength: number) => {
        if (strength <= 1) return 'Weak';
        if (strength <= 2) return 'Fair';
        if (strength <= 3) return 'Good';
        if (strength <= 4) return 'Strong';
        return 'Very Strong';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreeToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // Call backend API
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                // Show success message with registration number
                alert(`Registration successful! Your Registration Number is: ${data.data.user.registrationNumber}`);

                // Redirect to login
                navigate('/login');
            } else {
                // Show error message
                alert(data.message || 'Registration failed. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Server error. Please make sure the backend is running.');
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50/30 to-blue-50 flex items-center justify-center p-4 py-8">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-4 gap-2 hover:bg-white/50 rounded-2xl"
                    onClick={() => navigate('/login')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Button>

                {/* Registration Card */}
                <Card className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 text-white">
                        <div className="absolute inset-0 bg-grid-white/10" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative">
                                    <Logo size="md" showText={false} />
                                    <div className="absolute -top-1 -right-1">
                                        <Sparkles className="h-5 w-5 text-orange-300 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold text-center mb-2">
                                Create Your Account
                            </CardTitle>
                            <CardDescription className="text-center text-blue-100 text-sm sm:text-base">
                                Join AVSER+ and start your government job journey
                            </CardDescription>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="p-6 sm:p-8 space-y-5">
                            {/* Personal Information Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email & Phone in Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                            Phone Number <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                    <Lock className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Security</h3>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="space-y-2">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 flex-1 rounded-full transition-all ${i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-600' :
                                                passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                Password strength: {getStrengthText(passwordStrength)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Re-enter your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {formData.confirmPassword && (
                                        <div className="flex items-center gap-2">
                                            {passwordsMatch ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <p className="text-xs font-medium text-green-600">Passwords match</p>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                    <p className="text-xs font-medium text-red-600">Passwords do not match</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={agreeToTerms}
                                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                                        className="mt-1"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                                    >
                                        I agree to the{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                            Terms and Conditions
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 p-6 sm:p-8 pt-0">
                            {/* Register Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 text-base font-bold group"
                                disabled={isLoading || !agreeToTerms}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Create Account
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
                                        Already have an account?
                                    </span>
                                </div>
                            </div>

                            {/* Login Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 rounded-xl border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-base font-semibold"
                                onClick={() => navigate('/login')}
                            >
                                Sign In Instead
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

export default Register;
