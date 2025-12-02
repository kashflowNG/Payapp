import { useState } from "react";
import { PayPalFullLogo } from "@/components/PayPalLogo";
import { Eye, EyeOff, Lock, ChevronDown, User, Smartphone, Mail, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LoginStep = "email" | "password" | "verify-code";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  const maskedPhone = "••••••7890";
  const maskedEmail = email ? `${email.substring(0, 3)}•••@${email.split("@")[1] || "demo.com"}` : "tes•••@demo.com";

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
        title: "Verification Code Sent",
        description: "Demo: A 6-digit code has been sent to your phone.",
      });
      setStep("verify-code");
    }, 600);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Verification Successful",
        description: "Demo: You would now be logged in to your PayPal account.",
      });
      setStep("email");
      setEmail("");
      setPassword("");
      setVerificationCode("");
    }, 800);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setPassword("");
    setVerificationCode("");
  };

  const handleBackToPassword = () => {
    setStep("password");
    setVerificationCode("");
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

  const renderEmailStep = () => (
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
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleLogin} data-testid="form-password">
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
  );

  const renderVerifyCodeStep = () => (
    <form onSubmit={handleVerifyCode} data-testid="form-verify-code">
      <button
        type="button"
        onClick={handleBackToPassword}
        className="flex items-center gap-1 text-[#6c7378] hover:text-[#1a1a1a] dark:text-[#8f8f8f] dark:hover:text-white mb-6 transition-colors"
        data-testid="button-back-method"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[14px]">Back</span>
      </button>

      <h1
        className="text-[24px] sm:text-[28px] font-semibold text-[#1a1a1a] dark:text-white mb-2 tracking-tight"
        data-testid="text-title"
      >
        Enter security code
      </h1>

      <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] mb-8">
        We texted your security code to your mobile number ending in {email.slice(-4)}.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-[13px] text-[#2c2e2f] dark:text-[#e0e0e0] mb-1 font-medium">
            Security code
          </label>
          <input
            type="text"
            placeholder="6-digit code"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode(value);
            }}
            className="paypal-input"
            data-testid="input-verification-code"
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="paypal-btn-primary"
          disabled={verificationCode.length < 6 || isLoading}
          data-testid="button-verify"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Continue"
          )}
        </button>

        <div className="text-center">
          <p className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f] mb-2">
            Didn't get the code?
          </p>
          <button
            type="button"
            className="paypal-btn-text text-[14px]"
            onClick={() => {
              toast({
                title: "Code Resent",
                description: "Demo: A new code has been sent to your phone.",
              });
            }}
          >
            Send a new code
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[408px] paypal-card">
          {step === "email" && renderEmailStep()}
          {step === "password" && renderPasswordStep()}
          {step === "verify-code" && renderVerifyCodeStep()}
        </div>

        {/* Security Badge */}
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