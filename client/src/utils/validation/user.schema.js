import { object, string, ref } from "yup";

export const RegSchema = object({
  username: string()
    .required("")
    .min(3, "Пайдаланушы аты 3 символдан кем және 32 ден аспау керек")
    .max(32, "Пайдаланушы аты 3 символдан кем және 32 ден аспау керек")
    .defined(""),
  email: string().required("").email("Дұрыс пошта енгізіңіз").defined(""),
  password: string()
    .min(8, "Құпия кем дегенде сөз 8 символдан тұру керек")
    .max(128, "128 ден аспау керек")
    .required("")
    .defined(""),
});

export const LogInSchema = object({
  email: string().required("*").email("Дұрыс пошта енгізіңіз").defined(""),
  password: string().required().defined(""),
});

export const ForgotPasswordSchema = object({
  email: string()
    .email()
    .lowercase()
    .required("Дұрыс пошта енгізіңіз")
    .defined(""),
});

export const ResetPasswordSchema = object({
  newPassword: string()
    .min(8, "Құпия кем дегенде сөз 8 символдан тұру керек")
    .max(150)
    .required("*")
    .defined(""),
  confirmNewPassword: string()
    .oneOf([ref("newPassword"), undefined], "Құпия сөздер келіспейді")
    .required("*")
    .defined(""),
});

export const UserSchema = object({
  email: string().email().lowercase().required("*").defined(),
  username: string().min(3).max(30).trim().required("*").defined(),
});
