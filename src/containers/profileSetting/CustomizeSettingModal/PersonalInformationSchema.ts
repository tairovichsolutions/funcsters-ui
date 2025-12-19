import * as Yup from "yup";

export const PersonalInformationSchema = Yup.object().shape({
  occupation: Yup.string().optional(),
  country: Yup.string().optional(),
  username: Yup.string().required("userName is required"),
  email: Yup.string().email("Invalid Email").required("Email is required"),
});
