import { z } from "zod";

export const profileGeneralSchema = z.object({
  fullName: z.string().min(2, "Tên bắt buộc"),
  dob: z.string().min(1, "Ngày sinh bắt buộc"),
  gender: z.enum(["Nam", "Nữ", "Khác"]),
  idNumber: z.string().length(12, "Số CCCD phải 12 chữ số"),
  address: z.string().min(5, "Địa chỉ quá ngắn"),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Chưa rõ"]),
  allergies: z.array(z.string()).optional(),
});

export const profileInsuranceSchema = z.object({
  insuranceNumber: z.string().length(15, "Mã BHYT phải gồm 15 ký tự"),
  expirationDate: z.string(),
  hospitalCode: z.string(),
  frontImage: z.any().optional(),
  backImage: z.any().optional(),
});

export const profileSecuritySchema = z.object({
  currentPassword: z.string().min(1, "Bắt buộc nhập"),
  newPassword: z.string().min(6, "Tối thiểu 6 ký tự"),
  confirmNewPassword: z.string().min(6, "Tối thiểu 6 ký tự"),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmNewPassword"]
});
