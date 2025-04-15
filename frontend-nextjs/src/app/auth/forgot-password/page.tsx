"use client";
import { Button, Input, Link, Form, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { authService } from "@/services/authService";

interface FormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email.")
      .required("Email is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors, setStatus }: FormikHelpers<FormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);

      const response = await authService.requestPasswordReset(formData);

      if (response.status === 200) {
        setErrors({});
        setStatus({ success: true });
      } else {
        setErrors({ email: response.message });
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      setErrors({
        email: "An unexpected error occurred. Please try again later.",
      });
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
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Forgot Password</h1>
          <p className="text-small text-default-500">
            Enter your email to receive a password reset link
          </p>
        </div>

        <Formik
          initialValues={{ email: "" }}
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
            status,
            setStatus,
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
                onChange={(e) => {
                  handleChange(e);
                  if (status?.success) setStatus({ success: false }); // Reset success message
                }}
              />
              {touched.email && errors.email && (
                <p style={{ color: "red" }}>{errors.email}</p>
              )}
              {status?.success && (
                <div className="bg-success-100 text-success-700 p-3 rounded-medium mb-2">
                  Password reset link has been sent to your email.
                </div>
              )}
              <Button
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="animate-spin" icon="solar:spinner-line" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            onPress={handleGoogleLogin}
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

        <p className="text-center text-small">
          Remember your password?&nbsp;
          <Link href="/auth/signin" size="sm">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
