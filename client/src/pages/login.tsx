import { useState } from "react";
import { PayPalLogo } from "@/components/PayPalLogo";
import { Eye, EyeOff, Lock, Globe } from "lucide-react";
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
    ["Help", "Contact", "Fees", "Security"],
    ["Apps", "Shop", "Enterprise", "Partners"],
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-8 pb-12 px-4 sm:pt-12">
        {/* Logo */}
        <div className="mb-8">
          <PayPalLogo className="h-[30px] sm:h-[36px] w-auto" />
        </div>

        {/* Login Card */}
        <div className="paypal-card w-full max-w-[408px]">
          {step === "email" ? (
            <form onSubmit={handleEmailNext} data-testid="form-email">
              <h1 
                className="text-[22px] sm:text-[28px] font-normal text-[#2c2e2f] text-center mb-6"
                data-testid="text-title"
              >
                Log in to your PayPal account
              </h1>
              
              <div className="space-y-4">
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
                  style={{ opacity: email.trim() ? 1 : 0.6 }}
                >
                  Next
                </button>

                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-[#cbd2d6]"></div>
                  <span className="text-[13px] text-[#6c7378]">or</span>
                  <div className="flex-1 h-px bg-[#cbd2d6]"></div>
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
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full bg-[#e6f0f7] flex items-center justify-center text-2xl text-[#0070ba] mb-3"
                  data-testid="avatar-user"
                >
                  {email.charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="paypal-link text-[14px]"
                  data-testid="button-change-email"
                >
                  {email}
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="paypal-input pr-12"
                    data-testid="input-password"
                    autoComplete="current-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c7378] hover:text-[#2c2e2f]"
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

                <div className="text-right">
                  <button
                    type="button"
                    className="paypal-link text-[13px]"
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
                  style={{ opacity: password.trim() && !isLoading ? 1 : 0.6 }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </button>

                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-[#cbd2d6]"></div>
                  <span className="text-[13px] text-[#6c7378]">or</span>
                  <div className="flex-1 h-px bg-[#cbd2d6]"></div>
                </div>

                <button
                  type="button"
                  className="paypal-btn-secondary"
                  data-testid="button-one-touch"
                  onClick={() => {
                    toast({
                      title: "Demo Mode",
                      description: "One Touch is not available in this demo.",
                    });
                  }}
                >
                  Log In with One Touch
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-6 px-4">
        {/* Security Message */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Lock className="w-4 h-4 text-[#6c7378]" />
          <span className="text-[12px] text-[#6c7378]" data-testid="text-security">
            We'll never ask for your password via email.
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-center gap-1 mb-6">
          <Globe className="w-4 h-4 text-[#0070ba]" />
          <button 
            className="paypal-link text-[13px]"
            data-testid="button-language"
            onClick={() => {
              toast({
                title: "Demo Mode",
                description: "Language selection is not available in this demo.",
              });
            }}
          >
            English
          </button>
        </div>

        {/* Footer Links */}
        <div className="max-w-[600px] mx-auto mb-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {footerLinks.flat().map((link) => (
              <button
                key={link}
                className="paypal-link text-[12px]"
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
        </div>

        {/* Copyright */}
        <p 
          className="text-[11px] text-[#6c7378] text-center"
          data-testid="text-copyright"
        >
          &copy; 1999-{new Date().getFullYear()} PayPal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
