import * as Yup from "yup";

export const ResetPasswordSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{5}$/, "OTP must be 5 digits and contain only numbers"),
});
