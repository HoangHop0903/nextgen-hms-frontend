'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  loginSchema, LoginValues, 
  registerSchema, RegisterValues,
  forgotPasswordSchema, ForgotPasswordValues,
  otpSchema, OtpValues
} from '@/schemas/auth.schema';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/client';
import { useMutation } from '@tanstack/react-query';

type AuthView = 'login' | 'register' | 'forgot-password' | 'verify-otp';

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Forms
  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const forgotForm = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });
  const otpForm = useForm<OtpValues>({ resolver: zodResolver(otpSchema) });

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginValues) => {
      // Send as query parameters since FastAPI auth endpoint takes username & password as params
      return await apiClient.post(`/auth/login?username=${data.username}&password=${data.password}`);
    },
    onSuccess: (res) => {
      const { access_token, user_id } = res.data;
      localStorage.setItem('hms-patient-token', access_token);
      localStorage.setItem('hms-patient-id', user_id);
      router.push('/dashboard');
    },
    onError: (err: any) => {
      alert("Đăng nhập thất bại: " + (err.response?.data?.detail || "Lỗi máy chủ"));
    }
  });

  const onLoginSubmit = (data: LoginValues) => {
    loginMutation.mutate(data);
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left fixed side */}
      <div className="hidden lg:flex w-1/2 bg-linear-to- from-brand-primary to-brand-secondary flex-col justify-center items-center text-white p-12">
        <Stethoscope className="h-24 w-24 mb-8 opacity-90" />
        <h1 className="text-4xl font-bold mb-4 text-center">NextGen HMS</h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          Truy cập hồ sơ sức khỏe cá nhân, đặt lịch khám nhanh chóng và tiện lợi mọi lúc mọi nơi.
        </p>
      </div>

      {/* Right dynamic side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* LOGIN VIEW */}
            {view === 'login' && (
              <motion.div key="login" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Đăng nhập</h2>
                  <p className="text-slate-500 mt-2">Nhập email và mật khẩu để tiếp tục.</p>
                </div>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập / Mã BN</Label>
                    <Input id="username" placeholder="BN-0001" {...loginForm.register("username")} />
                    {loginForm.formState.errors.username && <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>}
                  </div>
                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <button type="button" onClick={() => setView('forgot-password')} className="text-sm text-brand-primary hover:underline">Quên mật khẩu?</button>
                    </div>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} {...loginForm.register("password")} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-brand-primary text-white" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-600">
                  Chưa có tài khoản? <button onClick={() => setView('register')} className="text-brand-primary font-medium hover:underline">Đăng ký ngay</button>
                </p>
              </motion.div>
            )}

            {/* REGISTER VIEW */}
            {view === 'register' && (
              <motion.div key="register" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Tạo tài khoản mới</h2>
                  <p className="text-slate-500 mt-2">Vui lòng điền thông tin cá nhân của bạn.</p>
                </div>
                <form className="space-y-4">
                  {/* ... Cắt ngắn bớt các input để làm template pattern chuẩn theo lệnh */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Họ và tên</Label>
                       <Input placeholder="Nguyễn Văn A" {...registerForm.register("fullName")} />
                    </div>
                    <div className="space-y-2">
                       <Label>Số điện thoại</Label>
                       <Input placeholder="0901234567" {...registerForm.register("phone")} />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" {...registerForm.register("email")} />
                  </div>
                  <div className="space-y-2">
                      <Label>Mật khẩu</Label>
                      <Input type="password" {...registerForm.register("password")} />
                  </div>
                  <Button type="button" onClick={() => setView('verify-otp')} className="w-full bg-brand-primary mt-4 text-white">Tiếp tục (Nhận OTP)</Button>
                </form>
                 <p className="mt-6 text-center text-sm text-slate-600">
                  Đã có tài khoản? <button onClick={() => setView('login')} className="text-brand-primary font-medium hover:underline">Đăng nhập</button>
                </p>
              </motion.div>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {view === 'forgot-password' && (
              <motion.div key="forgot-password" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Quét lại mật khẩu</h2>
                  <p className="text-slate-500 mt-2">Nhập email của bạn để nhận mã khôi phục.</p>
                </div>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" {...forgotForm.register("email")} />
                  </div>
                  <Button type="button" onClick={() => setView('verify-otp')} className="w-full bg-brand-primary text-white">Gửi mã xác nhận</Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setView('login')}>Quay lại đăng nhập</Button>
                </form>
              </motion.div>
            )}

            {/* OTP VIEW */}
            {view === 'verify-otp' && (
              <motion.div key="verify-otp" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Xác thực OTP</h2>
                  <p className="text-slate-500 mt-2">Mã gồm 6 chữ số đã được gửi qua Email/SMS của bạn.</p>
                </div>
                <form className="space-y-6">
                  <div className="flex justify-center">
                    <Input className="text-center text-2xl tracking-[0.5em] font-mono h-14" maxLength={6} placeholder="------" {...otpForm.register("otp")} />
                  </div>
                  <Button type="button" onClick={() => setView('login')} className="w-full bg-brand-primary text-white">Xác nhận & Hoàn tất</Button>
                  <p className="text-center text-sm text-slate-500 mt-4">Chưa nhận được mã? <button type="button" className="text-brand-primary hover:underline">Gửi lại (59s)</button></p>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
