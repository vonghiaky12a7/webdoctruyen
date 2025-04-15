/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Form,
  Divider,
  addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/stores/authStore";


interface FormValues {
  email: string;
  password: string;
  remember: boolean;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  remember: Yup.boolean(),
});

export default function Signin() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("remember", values.remember.toString());

      await login(formData);
      addToast({
        title: "Success",
        description: "Đăng nhập thành công",
        color: "success",
        timeout: 2500,
      });
      router.replace("/"); // Để middleware quyết định chuyển hướng
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.field) {
        // Lấy lỗi cụ thể theo field
        setErrors({
          [errorData.field]: errorData.message,
        });
      } else {
        // Xử lý lỗi không xác định
        addToast({
          title: "Error",
          description: "Đăng nhập thất bại. Vui lòng thử lại.",
          color: "danger",
          timeout: 2500,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

const handleGoogleLogin = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url; // Chuyển hướng người dùng đến Google
      } else {
        throw new Error("Không nhận được URL chuyển hướng từ server");
      }
    } else {
      throw new Error(
        "Google login API request failed: " + response.statusText
      );
    }
  } catch (error) {
    console.error("Error during Google login:", error);
    addToast({
      title: "Error",
      description: "Google login failed. Please try again.",
      color: "danger",
      timeout: 2500,
      shouldShowTimeoutProgress: true,
    });
  }
};

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <h1 className="text-large font-medium">Sign in to your account</h1>
        <Formik
          initialValues={{ email: "", password: "", remember: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            errors,
          }) => (
            <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Input
                isRequired
                label="Email Address"
                name="email"
                placeholder="myname@gmail.com"
                type="email"
                variant="bordered"
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />
              <Input
                isRequired
                endContent={
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <Icon
                      icon={
                        isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"
                      }
                      className="pointer-events-none text-2xl text-default-400"
                    />
                  </button>
                }
                label="Password"
                name="password"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
              />
              <div className="flex items-center justify-between px-1 py-2 w-full">
                <Checkbox
                  color="danger"
                  name="remember"
                  size="sm"
                  checked={values.remember}
                  onChange={(e) => setFieldValue("remember", e.target.checked)}
                >
                  Remember me
                </Checkbox>
                <Link
                  className="text-default-500"
                  href="/auth/forgot-password"
                  size="sm"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>

        <DividerWithText text="OR" />
        <SocialLoginButtons onGoogleLogin={handleGoogleLogin} />

        <p className="text-center text-small">
          Need to create an account?{" "}
          <Link href="/auth/signup" size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// Các component phụ không thay đổi
const DividerWithText = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 py-2">
    <Divider className="flex-1" />
    <p className="shrink-0 text-tiny text-default-500">{text}</p>
    <Divider className="flex-1" />
  </div>
);

const SocialLoginButtons = ({
  onGoogleLogin,
}: {
  onGoogleLogin: () => void;
}) => (
  <div className="flex flex-col gap-2">
    <Button
      startContent={<Icon icon="flat-color-icons:google" width={24} />}
      variant="bordered"
      onPress={onGoogleLogin}
    >
      Continue with Google
    </Button>
    <Button
      startContent={
        <Icon className="text-default-500" icon="fe:github" width={24} />
      }
      variant="bordered"
    >
      Continue with Github
    </Button>
  </div>
);
