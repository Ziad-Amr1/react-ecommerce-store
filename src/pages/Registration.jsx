import { useState } from "react";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Phone, Zap, Apple, Eye, EyeOff, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/api/axios"; 

const registrationSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    terms: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms and privacy policy" }),
    }),
});

export default function Registration() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registrationSchema),
    });

    const watchedPassword = watch("password", "");

    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, label: "", color: "text-[var(--color-text-secondary)]" };
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 1) return { score: 1, label: "Weak", color: "text-red-500" };
        if (score === 2 || score === 3) return { score: 2, label: "Medium", color: "text-amber-500" };
        return { score: 3, label: "Strong", color: "text-emerald-500" };
    };

    const passwordStrength = getPasswordStrength(watchedPassword);

    const onSubmit = async (data) => {
        setServerError("");
        try {
            const response = await api.post("/auth/register/send-otp", {
                username: data.username,
                email: data.email,
                password: data.password,
                phone: data.phone,
            });

            console.log("OTP sent successfully:", response.data);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            setServerError(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-4 text-[var(--color-text-primary)] relative">
            
            {/* Logo and Header Section */}
            <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-8 w-8 text-[var(--color-primary)] fill-[var(--color-primary)]" />
                    <span className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        Koda Store
                    </span>
                </div>
                <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
                    Create an account
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Join us and start shopping
                </p>
            </div>

            {/* Registration Card */}
            <div className="w-full max-w-md rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
                
                {serverError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                        {serverError}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Username Field */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                            Username
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-text-secondary)] pointer-events-none">
                                <User className="h-5 w-5" />
                            </span>
                            <Input 
                                type="text" 
                                placeholder="johndoe" 
                                {...register("username")}
                                className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                            />
                        </div>
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-text-secondary)] pointer-events-none">
                                <Mail className="h-5 w-5" />
                            </span>
                            <Input 
                                type="email" 
                                placeholder="you@example.com" 
                                {...register("email")}
                                className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                            Phone Number
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-text-secondary)] pointer-events-none">
                                <Phone className="h-5 w-5" />
                            </span>
                            <Input 
                                type="text" 
                                placeholder="+201234567890" 
                                {...register("phone")}
                                className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-text-secondary)] pointer-events-none">
                                <Lock className="h-5 w-5" />
                            </span>
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...register("password")}
                                className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 pr-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Password  */}
                        {watchedPassword && (
                            <div className="mt-1.5 flex justify-end text-xs">
                                <span className="text-[var(--color-text-secondary)]">
                                    Strength: <span className={`font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                                </span>
                            </div>
                        )}

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div>
                        <div className="flex items-start gap-3 pt-1">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                {...register("terms")}
                                className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-focus-ring)] cursor-pointer accent-[var(--color-primary)]"
                            />
                            <label htmlFor="terms" className="text-xs text-[var(--color-text-secondary)] leading-relaxed cursor-pointer">
                                I agree to the{" "}
                                <a href="#terms" className="font-medium text-[var(--color-link)] hover:underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#privacy" className="font-medium text-[var(--color-link)] hover:underline">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-[var(--radius-xl)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-secondary)] transition-colors shadow-[var(--shadow-sm)] text-base mt-2 disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? "Sending OTP..." : "Create Account"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--color-border)]"></div>
                    </div>
                    <div className="relative px-3 bg-[var(--color-surface)] text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                        Or continue with
                    </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-border)] transition-colors text-xs font-medium text-[var(--color-text-primary)] cursor-pointer">
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        Google
                    </button>

                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-border)] transition-colors text-xs font-medium text-[var(--color-text-primary)] cursor-pointer">
                        <svg className="h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </button>

                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-border)] transition-colors text-xs font-medium text-[var(--color-text-primary)] cursor-pointer">
                        <svg className="h-4 w-4 shrink-0 fill-[var(--color-text-primary)]" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                    </button>

                    <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-border)] transition-colors text-xs font-medium text-[var(--color-text-primary)] cursor-pointer">
                        <Apple className="h-4 w-4 shrink-0 fill-[var(--color-text-primary)]" />
                        Apple
                    </button>
                </div>

                {/* Footer Link */}
                <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-[var(--color-link)] hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>

            {/* Success Modal (Account Done)  */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-md)] animate-in zoom-in-95 duration-200">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] animate-bounce duration-1000">
                            <Check className="h-8 w-8 animate-in zoom-in duration-300" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                            Account created successfully! 
                        </h3>
                        <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                            Your account has been successfully created. OTP sent to your email.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/Verify-otp"
                                className="inline-flex w-full items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-primary)] py-3 px-4 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-secondary)] transition-colors"
                            >
                                Go to Verify-otp
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}