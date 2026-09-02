import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Lock, Mail, Check, ShoppingBag } from "lucide-react"
import logoImg from "../assets/koda-logo.png"
import googleLogo from "../assets/google-logo.svg"

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
            
            <div className="flex w-full max-w-6xl mt-8 overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--color-surface)] shadow-[var(--shadow-xl)] border border-[var(--color-border)]">
                
                {/* القسم الأيمن (معلومات المنصة) */}
                <div className="hidden w-1/2 flex-col justify-start gap-10 bg-[var(--color-primary)] p-12 text-[var(--color-on-primary)] lg:flex">
                    <div>
                        <div className="mt-12 mb-6 flex items-center gap-3">
                            <ShoppingBag className="h-14 w-14 rounded-[var(--radius-lg)] bg-[var(--color-surface)]/10 p-1 text-[var(--color-on-primary)]" />
                            <span className="text-4xl font-display font-bold">Koda Commerce</span>
                        </div>
                        <h1 className="text-5xl font-display font-bold leading-tight">
                            Manage Your Store Like a Pro
                        </h1>
                        <p className="mt-4 text-lg text-[var(--color-secondary)]">
                            Control products, orders, users, carts and analytics from a modern dashboard experience.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4 backdrop-blur-md">
                            <Check className="h-6 w-6 text-[var(--color-success)]" />
                            <span className="text-base font-medium">Product Management</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4 backdrop-blur-md">
                            <Check className="h-6 w-6 text-[var(--color-success)]" />
                            <span className="text-base font-medium">Order Tracking</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/10 p-4 backdrop-blur-md">
                            <Check className="h-6 w-6 text-[var(--color-success)]" />
                            <span className="text-base font-medium">Customer Insights</span>
                        </div>
                    </div>
                </div>

                {/* قسم نموذج تسجيل الدخول */}
                <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 lg:p-14 bg-[var(--color-surface)]">
                    <div className="mx-auto w-full max-w-md space-y-6">
                        
                        {/* الشعار والعنوان العلوي */}
                        <div className="text-center">
                            <div className="mx-auto flex justify-center items-center">
                                <img src={logoImg} alt="Koda Store" className="h-28 w-48 object-contain" />
                            </div>
                            <h3 className="text-3xl font-display font-bold text-[var(--color-text-primary)] -mt-2">Welcome Back</h3>
                            <p className="text-lg text-[var(--color-text-secondary)]">Sign in to your admin dashboard</p>
                        </div>

                        {/* نموذج الإدخال */}
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]">Email Address</label>
                                <div className="relative">
                                    <Input 
                                        type="email" 
                                        placeholder="admin@gmail.com" 
                                        className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                                    />
                                    <Mail className="absolute left-4 top-4 h-5 w-5 text-[var(--color-text-secondary)]" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-bold text-[var(--color-text-primary)]">Password</label>
                                <div className="relative">
                                    <Input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="bg-[var(--color-surface-secondary)] border-[var(--color-border)] rounded-[var(--radius-xl)] py-6 pl-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus-visible:ring-[var(--color-focus-ring)] text-base"
                                    />
                                    <Lock className="absolute left-4 top-4 h-5 w-5 text-[var(--color-text-secondary)]" />
                                </div>
                            </div>

                            <Link 
                                to="/dashboard" 
                                className="flex w-full items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-primary)] py-4 font-semibold text-[var(--color-on-primary)] transition hover:opacity-90 hover:shadow-lg text-center text-lg"
                            >
                                Sign In
                            </Link>
                        </div>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-[var(--color-border)]"></div>
                            <span className="flex-shrink mx-4 text-xs font-mono text-[var(--color-text-secondary)] uppercase">OR</span>
                            <div className="flex-grow border-t border-[var(--color-border)]"></div>
                        </div>

                        <Link 
                            to="/google-auth" 
                            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] py-4 font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-secondary)] hover:shadow-xl text-center text-base"
                        >
                            <img src={googleLogo} alt="Google Logo" className="h-5 w-5" />
                            Continue with Google
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    )
}