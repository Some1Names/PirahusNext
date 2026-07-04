"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import GradientText from "@/src/components/reactbits/background/GradientText";
import SideRays from "@/src/components/reactbits/background/SideRays";
import {
  FaIdCard,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { Pixelify_Sans } from "next/font/google";
import { authService } from "@/src/infra/container";
import { useUserStore } from "@/src/store/auth";

const pixelifySans = Pixelify_Sans({ subsets: ["latin"] });

export default function Page() {
  const router = useRouter();
  const { getUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      studentId: "",
      password: "",
    },
  });

  const studentId = watch("studentId");

  useEffect(() => {
    setShowPasswordInput(false);
    setErrorMsg("");
  }, [studentId]);

  const onSubmit = async (data: { studentId: string; password?: string }) => {
    setErrorMsg("");
    setLoading(true);
    try {
      if (!showPasswordInput) {
        const res = await authService.login({
          studentId: data.studentId,
        });

        if (res.firstLogin) {
          router.push("/auth/setupprofile");
        } else if (res.hasPassword) {
          setShowPasswordInput(true);
        }
      } else {
        await authService.login({
          studentId: data.studentId,
          password: data.password,
        });
        await getUser();
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Login failed. Please try again.");
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
          onClick={() => (window.location.href = "/")}
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
          <FaArrowLeft size={12} /> BACK
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
            Student Portal
          </span>
          <h1 style={{ fontSize: "50px", fontWeight: 500, lineHeight: 1.2 }}>
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              animationSpeed={8}
              showBorder={false}
              className={pixelifySans.className}
            >
              welcome_
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
            Enter your student ID to continue.
          </p>
        </div>

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
              Student ID
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
              <FaIdCard style={{ color: "#6b7280", flexShrink: 0 }} size={14} />
              <input
                type="text"
                placeholder="e.g. 69090500499"
                {...register("studentId", {
                  required: "Student ID is required",
                })}
                style={{
                  flex: 1,
                  background: "transparent",
                  fontSize: "14px",
                  outline: "none",
                  border: "none",
                  fontFamily: "monospace",
                  color: "#fff",
                }}
              />
            </div>
            {errors.studentId && (
              <span
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {errors.studentId.message}
              </span>
            )}
          </div>

          {showPasswordInput && (
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
                Password
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
                    required: showPasswordInput
                      ? "Password is required"
                      : false,
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
          )}

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
              marginTop: "8px",
              width: "100%",
              border: "1px solid #27272a",
              backgroundColor: "#09090b",
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "SIGNING IN..."
              : showPasswordInput
                ? "SIGN IN"
                : "CONTINUE"}{" "}
            <FaArrowRight size={14} />
          </button>
        </form>

        <p
          style={{
            marginTop: "32px",
            fontSize: "12px",
            marginBottom: 0,
            color: "#6b7280",
          }}
        >
          Forgot your ID?{" "}
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              color: "#fff",
            }}
          >
            click here
          </span>
        </p>
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <SideRays
          speed={2.5}
          rayColor1="#ea08c9"
          rayColor2="#9727d7"
          intensity={0.8}
          spread={1.5}
          origin="top-right"
          tilt={0}
          saturation={0.8}
          blend={0.75}
          falloff={2.5}
          opacity={0.6}
        />
      </div>
    </div>
  );
}
