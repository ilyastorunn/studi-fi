"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { X, ChartLine } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Example study data for the chart
const studyData = [
  { date: "Mon", hours: 2.5 },
  { date: "Tue", hours: 4.2 },
  { date: "Wed", hours: 3.8 },
  { date: "Thu", hours: 5.1 },
  { date: "Fri", hours: 3.3 },
  { date: "Sat", hours: 6.7 },
  { date: "Sun", hours: 4.9 },
];

const chartConfig = {
  hours: {
    label: "Study Hours",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AuthModals() {
  const {
    isLoginModalOpen,
    isSignUpModalOpen,
    isChartModalOpen,
    closeLoginModal,
    closeSignUpModal,
    closeChartModal,
    openChartModal,
    switchToSignUp,
    switchToLogin,
    login,
  } = useAuthStore();

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Sign up form state
  const [signUpForm, setSignUpForm] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Form validation states
  const [loginErrors, setLoginErrors] = useState<Partial<LoginFormData>>({});
  const [signUpErrors, setSignUpErrors] = useState<Partial<SignUpFormData>>({});

  // Handle login form submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const errors: Partial<LoginFormData> = {};
    if (!loginForm.email) errors.email = "Email is required";
    if (!loginForm.password) errors.password = "Password is required";

    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Mock successful login
      const user = {
        id: "1",
        name: loginForm.email.split("@")[0],
        email: loginForm.email,
        initials: loginForm.email.substring(0, 2).toUpperCase(),
      };

      login(user);
      closeLoginModal();

      // Reset form
      setLoginForm({ email: "", password: "" });
      setLoginErrors({});
    }
  };

  // Handle sign up form submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const errors: Partial<SignUpFormData> = {};
    if (!signUpForm.name) errors.name = "Name is required";
    if (!signUpForm.email) errors.email = "Email is required";
    if (!signUpForm.password) errors.password = "Password is required";
    if (signUpForm.password !== signUpForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setSignUpErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Mock successful sign up
      const user = {
        id: "1",
        name: signUpForm.name,
        email: signUpForm.email,
        initials: signUpForm.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2),
      };

      login(user);
      closeSignUpModal();

      // Reset form
      setSignUpForm({ name: "", email: "", password: "", confirmPassword: "" });
      setSignUpErrors({});
    }
  };

  // Update login form
  const updateLoginForm = (field: keyof LoginFormData, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Update sign up form
  const updateSignUpForm = (field: keyof SignUpFormData, value: string) => {
    setSignUpForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (signUpErrors[field]) {
      setSignUpErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
        <DialogContent
          className="p-0 border-none shadow-2xl z-[60] !bg-transparent"
          style={{
            width: "calc(100vw - 40px)",
            maxWidth: "600px",
            maxHeight: "calc(100vh - 80px)",
          }}
          showCloseButton={false}
        >
          {/* Glassmorphism Container */}
          <div
            className="glass-card-modal"
            style={{
              borderRadius: "50px",
              padding: "48px",
              position: "relative",
              width: "100%",
              minHeight: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeLoginModal}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              style={{
                backdropFilter: "blur(10px)",
              }}
            >
              <X size={16} color="#15142F" />
            </button>

            <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full">
              <DialogHeader className="mb-8 text-center">
                <DialogTitle
                  style={{
                    fontFamily: "var(--font-comfortaa)",
                    fontSize: "24px",
                    color: "#15142F",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Welcome Back
                </DialogTitle>
                <p
                  className="text-center items-center justify-center"
                  style={{
                    fontFamily: "var(--font-comfortaa)",
                    fontSize: "18px",
                    color: "#15142F",
                    fontWeight: "400",
                  }}
                >
                  login to studi-fi
                </p>
              </DialogHeader>

              <form onSubmit={handleLoginSubmit} className="space-y-6 w-full">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    placeholder="email address"
                    value={loginForm.email}
                    onChange={(e) => updateLoginForm("email", e.target.value)}
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "rgba(217, 217, 217, 0.9)",
                      borderRadius: "50px",
                      border: loginErrors.email ? "2px solid #E74C3C" : "none",
                      padding: "0 24px",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      outline: "none",
                    }}
                  />
                  {loginErrors.email && (
                    <p
                      style={{
                        color: "#E74C3C",
                        fontSize: "14px",
                        marginTop: "4px",
                        fontFamily: "var(--font-comfortaa)",
                      }}
                    >
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      updateLoginForm("password", e.target.value)
                    }
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "rgba(217, 217, 217, 0.9)",
                      borderRadius: "50px",
                      border: loginErrors.password
                        ? "2px solid #E74C3C"
                        : "none",
                      padding: "0 24px",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      outline: "none",
                    }}
                  />
                  {loginErrors.password && (
                    <p
                      style={{
                        color: "#E74C3C",
                        fontSize: "14px",
                        marginTop: "4px",
                        fontFamily: "var(--font-comfortaa)",
                      }}
                    >
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                {/* Buttons Container */}
                <div className="flex flex-col items-center space-y-4 w-full">
                  {/* Login Button */}
                  <button
                    type="submit"
                    style={{
                      width: "50%",
                      height: "48px",
                      backgroundColor: "rgba(234, 234, 242, 0.3)",
                      borderRadius: "50px",
                      border: "none",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      fontWeight: "600",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Login
                  </button>

                  {/* Login with Google Button */}
                  <button
                    type="button"
                    style={{
                      width: "65%",
                      height: "48px",
                      backgroundColor: "rgba(234, 234, 242, 0.3)",
                      borderRadius: "50px",
                      border: "none",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      fontWeight: "600",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onClick={() => {
                      // Mock Google login
                      const user = {
                        id: "1",
                        name: "Google User",
                        email: "user@gmail.com",
                        initials: "GU",
                      };
                      login(user);
                      closeLoginModal();
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Login with Google
                  </button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p
                  style={{
                    color: "#15142F",
                    fontSize: "14px",
                    fontFamily: "var(--font-comfortaa)",
                  }}
                >
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToSignUp}
                    style={{
                      color: "#4A90E2",
                      fontFamily: "var(--font-comfortaa)",
                      fontWeight: "600",
                      textDecoration: "underline",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpModalOpen} onOpenChange={closeSignUpModal}>
        <DialogContent
          className="p-0 border-none shadow-2xl z-[60] !bg-transparent"
          style={{
            width: "calc(100vw - 40px)",
            maxWidth: "600px",
            maxHeight: "calc(100vh - 80px)",
          }}
          showCloseButton={false}
        >
          {/* Glassmorphism Container */}
          <div
            className="glass-card-modal"
            style={{
              borderRadius: "50px",
              padding: "48px",
              position: "relative",
              width: "100%",
              minHeight: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeSignUpModal}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              style={{
                backdropFilter: "blur(10px)",
              }}
            >
              <X size={16} color="#15142F" />
            </button>

            <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full">
              <DialogHeader className="mb-8 text-center">
                <DialogTitle
                  style={{
                    fontFamily: "var(--font-comfortaa)",
                    fontSize: "28px",
                    color: "#15142F",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Create Account
                </DialogTitle>
                <p
                  style={{
                    fontFamily: "var(--font-comfortaa)",
                    fontSize: "16px",
                    color: "#15142F",
                    fontWeight: "400",
                  }}
                >
                  sign up to studi-fi
                </p>
              </DialogHeader>

              <form onSubmit={handleSignUpSubmit} className="space-y-6 w-full">
                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    placeholder="full name"
                    value={signUpForm.name}
                    onChange={(e) => updateSignUpForm("name", e.target.value)}
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "rgba(217, 217, 217, 0.9)",
                      borderRadius: "50px",
                      border: signUpErrors.name ? "2px solid #E74C3C" : "none",
                      padding: "0 24px",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      outline: "none",
                    }}
                  />
                  {signUpErrors.name && (
                    <p
                      style={{
                        color: "#E74C3C",
                        fontSize: "14px",
                        marginTop: "4px",
                        fontFamily: "var(--font-comfortaa)",
                      }}
                    >
                      {signUpErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    placeholder="email address"
                    value={signUpForm.email}
                    onChange={(e) => updateSignUpForm("email", e.target.value)}
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "rgba(217, 217, 217, 0.9)",
                      borderRadius: "50px",
                      border: signUpErrors.email ? "2px solid #E74C3C" : "none",
                      padding: "0 24px",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      outline: "none",
                    }}
                  />
                  {signUpErrors.email && (
                    <p
                      style={{
                        color: "#E74C3C",
                        fontSize: "14px",
                        marginTop: "4px",
                        fontFamily: "var(--font-comfortaa)",
                      }}
                    >
                      {signUpErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="password"
                    value={signUpForm.password}
                    onChange={(e) =>
                      updateSignUpForm("password", e.target.value)
                    }
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "rgba(217, 217, 217, 0.9)",
                      borderRadius: "50px",
                      border: signUpErrors.password
                        ? "2px solid #E74C3C"
                        : "none",
                      padding: "0 24px",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      outline: "none",
                    }}
                  />
                  {signUpErrors.password && (
                    <p
                      style={{
                        color: "#E74C3C",
                        fontSize: "14px",
                        marginTop: "4px",
                        fontFamily: "var(--font-comfortaa)",
                      }}
                    >
                      {signUpErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="confirm password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) =>
                      updateSignUpForm("confirmPassword", e.target.value)
                    }
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "rgba(217, 217, 217, 0.9)",
                      borderRadius: "50px",
                      border: signUpErrors.confirmPassword
                        ? "2px solid #E74C3C"
                        : "none",
                      padding: "0 24px",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      outline: "none",
                    }}
                  />
                  {signUpErrors.confirmPassword && (
                    <p
                      style={{
                        color: "#E74C3C",
                        fontSize: "14px",
                        marginTop: "4px",
                        fontFamily: "var(--font-comfortaa)",
                      }}
                    >
                      {signUpErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Buttons Container */}
                <div className="flex flex-col items-center space-y-4 w-full">
                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    style={{
                      width: "50%",
                      height: "48px",
                      backgroundColor: "rgba(234, 234, 242, 0.3)",
                      borderRadius: "50px",
                      border: "none",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      fontWeight: "600",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Sign Up
                  </button>

                  {/* Sign Up with Google Button */}
                  <button
                    type="button"
                    style={{
                      width: "65%",
                      height: "48px",
                      backgroundColor: "rgba(234, 234, 242, 0.3)",
                      borderRadius: "50px",
                      border: "none",
                      fontSize: "16px",
                      fontFamily: "var(--font-comfortaa)",
                      color: "#15142F",
                      fontWeight: "600",
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onClick={() => {
                      // Mock Google sign up
                      const user = {
                        id: "1",
                        name: "Google User",
                        email: "user@gmail.com",
                        initials: "GU",
                      };
                      login(user);
                      closeSignUpModal();
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign Up with Google
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p
                  style={{
                    color: "#15142F",
                    fontSize: "14px",
                    fontFamily: "var(--font-comfortaa)",
                  }}
                >
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToLogin}
                    style={{
                      color: "#4A90E2",
                      fontFamily: "var(--font-comfortaa)",
                      fontWeight: "600",
                      textDecoration: "underline",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chart Modal */}
      <Dialog open={isChartModalOpen} onOpenChange={closeChartModal}>
        <DialogContent
          className="p-0 border-none shadow-2xl z-[60] !bg-transparent"
          style={{
            width: "calc(100vw - 40px)",
            maxWidth: "600px",
            maxHeight: "calc(100vh - 80px)",
          }}
          showCloseButton={false}
        >
          {/* Glassmorphism Container */}
          <div
            className="glass-card-modal"
            style={{
              borderRadius: "50px",
              padding: "48px",
              position: "relative",
              width: "100%",
              minHeight: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeChartModal}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              style={{
                backdropFilter: "blur(10px)",
              }}
            >
              <X size={16} color="#15142F" />
            </button>

            <div className="flex flex-col items-center justify-center flex-1 w-full">
              <DialogHeader className="mb-8 text-center">
                <DialogTitle
                  style={{
                    fontFamily: "var(--font-comfortaa)",
                    fontSize: "28px",
                    color: "#15142F",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Your Study Statistics
                </DialogTitle>
                <p
                  style={{
                    fontFamily: "var(--font-comfortaa)",
                    fontSize: "16px",
                    color: "#15142F",
                    fontWeight: "400",
                  }}
                >
                  Daily study hours this week
                </p>
              </DialogHeader>

              {/* Chart Container */}
              <div className="w-full max-w-lg">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart
                    data={studyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <defs>
                      <linearGradient id="fillHours" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-hours)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-hours)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      style={{ 
                        fontSize: "12px", 
                        fontFamily: "var(--font-comfortaa)",
                        fill: "#15142F"
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value}h`}
                      style={{ 
                        fontSize: "12px", 
                        fontFamily: "var(--font-comfortaa)",
                        fill: "#15142F"
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="hours"
                      type="natural"
                      fill="url(#fillHours)"
                      fillOpacity={0.4}
                      stroke="var(--color-hours)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
                
                {/* Chart Summary */}
                <div className="mt-6 text-center">
                  <p
                    style={{
                      fontFamily: "var(--font-comfortaa)",
                      fontSize: "14px",
                      color: "#15142F",
                      fontWeight: "500",
                    }}
                  >
                    Total this week: <span style={{ fontWeight: "600" }}>30.5 hours</span>
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-comfortaa)",
                      fontSize: "12px",
                      color: "#15142F",
                      fontWeight: "400",
                      marginTop: "4px",
                    }}
                  >
                    Daily average: 4.4 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Chart Button */}
      <button
        onClick={openChartModal}
        className="fixed z-50 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{
          bottom: "20px",
          right: "70px",
          width: "60px",
          height: "60px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ChartLine size={30} color="#15142F" />
      </button>
    </>
  );
}
