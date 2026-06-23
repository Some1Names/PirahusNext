"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import GradientText from "@/src/components/reactbits/GradientText";
import SideRays from "@/src/components/reactbits/SideRays";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { Pixelify_Sans } from "next/font/google";
import { authService } from "@/src/infra/container";

const pixelifySans = Pixelify_Sans({ subsets: ["latin"] });

export default function PasswordSetupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password");

  const onSubmit = async (data: { password?: string }) => {
    setErrorMsg("");
    setLoading(true);
    try {
      await authService.setupPassword(data.password || "");
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to set password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 56px",
          width: "420px",
          flexShrink: 0,
          marginLeft: "150px",
        }}
      >
        <button
          onClick={() => router.push("/auth/login")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: isHovered ? "#6812D2" : "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginBottom: "48px",
            width: "fit-content",
            transition: "color 0.2s ease",
          }}
        >
          <FaArrowLeft size={12} /> TO LOGIN
        </button>

        <div style={{ marginBottom: "40px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Security Setup
          </span>
          <h1 style={{ fontSize: "50px", fontWeight: 500, lineHeight: 1.2 }}>
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              animationSpeed={8}
              showBorder={false}
              className={pixelifySans.className}
            >
              setup_pass
            </GradientText>
          </h1>
          <p
            style={{
              marginTop: "8px",
              fontSize: "14px",
              marginBottom: 0,
              color: "#6b7280",
            }}
          >
            Create a password for your student portal.
          </p>
        </div>

        {success ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "24px",
              borderRadius: "8px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981",
              textAlign: "center",
            }}
          >
            <FaCheckCircle size={40} />
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
              Password Set Successfully!
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
              Redirecting you to the portal home...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#6b7280",
                }}
              >
                New Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "40px",
                  padding: "0 12px",
                  gap: "8px",
                  borderRadius: "6px",
                  border: "1px solid #27272a",
                  backgroundColor: "#09090b",
                }}
              >
                <FaLock style={{ color: "#6b7280", flexShrink: 0 }} size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters long",
                    },
                  })}
                  style={{
                    flex: 1,
                    background: "transparent",
                    fontSize: "14px",
                    outline: "none",
                    border: "none",
                    color: "#fff",
                  }}
                />
                {showPassword ? (
                  <FaEyeSlash
                    style={{ color: "#6b7280", cursor: "pointer" }}
                    size={14}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    style={{ color: "#6b7280", cursor: "pointer" }}
                    size={14}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {errors.password && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#6b7280",
                }}
              >
                Confirm New Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "40px",
                  padding: "0 12px",
                  gap: "8px",
                  borderRadius: "6px",
                  border: "1px solid #27272a",
                  backgroundColor: "#09090b",
                }}
              >
                <FaLock style={{ color: "#6b7280", flexShrink: 0 }} size={14} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) => {
                      if (val !== passwordVal) {
                        return "Passwords do not match";
                      }
                    },
                  })}
                  style={{
                    flex: 1,
                    background: "transparent",
                    fontSize: "14px",
                    outline: "none",
                    border: "none",
                    color: "#fff",
                  }}
                />
                {showConfirmPassword ? (
                  <FaEyeSlash
                    style={{ color: "#6b7280", cursor: "pointer" }}
                    size={14}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <FaEye
                    style={{ color: "#6b7280", cursor: "pointer" }}
                    size={14}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {errorMsg && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "13px",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                width: "100%",
                border: "1px solid #27272a",
                backgroundColor: "#09090b",
                color: "#fff",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "SAVING..." : "SET PASSWORD"} <FaArrowRight size={14} />
            </button>
          </form>
        )}
      </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <SideRays
            speed={2.5}
            rayColor1="#ea08c9"
            rayColor2="#9727d7"
            intensity={0.8}      // was 2
            spread={1.5}         // was 2
            origin="top-right"
            tilt={0}
            saturation={0.8}     // was 1.5
            blend={0.75}
            falloff={2.5}        // was 1.6 — higher = rays die out faster
            opacity={0.6}        // was 1
          />
        </div>
      </div>
  );
}
