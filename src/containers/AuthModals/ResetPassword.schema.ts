import * as Yup from "yup";

export const ResetPasswordSchema = Yup.object().shape({
  otp: Yup.string().required("OTP is required"),
});
