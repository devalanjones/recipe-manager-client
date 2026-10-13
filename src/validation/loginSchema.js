import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required")
    .email("Please enter a valid email"),

  password: yup.string().required("Password is required"),
});

export default loginSchema;
