"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Success - redirect to login
      router.push("/login?registered=true");
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  }

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-brand hover:text-brand-dark transition-colors">
            <Sparkles className="w-7 h-7" />
            <span>Calendly </span>
          </Link>
          <p className="mt-2 text-subtle">Create your account and start scheduling!</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lift p-8 border border-white/20 animate-scaleIn">
          <h1 className="text-2xl font-bold text-text mb-6">Create account</h1>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="group">
              <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           transition-all duration-300 bg-white
                           hover:border-brand/30"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           transition-all duration-300 bg-white
                           hover:border-brand/30"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Username Input */}
            <div className="group">
              <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           transition-all duration-300 bg-white
                           hover:border-brand/30"
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                           transition-all duration-300 bg-white
                           hover:border-brand/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-brand transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <p className="text-xs text-subtle">
                      Password strength: <span className="font-medium">{strengthLabels[passwordStrength - 1]}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-border text-brand focus:ring-brand focus:ring-2"
              />
              <span className="text-sm text-subtle group-hover:text-text transition-colors">
                I agree to the{" "}
                <Link href="/terms" className="text-brand hover:text-brand-dark font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand hover:text-brand-dark font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand text-white py-3 rounded-lg font-medium
                       hover:bg-brand-dark transition-all duration-300
                       hover:-translate-y-0.5 hover:shadow-xl
                       active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-subtle">Or sign up with</span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg
                       hover:bg-muted hover:border-brand/30 transition-all duration-300
                       hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-text">Google</span>
            </button>
            <button 
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg
                       hover:bg-muted hover:border-brand/30 transition-all duration-300
                       hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium text-text">GitHub</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-subtle">
            Already have an account?{" "}
            <Link href="/login" className="text-brand hover:text-brand-dark font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: CheckCircle2, text: "Free forever" },
            { icon: CheckCircle2, text: "No credit card" },
            { icon: CheckCircle2, text: "Easy setup" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-5 h-5 text-brand" />
              <span className="text-xs text-subtle">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}