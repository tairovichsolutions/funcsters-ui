import * as Yup from "yup";

export const ForgotpasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email is required"),
});
