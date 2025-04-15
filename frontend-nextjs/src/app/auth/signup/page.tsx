/* eslint-disable @typescript-eslint/no-explicit-any */
// components/auth/Signup.tsx
"use client";

import React, { useEffect } from "react";
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
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(30, "Tên người dùng chỉ được tối đa 30 ký tự")
    .required("Tên người dùng là bắt buộc"),
  email: Yup.string()
    .email("Vui lòng nhập email hợp lệ")
    .matches(/@gmail\.com$/, "Vui lòng nhập đúng định dạng abc@gmaiil.com")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[a-zA-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái")
    .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số")
    .matches(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Mật khẩu xác nhận là bắt buộc"),
  terms: Yup.boolean()
    .oneOf([true], "Bạn phải chấp nhận các điều khoản và điều kiện")
    .required("Bạn phải chấp nhận các điều khoản và điều kiện"),
});

export default function Signup() {
  const router = useRouter();
  const { signup, isLogged } = useAuthStore();

  useEffect(() => {
    if (isLogged) router.push("/");
  }, [isLogged, router]);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: FormikHelpers<FormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);

      await signup(formData);

      addToast({
        title: "Success",
        description: "Đăng ký thành công",
        color: "success",
        timeout: 2500,
        shouldShowTimeoutProgress: true,
      });
      
      router.push("/auth/signin");
    } catch (error: any) {
      // Xử lý lỗi từ API
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setErrors({
          username: errorData.errors.username?.[0] || "",
          email: errorData.errors.email?.[0] || "",
        });
      } else {
        const errorMessage = errorData?.message || "Đăng ký thất bại";
        setErrors({ email: errorMessage }); // Hiển thị lỗi chung nếu không có lỗi cụ thể
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <h1 className="text-large font-medium">Create an account</h1>
        <p className="text-small text-default-500">Sign up to continue</p>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            isSubmitting,
            errors,
            touched,
          }) => (
            <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Input
                isRequired
                label="Username"
                name="username"
                placeholder="Enter your username"
                variant="bordered"
                value={values.username}
                onChange={handleChange}
                errorMessage={errors.username}
              />

              <Input
                isRequired
                label="Email Address"
                name="email"
                placeholder="example@gmail.com"
                type="email"
                variant="bordered"
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />

              <Input
                isRequired
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                value={values.password}
                onChange={handleChange}
              />
              {touched.password && errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}

              <Input
                isRequired
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your password"
                type="password"
                variant="bordered"
                value={values.confirmPassword}
                onChange={handleChange}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}

              <Checkbox
                color="danger"
                name="terms"
                size="sm"
                checked={values.terms}
                onChange={handleChange}
              >
                I agree to the terms and conditions
              </Checkbox>
              {touched.terms && errors.terms && (
                <p className="text-red-500">{errors.terms}</p>
              )}

              <Button
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>

        <DividerWithText text="OR" />
        <SocialLoginButtons onGoogleLogin={handleGoogleLogin} />

        <p className="text-center text-small">
          Already have an account?{" "}
          <Link href="/auth/signin" size="sm">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

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
