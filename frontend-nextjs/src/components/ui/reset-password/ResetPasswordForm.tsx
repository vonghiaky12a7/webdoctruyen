import { Button, Input, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";

interface FormValues {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  isVisible: boolean;
  isConfirmVisible: boolean;
  toggleVisibility: () => void;
  toggleConfirmVisibility: () => void;
  countdown: number | null;
  handleSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}

export const ResetPasswordForm = ({
  isVisible,
  isConfirmVisible,
  toggleVisibility,
  toggleConfirmVisibility,
  countdown,
  handleSubmit,
}: ResetPasswordFormProps) => {
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Đặt Lại Mật Khẩu</h1>
          <p className="text-small text-default-500">
            Nhập mật khẩu mới của bạn bên dưới
          </p>
        </div>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            isSubmitting,
            errors,
            status,
          }) => (
            <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              {status?.success && (
                <div className="bg-success-100 text-success-700 p-3 rounded-medium mb-2">
                  Mật khẩu đã được đặt lại thành công! Chuyển hướng đến trang
                  đăng nhập sau {countdown}s...
                </div>
              )}

              {errors.password && !status?.success && (
                <div className="bg-danger-100 text-danger-700 p-3 rounded-medium mb-2">
                  {errors.password}
                </div>
              )}

              <Input
                isRequired
                endContent={
                  <button type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-closed-linear"
                      />
                    ) : (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-bold"
                      />
                    )}
                  </button>
                }
                label="Mật khẩu mới"
                name="password"
                placeholder="Nhập mật khẩu mới"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={values.password}
                onChange={handleChange}
                disabled={isSubmitting || status?.success}
              />
              {errors.password && !errors.confirmPassword && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}

              <Input
                isRequired
                endContent={
                  <button type="button" onClick={toggleConfirmVisibility}>
                    {isConfirmVisible ? (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-closed-linear"
                      />
                    ) : (
                      <Icon
                        className="pointer-events-none text-2xl text-default-400"
                        icon="solar:eye-bold"
                      />
                    )}
                  </button>
                }
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                type={isConfirmVisible ? "text" : "password"}
                variant="bordered"
                value={values.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting || status?.success}
              />
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>{errors.confirmPassword}</p>
              )}

              <Button
                className="w-full bg-primary-500 hover:bg-primary-600 text-white mt-2"
                color="primary"
                type="submit"
                disabled={isSubmitting || status?.success}
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
