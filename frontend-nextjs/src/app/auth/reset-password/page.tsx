/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormikHelpers } from "formik";
import { authService } from "@/services/authService";
import { InvalidLinkMessage } from "@/components/ui/reset-password/InvalidLinkMessage";
import { ResetPasswordForm } from "@/components/ui/reset-password/ResetPasswordForm";



interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    console.log("token:", token);
    console.log("email:", email);

    if (!token || !email) {
      setErrorMessage("Link đặt lại mật khẩu không hợp lệ.");
    }
  }, [token, email]);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors, setStatus }: FormikHelpers<FormValues>
  ) => {
    try {
      if (!token || !email) {
        setErrors({ password: "Link đặt lại mật khẩu không hợp lệ" });
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("token", token);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.confirmPassword);

      const response = await authService.resetPassword(formData);
      console.log("Reset password response:", response);

      if (response.status) {
        setStatus({ success: true });
        setCountdown(3);
      } else {
        setErrors({
          password:
            response.error || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      setErrors({
        password:
          error.message ||
          "Token không hợp lệ, đã hết hạn hoặc đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Countdown logic
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  // Redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === null || countdown > 0) return;

    router.push("/auth/signin");
  }, [countdown, router]);

  if (!token || !email) {
    return (
      <InvalidLinkMessage
        errorMessage={errorMessage}
        onRequestNewLink={() => router.push("/auth/forgot-password")}
      />
    );
  }

  return (
    <ResetPasswordForm
      isVisible={isVisible}
      isConfirmVisible={isConfirmVisible}
      toggleVisibility={toggleVisibility}
      toggleConfirmVisibility={toggleConfirmVisibility}
      countdown={countdown}
      handleSubmit={handleSubmit}
    />
  );
}
