import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập (hoặc mã BN) không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn"),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "SĐT không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
  agreed: z.boolean().refine(val => val === true, "Bạn phải đồng ý với điều khoản"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải gồm 6 chữ số"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
