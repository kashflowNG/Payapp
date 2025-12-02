import { useState } from "react";
import { PayPalFullLogo } from "@/components/PayPalLogo";
import { Eye, EyeOff, Lock, ChevronDown, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep("password");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Demo Login",
        description: "This is a demo. No actual login was performed.",
      });
    }, 1500);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setPassword("");
  };

  const footerLinks = [
    "Help",
    "Contact",
    "Fees", 
    "Security",
    "Apps",
    "Shop",
    "Enterprise",
    "Partners"
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-10 sm:pt-16 pb-8 px-4">
        {/* Logo */}
        <div className="mb-10">
          <PayPalFullLogo className="h-[28px] sm:h-[32px] w-auto" />
        </div>

        {/* Login Card */}
        <div className="paypal-card w-full max-w-[440px]">
          {step === "email" ? (
            <form onSubmit={handleEmailNext} data-testid="form-email">
              <h1 
                className="text-[24px] sm:text-[28px] font-semibold text-[#1a1a1a] dark:text-white text-center mb-8 tracking-tight"
                data-testid="text-title"
              >
                Log in to PayPal
              </h1>
              
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Email or mobile number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="paypal-input"
                    data-testid="input-email"
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="paypal-btn-primary"
                  disabled={!email.trim()}
                  data-testid="button-next"
                >
                  Next
                </button>

                <div className="paypal-divider">
                  <span className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f] font-medium">or</span>
                </div>

                <button
                  type="button"
                  className="paypal-btn-secondary"
                  data-testid="button-signup"
                  onClick={() => {
                    toast({
                      title: "Demo Mode",
                      description: "Sign up is not available in this demo.",
                    });
                  }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} data-testid="form-password">
              {/* User Avatar and Email */}
              <div className="flex flex-col items-center mb-8">
                <div 
                  className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#0070e0] to-[#003087] flex items-center justify-center text-[28px] font-semibold text-white mb-4 shadow-lg"
                  data-testid="avatar-user"
                >
                  {email.charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="paypal-link text-[15px] flex items-center gap-1"
                  data-testid="button-change-email"
                >
                  {email}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="paypal-input pr-14"
                    data-testid="input-password"
                    autoComplete="current-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c7378] hover:text-[#1a1a1a] dark:text-[#8f8f8f] dark:hover:text-white transition-colors"
                    data-testid="button-toggle-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-2 border-[#c4c4c4] text-[#0070e0] focus:ring-[#0070e0] focus:ring-offset-0"
                    />
                    <span className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f] group-hover:text-[#1a1a1a] dark:group-hover:text-white transition-colors">
                      Stay logged in
                    </span>
                  </label>
                  <button
                    type="button"
                    className="paypal-btn-text"
                    data-testid="link-forgot-password"
                    onClick={() => {
                      toast({
                        title: "Demo Mode",
                        description: "Password recovery is not available in this demo.",
                      });
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="paypal-btn-primary flex items-center justify-center gap-2"
                  disabled={!password.trim() || isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </button>

                <div className="paypal-divider">
                  <span className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f] font-medium">or</span>
                </div>

                <button
                  type="button"
                  className="paypal-btn-secondary flex items-center justify-center gap-2"
                  data-testid="button-one-touch"
                  onClick={() => {
                    toast({
                      title: "Demo Mode",
                      description: "One Touch login is not available in this demo.",
                    });
                  }}
                >
                  <User className="w-5 h-5" />
                  Log in with a one-time code
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Badge - Moved below card for 2024 design */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Lock className="w-4 h-4 text-[#6c7378] dark:text-[#8f8f8f]" />
          <span className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f]" data-testid="text-security">
            Secure connection
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-[#e8e8e8] dark:border-[#2a2a2a]">
        <div className="max-w-[800px] mx-auto">
          {/* Language Selector */}
          <div className="flex items-center justify-center gap-1 mb-5">
            <button 
              className="flex items-center gap-1 paypal-btn-text text-[13px]"
              data-testid="button-language"
              onClick={() => {
                toast({
                  title: "Demo Mode",
                  description: "Language selection is not available in this demo.",
                });
              }}
            >
              English
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-5">
            {footerLinks.map((link) => (
              <button
                key={link}
                className="paypal-btn-text text-[13px]"
                data-testid={`link-footer-${link.toLowerCase()}`}
                onClick={() => {
                  toast({
                    title: "Demo Mode",
                    description: `${link} page is not available in this demo.`,
                  });
                }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Copyright */}
          <p 
            className="text-[12px] text-[#6c7378] dark:text-[#8f8f8f] text-center"
            data-testid="text-copyright"
          >
            &copy; 1999-{new Date().getFullYear()} PayPal, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
