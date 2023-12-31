import * as yup from 'yup';

export const RegisterSchema = yup.object().shape({
  username: yup.string().min(3).max(30).required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(150)
    .required(),
});

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .lowercase()
    .defined()
    .required('Email is required'),
  password: yup.string().required('Password is requried'),
});

export const UserSchema = yup.object().shape({
  email: yup.string().email().lowercase().defined(),
  username: yup.string().min(3).max(30),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(150),
});

export const ResetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(150)
    .required('New Password is required')
    .defined(),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords do not match')
    .required('Confirm New Password is required')
    .defined(),
});

export const ChangePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Old Password is required').defined(),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(150)
    .required('New Password is required')
    .defined(),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords do not match')
    .required('Confirm New Password is required')
    .defined(),
});

export const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .lowercase()
    .required('Email is required')
    .defined(),
});
