import * as Yup from "yup";

export const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Current Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "New Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("newPassword") as unknown as string],
      "Passwords must match"
    )
    .required("Confirm password is required"),
});
