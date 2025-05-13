// client/src/validations/RegValidation.js
import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  nationalId: Yup.string()
    .matches(/^[0-9]{8}$/, 'National ID must be 8 digits')
    .required('National ID is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  profileImage: Yup.mixed().notRequired(),
  
});
