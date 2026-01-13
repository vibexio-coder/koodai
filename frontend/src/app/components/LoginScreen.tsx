import React, { useState, useEffect } from "react";
import {
  Phone,
  ShoppingBag,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { toast } from "sonner";
import { useUser } from "../contexts/UserContext";
import { Checkbox } from "./ui/checkbox";

interface LoginScreenProps {
  onComplete: () => void;
}

type AuthMode = "welcome" | "login" | "signup";
type LoginStep = "credentials" | "otp";
type SignupStep = "phone" | "otp" | "details";

const toastDesc = (text: string): React.ReactNode => (
  <span style={{ color: "#6B7280" }}>{text}</span> 
);

const WelcomeScreen = ({
  onLogin,
  onSignup,
}: {
  onLogin: () => void;
  onSignup: () => void;
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-lg mb-6">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-black mb-2">KOODAI</h1>
        <p className="text-gray-600 text-center mb-8">
          {t("loginDesc") || "Welcome to Koodai! Your shopping companion"}
        </p>

        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={onLogin}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium transition-all duration-200"
          >
            Login
          </Button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <Button
            onClick={onSignup}
            variant="outline"
            className="w-full border-2 border-yellow-400 hover:bg-yellow-50 text-black py-6 rounded-xl font-medium transition-all duration-200"
          >
            Sign Up
          </Button>

          <p className="text-center text-sm text-gray-500 mt-8">
            By continuing, you agree to our{" "}
            <a href="#" className="text-yellow-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-yellow-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginComponent = ({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) => {
  const { t } = useLanguage();
  const { login, rememberedEmail } = useUser();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isPhoneLogin, setIsPhoneLogin] = useState(false);

  useEffect(() => {
    if (rememberedEmail) {
      setIdentifier(rememberedEmail);
      setRememberMe(true);
      setIsPhoneLogin(false);
    }
  }, [rememberedEmail]);

  // Handle input change - detect if user is typing phone number or email
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);

    const isPhoneInput = /^\d*$/.test(value);

    if (value.length > 0) {
      if (isPhoneInput && value.length <= 10) {
        setIsPhoneLogin(true);
      } else if (!isPhoneInput) {
        setIsPhoneLogin(false);
      }
    } else {
      setIsPhoneLogin(false);
    }
  };

  // Handle login with email and password
  const handleLoginWithCredentials = async () => {
    if (!identifier.trim()) {
      toast.error("Email required", {
        description: toastDesc("Please enter your email address."),
      });
      return;
    }

    if (!password.trim()) {
      toast.error("Password required", {
        description: toastDesc("Please enter your password to continue."),
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      toast.error("Invalid email", {
        description: toastDesc("Please enter a valid email address."),
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password too short", {
        description: toastDesc("Password must be at least 6 characters long."),
      });
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password, rememberMe);
      toast.success("Login Successful!", {
        description: toastDesc("Welcome back to Koodai!"),
      });
      onComplete();
    } catch (error: any) {
      const errorCode = error.code || error.message;

      switch (errorCode) {
        case "auth/user-not-found":
        case "No account found with this email":
          toast.error("Account not found", {
            description: toastDesc(
              "No account was found with this email address. Please sign up first."
            ),
          });
          break;
        case "auth/wrong-password":
        case "Incorrect password":
          toast.error("Incorrect password", {
            description: toastDesc(
              "The password you entered is incorrect. Please try again."
            ),
          });
          break;
        case "auth/invalid-email":
          toast.error("Invalid email", {
            description: toastDesc("Please enter a valid email address."),
          });
          break;
        case "auth/user-disabled":
          toast.error("Account disabled", {
            description: toastDesc(
              "Your account has been disabled. Please contact support."
            ),
          });
          break;
        case "auth/too-many-requests":
          toast.error("Too many attempts", {
            description: toastDesc(
              "Too many failed login attempts. Please try again later."
            ),
          });
          break;
        case "auth/network-request-failed":
          toast.error("Network error", {
            description: toastDesc(
              "Network error. Please check your internet connection and try again."
            ),
          });
          break;
        case "Email already in use":
          toast.error("Email already registered", {
            description: toastDesc(
              "This email is already registered. Please login instead."
            ),
          });
          break;
        default:
          toast.error("Login failed", {
            description: toastDesc("Login failed. Please try again."),
          });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle login with mobile OTP
  const handleLoginWithOTP = async () => {
    if (step === "credentials") {
      // First validate the phone number
      if (!identifier.trim()) {
        toast.error("Mobile number required", {
          description: toastDesc("Please enter your mobile number."),
        });
        return;
      }

      if (identifier.length !== 10) {
        toast.error("Invalid mobile number", {
          description: toastDesc("Please enter a valid 10-digit mobile number."),
        });
        return;
      }

      // Validate phone number format
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(identifier)) {
        toast.error("Invalid number", {
          description: toastDesc("Please enter a valid mobile number."),
        });
        return;
      }

      // Store phone number and proceed to OTP
      setPhone(identifier);

      toast.info("Phone OTP authentication requires additional setup", {
        description: toastDesc("Currently using mock OTP for demonstration."),
      });

      setLoading(true);
      setTimeout(() => {
        setStep("otp");
        toast.success("OTP Sent Successfully!", {
          description: toastDesc("OTP: 123456 (Mock for demonstration)"),
        });
        setLoading(false);
      }, 1500);
    } else {
      // OTP verification step
      if (!otp.trim()) {
        toast.error("OTP required", {
          description: toastDesc("Please enter the 6-digit OTP."),
        });
        return;
      }

      if (otp.length !== 6) {
        toast.error("Invalid OTP", {
          description: toastDesc("Please enter a valid 6-digit OTP."),
        });
        return;
      }

      // Mock OTP validation
      if (otp !== "123456") {
        toast.error("Incorrect OTP", {
          description: toastDesc(
            "The OTP you entered is incorrect. Please try again."
          ),
        });
        return;
      }

      setLoading(true);
      setTimeout(() => {
        toast.success("Login Successful!", {
          description: toastDesc("Welcome to Koodai!"),
        });
        onComplete();
        setLoading(false);
      }, 1500);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    if (!identifier.trim()) {
      toast.error("Email required", {
        description: toastDesc("Please enter your email address first."),
      });
      return;
    }

    // Only allow forgot password for email login
    if (isPhoneLogin) {
      toast.error("Forgot password not available", {
        description: toastDesc(
          "Forgot password is only available for email login. Please enter your email address."
        ),
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      toast.error("Invalid email", {
        description: toastDesc(
          "Please enter a valid email address to reset password."
        ),
      });
      return;
    }

    toast.info("Password reset feature coming soon!", {
      description: toastDesc("We'll send a password reset link to your email."),
    });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-50 to-white flex flex-col overflow-y-auto">
      <div className="p-4 sticky top-0 z-10 ">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2 mt-15">
          Login
        </h1>
        <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
          Choose your preferred login method
        </p>

        <div className="w-full max-w-md space-y-6">
          {step === "credentials" ? (
            <>
              {/* Login Form */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isPhoneLogin ? "Mobile Number" : "Email Address"}
                    </label>

                    {isPhoneLogin ? (
                      <div className="flex gap-2">
                        <div className="w-14 sm:w-16 flex items-center justify-center bg-white border border-gray-300 rounded-xl text-black font-medium text-sm sm:text-base">
                          +91
                        </div>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <Input
                            type="tel"
                            placeholder="9876543210"
                            value={identifier}
                            onChange={handleIdentifierChange}
                            className="pl-9 sm:pl-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                            maxLength={10}
                            inputMode="numeric"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your registered email address"
                          value={identifier}
                          onChange={handleIdentifierChange}
                          className="pl-9 sm:pl-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                          inputMode="email"
                          disabled={loading}
                        />
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      {isPhoneLogin ? "We'll send an OTP to this number" : ""}
                    </p>
                  </div>

                  {/* Show password field only for email login */}
                  {!isPhoneLogin && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <button
                            onClick={handleForgotPassword}
                            disabled={loading}
                            className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline disabled:opacity-50"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-9 sm:pl-10 pr-9 sm:pr-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                          className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 w-4 h-4 sm:w-5 sm:h-5"
                          disabled={loading}
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={
                    isPhoneLogin
                      ? handleLoginWithOTP
                      : handleLoginWithCredentials
                  }
                  disabled={
                    loading ||
                    !identifier.trim() ||
                    (!isPhoneLogin && !password.trim()) ||
                    (isPhoneLogin && identifier.length !== 10)
                  }
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium disabled:opacity-50 text-base sm:text-lg transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      {isPhoneLogin ? "Sending OTP..." : "Logging in..."}
                    </span>
                  ) : isPhoneLogin ? (
                    "Send OTP"
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {isPhoneLogin ? (
                    <p>
                      Using email? Just type your email address to switch to
                      email login.
                    </p>
                  ) : (
                    <p>
                      Using mobile? Just type your 10-digit number to switch to
                      OTP login.
                    </p>
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  Don't have an account?{" "}
                  <button
                    onClick={onBack}
                    disabled={loading}
                    className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium disabled:opacity-50"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          ) : (
            /* OTP Verification Step */
            <>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center text-gray-800">
                  Verify OTP
                </h2>

                <div className="text-center">
                  <p className="text-black font-medium text-base sm:text-lg">
                    +91 {phone}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the 6-digit code sent to your mobile
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-xl mx-1 sm:mx-1 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Didn't receive OTP?{" "}
                    <button
                      onClick={handleLoginWithOTP}
                      disabled={loading}
                      className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    OTP will expire in 5 minutes
                  </p>
                </div>
              </div>

              <Button
                onClick={handleLoginWithOTP}
                disabled={otp.length !== 6 || loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium disabled:opacity-50 text-base sm:text-lg transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </span>
                ) : (
                  "Verify & Login"
                )}
              </Button>

              <Button
                onClick={() => {
                  setStep("credentials");
                  setOtp("");
                }}
                variant="outline"
                disabled={loading}
                className="w-full border-2 border-yellow-400 hover:bg-yellow-50 text-black py-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
              >
                ← Back to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Signup Component with Firebase Integration
const SignupComponent = ({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) => {
  const { t } = useLanguage();
  const { signup } = useUser();
  const [step, setStep] = useState<SignupStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle phone submission (for OTP verification)
  const handleSendOTP = async () => {
    if (!phone.trim()) {
      toast.error("Mobile number required", {
        description: toastDesc("Please enter your mobile number."),
      });
      return;
    }

    if (phone.length !== 10) {
      toast.error("Invalid mobile number", {
        description: toastDesc("Please enter a valid 10-digit mobile number."),
      });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Invalid number", {
        description: toastDesc("Please enter a valid mobile number"),
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setStep("otp");
      toast.success("OTP Sent Successfully!", {
        description: toastDesc("OTP: 123456 (Mock for demonstration)"),
      });
      setLoading(false);
    }, 1500);
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("OTP required", {
        description: toastDesc("Please enter the 6-digit OTP."),
      });
      return;
    }

    if (otp.length !== 6) {
      toast.error("Invalid OTP", {
        description: toastDesc("Please enter a valid 6-digit OTP."),
      });
      return;
    }

    // Mock OTP validation
    if (otp !== "123456") {
      toast.error("Incorrect OTP", {
        description: toastDesc(
          "The OTP you entered is incorrect. Please try again."
        ),
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setStep("details");
      toast.success("OTP Verified Successfully!", {
        description: toastDesc(
          "Mobile number verified. Please complete your details."
        ),
      });
      setLoading(false);
    }, 1500);
  };

  // Handle final signup with Firebase
  const handleCompleteSignup = async () => {
    // Validation with detailed error messages
    if (!name.trim()) {
      toast.error("Name required", {
        description: toastDesc("Please enter your full name."),
      });
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name too short", {
        description: toastDesc("Name must contain at least 2 characters."),
      });
      return;
    }

    if (!email.trim()) {
      toast.error("Email required", {
        description: toastDesc("Please enter your email address."),
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email", {
        description: toastDesc("Please enter a valid email address."),
      });
      return;
    }

    if (!password) {
      toast.error("Password required", {
        description: toastDesc("Please create a password to continue."),
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Weak password", {
        description: toastDesc("Password must be at least 6 characters long."),
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: toastDesc(
          "The passwords do not match. Please check and try again."
        ),
      });
      return;
    }

    if (!acceptTerms) {
      toast.error("Terms not accepted", {
        description: toastDesc(
          "Please accept the Terms of Service and Privacy Policy to continue."
        ),
      });
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, phone, password });
      toast.success("Account Created Successfully!", {
        description: toastDesc(
          "Welcome to Koodai! Your account has been created."
        ),
      });
      onComplete();
    } catch (error: any) {
      const errorCode = error.code || error.message;

      switch (errorCode) {
        case "auth/email-already-in-use":
        case "Email already in use":
          toast.error("Email already registered", {
            description: toastDesc(
              "This email is already registered. Please log in instead."
            ),
          });
          break;
        case "auth/weak-password":
          toast.error("Weak password", {
            description: toastDesc("Password must be at least 6 characters long."),
          });
          break;
        case "auth/invalid-email":
          toast.error("Invalid email", {
            description: toastDesc("Please enter a valid email address."),
          });
          break;
        case "auth/operation-not-allowed":
          toast.error("Operation failed", {
            description: toastDesc(
              "The action could not be completed. Please try again."
            ),
          });
          break;
        case "auth/network-request-failed":
          toast.error("Network error", {
            description: toastDesc(
              "Network error. Please check your internet connection and try again."
            ),
          });
          break;
        case "auth/server-error":
          toast.error("Server error", {
            description: toastDesc(
              "We're having trouble connecting to the server. Please try again later."
            ),
          });
          break;
        default:
          toast.error("Unexpected error", {
            description: toastDesc("Something went wrong. Please try again."),
          });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-yellow-50 to-white flex flex-col overflow-y-auto">
      <div className="p-4 sticky top-0 z-10 ">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 pb-6 mt-15">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-12">
          Sign Up
        </h1>

        <div className="w-full max-w-md space-y-6 mt-8">
          {/* Step indicator */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-8 mb-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  step === "phone"
                    ? "bg-yellow-400 text-black"
                    : step === "otp" || step === "details"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                1
              </div>
              <span className="text-xs mt-1 text-gray-600">Mobile</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  step === "otp"
                    ? "bg-yellow-400 text-black"
                    : step === "details"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                2
              </div>
              <span className="text-xs mt-1 text-gray-600">OTP</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  step === "details"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                3
              </div>
              <span className="text-xs mt-1 text-gray-600">Details</span>
            </div>
          </div>

          {/* Step 1: Mobile Number */}
          {step === "phone" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="w-14 sm:w-16 flex items-center justify-center bg-white border border-gray-300 rounded-xl text-black font-medium text-sm sm:text-base">
                    +91
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="pl-9 sm:pl-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                      maxLength={10}
                      inputMode="numeric"
                      disabled={loading}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send an OTP for verification
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={phone.length !== 10 || loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium disabled:opacity-50 text-base sm:text-lg transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Enter the 6-digit OTP sent to your mobile
                  </p>
                  <p className="text-black font-medium text-base sm:text-lg">
                    +91 {phone}
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-xl mx-1 sm:mx-1 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Didn't receive OTP?{" "}
                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    OTP will expire in 5 minutes
                  </p>
                </div>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium disabled:opacity-50 text-base sm:text-lg transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Button
                onClick={() => setStep("phone")}
                variant="outline"
                disabled={loading}
                className="w-full border-2 border-yellow-400 hover:bg-yellow-50 text-black py-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
              >
                Change Mobile Number
              </Button>
            </>
          )}

          {/* Step 3: User Details */}
          {step === "details" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 sm:pl-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 sm:pl-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                      inputMode="email"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 sm:pl-10 pr-9 sm:pr-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 sm:pl-10 pr-9 sm:pr-10 py-6 bg-white border border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-base sm:text-lg"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                    className="mt-1 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 w-4 h-4 sm:w-5 sm:h-5"
                    disabled={loading}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-yellow-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-yellow-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleCompleteSignup}
                disabled={
                  loading ||
                  !name ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !acceptTerms ||
                  password !== confirmPassword
                }
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-xl shadow-lg font-medium disabled:opacity-50 text-base sm:text-lg transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Already have an account?{" "}
              <button
                onClick={onBack}
                disabled={loading}
                className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium disabled:opacity-50"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main LoginScreen Component
export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("welcome");

  switch (authMode) {
    case "welcome":
      return (
        <WelcomeScreen
          onLogin={() => setAuthMode("login")}
          onSignup={() => setAuthMode("signup")}
        />
      );
    case "login":
      return (
        <LoginComponent
          onBack={() => setAuthMode("welcome")}
          onComplete={onComplete}
        />
      );
    case "signup":
      return (
        <SignupComponent
          onBack={() => setAuthMode("welcome")}
          onComplete={onComplete}
        />
      );
    default:
      return (
        <WelcomeScreen
          onLogin={() => setAuthMode("login")}
          onSignup={() => setAuthMode("signup")}
        />
      );
  }
}